const ClassSchedule = require("../../model/classSheduleModel");
const ConductedClass = require("../../model/conductedClassSchema");
const DemoClass = require("../../model/demoClassModel");
const kidModel = require("../../model/kidModel");

const validateKidChessId = async (req, res) => {
  try {
    const { chessId } = req.body;

    if (!chessId) {
      return res.status(400).json({ message: "Chess ID is required." });
    }

    const kid = await kidModel.findOne({ chessId }, { _id: 1 });

    if (!kid) {
      return res
        .status(404)
        .json({ message: "Chess ID not found for any kid." });
    }

    res.status(200).json({ message: "Chess ID is valid.", kid });
  } catch (err) {
    console.log("Error in validating the chess ID:", err);
    res
      .status(500)
      .json({ message: "Server error while validating Chess ID." });
  }
};

const validateKidPin = async (req, res) => {
  try {
    const { pin, state } = req.body;
    console.log("Welcome to verify pin", pin, state);

    const kid = await kidModel.findOne({ _id: state });

    if (!kid) {
      return res.status(404).json({ message: "Kid not found" });
    }

    if (kid.kidPin == pin.join("")) {
      return res
        .status(200)
        .json({ message: "Pin verified successfully", kidId: kid._id });
    } else {
      return res.status(401).json({ message: "Invalid pin" });
    }
  } catch (err) {
    console.error("Error in validating the pin: ", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getDemoClass = async (req, res) => {
  try {
    console.log("Welcome to fetch the demo class", req.params);

    const { id } = req.params;
    const demoClassData = await DemoClass.findOne({ kidId: id },{date:1,time:1,programs:1});

    if (!demoClassData) {
      return res.status(404).json({ message: "Demo class not found" });
    }

    return res.status(200).json({
      message: "Demo class fetched successfully",
      data: demoClassData,
    });
  } catch (err) {
    console.error("Error in fetching the demo class:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getKidClassData = async (req, res) => {
  try {
    const { kidId } = req.params;
    console.log(kidId) 
  

    if (!kidId) {
      return res.status(400).json({ message: "Invalid kidId provided." });
    }

    // Fetch conducted classes containing the specific student
    const conductedClasses = await ConductedClass.aggregate([
      { $match: { "students.studentID": kidId } }, // Match classes containing the kidId
      {
        $project: {
          _id: 1,
          classID: 1,
          coachId: 1,
          conductedDate: 1,
          status: 1,
          student: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$students",
                  as: "student",
                  cond: { $eq: ["$$student.studentID", kidId] },
                },
              },
              0,
            ],
          },
        },
      },
    ]);

    // Retrieve the class details for conducted classes
    const conductedClassDetails = await Promise.all(
      conductedClasses.map(async (conductedClass) => {
        const classData = await ClassSchedule.findById(conductedClass.classID).lean();
        return { ...conductedClass, classData };
      })
    );

    console.log("conductedClassDetails",conductedClassDetails)
 
    // Fetch all scheduled classes
    const allClasses = await ClassSchedule.find({
      "selectedStudents.kidId": kidId,
      status: "Scheduled",
    }).lean();
    console.log("All class shedules",allClasses)

 
    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString("en-US", { weekday: "long" });
    const currentTime = currentDate.getTime();

    const liveClasses = [];
    const upcomingClasses = [];

    // Categorize live and upcoming classes
    allClasses.forEach((classItem) => {
      const [startTime, endTime] = classItem.classTime
        .split(" - ")
        .map((time) => new Date(`${currentDate.toDateString()} ${time}`).getTime());

      if (classItem.day == currentDay) { 
        if (currentTime >= startTime || currentTime <= endTime) {
          liveClasses.push(classItem); 
        } else if (currentTime < startTime) {
          upcomingClasses.push(classItem);
        }
      } else {
        upcomingClasses.push(classItem);
      }
    });

    const responseData = {
      conducted: conductedClassDetails, // Include conducted class data with class details
      live: liveClasses,
      upcoming: upcomingClasses,
    };

    console.log(responseData) 

    return res.status(200).json({
      message: "Kid's class data retrieved successfully.",
      responseData,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "An error occurred while fetching the class details." });
  }
};


 










module.exports = {
  validateKidChessId,
  validateKidPin,
  getDemoClass,
  getKidClassData
};
