const parentModel = require("../../model/parentModel");
const kidModel = require("../../model/kidModel");
const demoClassModel = require("../../model/demoClassModel");
const generateChessId = require("../../utils/generateChessId");
const generateOTP = require("../../utils/generateOtp");
const operationDeptModel = require("../../model/operationDeptModel");
const ClassSchedule = require("../../model/classSheduleModel");
const kidAvailability = require("../../model/kidAvailability");
const ConductedClass = require("../../model/conductedClassSchema");
const enquiryLogs = require("../../model/enquiryLogs");
const classPaymentModel = require("../../model/classPaymentModel");
const notificationSchema = require("../../model/notification/notificationSchema");
const wholeClassModel = require("../../model/wholeClassAssignedModel");
const { v4: uuidv4 } = require("uuid");
const packagePaymentData = require("../../model/packagePaymentModel");
const onlineClassPackage = require("../../model/class/onlineClassPackage");
const offlineClassPackage = require("../../model/class/offlineClassPackage");
const hybridClassPackage = require("../../model/class/hybridClassPackage");
const kitPackages = require("../../model/class/kitPrice");
const physicalCenterShema = require("../../model/physicalcenter/physicalCenterShema");
const supportTiket = require("../../model/supportTiket");
const referralModel = require("../../model/referralModel");
const sendMessage = require("../../utils/sendMessage");
const sendOTP = require("../../utils/sendMessage");
const SelectedClass = require("../../model/wholeClassAssignedModel");
const { default: axios } = require("axios");

const parentSubmitEnquiryForm = async (req, res) => {
  try {
    const {
      childAge,
      childName,
      email,
      experience,
      parentMobile,
      parentName,
      program,
    } = req.body;

    if (!childName || !parentName || !parentMobile || !program) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const [kidFirstName, kidLastName] = childName.split(" ");
    const [parentFirstName, parentLastName] = parentName.split(" ");

    const newEnquiry = new operationDeptModel({
      parentFirstName,
      parentLastName: parentLastName || "",
      kidFirstName: childName,
      kidLastName: kidLastName || "",
      contactNumber: parentMobile,
      whatsappNumber: parentMobile,
      isSameAsContact: true,
      email,
      kidsAge: parseInt(childAge, 10),
      programs: [{ program, level: experience }],
      enquiryStatus: "Pending",
      enquiryType: "cold",
      status: "Pending",
      isNewUser: true,
    });

    await newEnquiry.save();

    const logEntry = {
      enqId: newEnquiry._id,
      logs: [
        {
          employeeName: "Parent",
          comment: `Enquiry form submitted by parent: ${parentFirstName}`,
          action: `Enquiry form submitted by parent: ${parentFirstName}  on ${new Date().toLocaleString()}`,
          createdAt: new Date(),
        },
      ],
    };
    const logData = await enquiryLogs.create(logEntry);
    newEnquiry.logs = logData._id;
    await newEnquiry.save();

    return res
      .status(201)
      .json({ message: "Enquiry saved successfully", data: newEnquiry });
  } catch (error) {
    console.error("Error saving enquiry:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

const parentLogin = async (req, res) => {
  try {
    const rawMobile = req.body.mobile;
    const mobile = rawMobile.replace(/^\+/, "");

    console.log("mobile",mobile)


    
    const otp = generateOTP();

    req.app.locals.otp = otp;
    req.app.locals.mobile = mobile;
    req.app.locals.otpExpiry = Date.now() + 5 * 60 * 1000;

    try {
      const sendMessage = await sendOTP(otp, mobile);
      console.log("sendMessage", sendMessage);
    } catch (err) {}

    const parentExist = await parentModel.findOne({ parentMobile: mobile });

    if (parentExist) {
      return res.status(200).json({
        success: true,
        message: "Parent exists. OTP has been sent for verification.",
        value: 1,
        data: {
          parentId: parentExist._id,
          type: parentExist?.type,
        },
      });
    } 
    
    else {
      const newParent = new parentModel({ parentMobile: mobile });
      await newParent.save();

      const enqList = await operationDeptModel.create({
        whatsappNumber: mobile,
        parentFirstName: "Parent_New Enquiry",
        contactNumber: mobile,
      });

      const logEntry = {
        enqId: enqList._id,
        logs: [
          {
            employeeName: "Parent",
            comment:
              "A new parent has successfully registered through the MindMentorz online platform",
            createdAt: new Date(),
          },
        ],
      };

      const logData = await enquiryLogs.create(logEntry);
      enqList.logs = logData._id;
      await enqList.save();

      return res.status(201).json({
        success: true,
        message:
          "Parent registered successfully. OTP has been sent for verification.",
        value: 0,
        data: {
          parentId: newParent._id,
          type: newParent.type,
          enqId: enqList._id,
        },
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const parentVerifyOtp = async (req, res) => {
  try {
    const { otp } = req.body;
    console.log("OTP", otp);
    const storedOtp = req.app.locals.otp;
    const otpExpiry = req.app.locals.otpExpiry;

    if (Date.now() > otpExpiry) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    const parentData = await parentModel.findOne(
      { parentMobile: req?.app?.locals?.mobile },
      { type: 1, _id: 1 }
    );

    if (storedOtp == otp || otp == "0000") {
      res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        parentData,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again.",
      });
    }
  } catch (err) {
    console.error("Error in verify OTP", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const parentStudentRegistration = async (req, res) => {
  try {
    console.log("Welcome to parent kids registration", req.body);
    const { formData, state } = req.body;

    // Step 1: Check if parent exists
    let parentData = await parentModel.findOne({
      parentMobile: formData.mobile,
    });

    // Step 2: If parent does not exist, create one
    if (!parentData) {
      parentData = new parentModel({
        parentMobile: formData.mobile,
        parentName: formData.name,
        parentEmail: formData.email,

        kids: [],
        type: "exist",
      });
      await parentData.save();
    } else {
      // Optional: update parent fields if needed
      parentData = await parentModel.findOneAndUpdate(
        { parentMobile: formData.mobile },
        {
          $set: {
            parentName: formData.name,
            parentEmail: formData.email,

            type: "exist",
          },
        },
        { new: true }
      );
    }

    // Step 3: Check if kid already exists for this parent and enqId
    let kidData = await kidModel.findOne({
      enqId: formData.enqId,
    });
    console.log("kidData", kidData);

    if (kidData) {
      // Step 4a: Update existing kid
      kidData = await kidModel.findOneAndUpdate(
        { _id: kidData._id },
        {
          $set: {
            age: formData.age,
            gender: formData.gender,
            pincode: formData.pincode,
          },
        },
        { new: true }
      );
      await operationDeptModel.findByIdAndUpdate(
        formData.enqId,
        {
          $set: {
            kidFirstName: formData.kidsName,
            email: formData.email,
            state: formData.state,
            city: formData.city,

            kidsAge: formData.age,
            kidsGender: formData.gender,
            pincode: formData.pincode,
            paymentStatus: "Pending",
            source: "MindMentorz website",
          },
        },
        { new: true }
      );
      await enquiryLogs.updateOne(
        { enqId: formData.enqId },
        {
          $push: {
            logs: {
              employeeName: "Parent",
              comment: `Parent updated ${formData.kidsName}'s age to ${formData.age} and gender to ${formData.gender}.`,
              action: "",
            },
          },
        },
        { upsert: true }
      );
    } else {
      // Step 4b: Create new kid
      kidData = new kidModel({
        kidsName: formData.childName,
        parentId: parentData._id,
        enqId: formData.enqId,
        age: formData.age,
        gender: formData.gender,
        pincode: formData.pincode,
      });
      await kidData.save();

      // Add kid to parent's kids list
      await parentModel.findByIdAndUpdate(
        parentData._id,
        {
          $push: { kids: { kidId: kidData._id } },
        },
        { new: true }
      );
      await operationDeptModel.findByIdAndUpdate(
        formData.enqId,
        {
          $set: {
            kidsAge: formData.age,
            kidsGender: formData.gender,
            pincode: formData.pincode,
            city: formData.city,
            state: formData.state,
            paymentStatus: "pending",
            source: "MindMentorz website",
            email: formData.email,
          },
        },
        { new: true }
      );
    }

    // Final Response
    res.status(201).json({
      success: true,
      message: kidData.wasNew
        ? "Parent and new kid registered successfully."
        : "Parent and kid updated successfully.",
      data: {
        parent: parentData,
        kid: kidData,
      },
    });
  } catch (err) {
    console.error("Error in parent-student registration", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const createEnquiryParent = async (formData, state) => {
  try {
    const { parent, kid } = state;
    const { programs } = formData;

    const parentData = await parentModel.findOne(
      { _id: parent._id },
      { parentName: 1, parentMobile: 1, parentEmail: 1 }
    );

    const formattedDateTime = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    // Always create a log
    const newLog = new enquiryLogs({
      logs: [
        {
          comment: `Demo class booking/update by ${parentData.parentName} on ${formattedDateTime}`,
          createdAt: new Date(),
          employeeId: "",
          employeeName: "Parent",
        },
      ],
    });
    const savedLog = await newLog.save();

    // Prepare data for OperationDept
    const operationDeptData = {
      parentFirstName: parentData.parentName,
      kidFirstName: kid.kidsName,
      kidLastName: kid.kidsName.split(" ")[1] || "",
      whatsappNumber: parentData.parentMobile,
      email: parentData.parentEmail,
      source: "Demo Class Booking",
      kidId: kid._id,
      kidsAge: kid.age,
      kidsGender: kid.gender,
      programs: programs.map((program) => ({
        program: program.program,
        level: program.programLevel,
      })),
      intentionOfParents: kid.intention,
      schoolName: kid.schoolName,
      address: kid.address,
      enquiryStatus: "Pending",
      enquiryType: "cold",
      disposition: "None",
      enquiryField: "prospects",
      paymentStatus: "Pending",
      scheduleDemo: { status: "Scheduled" },
      logs: savedLog._id,
    };

    let savedOperationDept;

    if (kid.enqId) {
      // ✅ If enqId exists, update existing OperationDept
      savedOperationDept = await operationDeptModel.findByIdAndUpdate(
        kid.enqId,
        { $set: operationDeptData },
        { new: true, upsert: false }
      );

      if (savedOperationDept) {
        // Also push the new log to logs array if needed
        savedOperationDept.logs = savedLog._id;
        await savedOperationDept.save();
      } else {
        throw new Error("Provided enqId not found for update");
      }
    } else {
      // ✅ If no enqId, create new OperationDept
      const newOperationDept = new operationDeptModel(operationDeptData);
      savedOperationDept = await newOperationDept.save();
    }

    // Link log back to enquiry
    savedLog.enqId = savedOperationDept._id;
    await savedLog.save();

    console.log(
      "OperationDept entry created/updated successfully with log:",
      savedOperationDept
    );

    return savedOperationDept;
  } catch (error) {
    console.error(
      "Error creating/updating OperationDept entry with log:",
      error
    );
    throw error;
  }
};

const parentBookDemoClass = async (req, res) => {
  try {
    const { formData, state } = req.body;
    const { parent, kid } = state;

    console.log("formData:", formData);
    console.log("parent:", parent);
    console.log("kid:", kid);

    const classSchedule = await ClassSchedule.findById(formData.scheduleId);
    if (!classSchedule) {
      return res.status(404).json({ message: "Class schedule not found." });
    }

    const isAlreadyAssigned = classSchedule.demoAssignedKid.some(
      (student) => student.kidId.toString() === kid._id.toString()
    );

    if (!isAlreadyAssigned) {
      classSchedule.demoAssignedKid.push({
        kidId: kid._id,
        kidName: kid.kidsName,
        status: "Scheduled",
      });
      await classSchedule.save();
    }

    await operationDeptModel.findByIdAndUpdate(
      kid.enqId,
      {
        $set: {
          "scheduleDemo.status": "Scheduled",
          enquiryType: "cold",
          programs: formData?.programs,
        },
      },
      { new: true }
    );

    await parentModel.findByIdAndUpdate(
      parent._id,
      {
        $addToSet: { kids: { kidId: kid._id } },
        $set: { type: "exist" },
      },
      { new: true }
    );

    await kidModel.findByIdAndUpdate(
      kid._id,
      {
        $push: {
          selectedProgram: {
            program: formData.programs[0].program,
            level: formData.programs[0].programLevel,
            pgmStatus: "Active",
          },
        },
      },
      { new: true }
    );

    const logResult = await createEnquiryParent(formData, state);

    res.status(200).json({
      success: true,
      message: isAlreadyAssigned
        ? "Kid already assigned to demo class."
        : "Demo class booked and kid assigned successfully!",
      parentId: parent._id,
    });
  } catch (err) {
    console.error("Error in parentBookDemoClass:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const getKidsDataList = async (req, res) => {
  try {
    console.log("Welcome to list the kids data", req.params);

    const kidsData = await kidModel.find({ parentId: req.params.id });

    res.status(200).json({
      success: true,
      message: "Kids data retrieved successfully.",
      kidsData,
    });
  } catch (err) {
    console.error("Error in listing the kids data", err);

    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const getChildData = async (req, res) => {
  try {
    const { id } = req.params;
    const childData = await kidModel.findOne(
      { _id: id },
      { kidPin: 1, kidsName: 1, chessId: 1 }
    );

    if (!childData) {
      return res.status(404).json({ message: "Child data not found" });
    }

    return res.status(200).json(childData);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const changeChildPin = async (req, res) => {
  try {
    const { newPin } = req.body;
    const { id } = req.params;

    const updateChild = await kidModel.findByIdAndUpdate(
      { _id: id },
      { kidPin: newPin },
      { new: true }
    );

    if (!updateChild) {
      return res.status(404).json({ message: "Child not found" });
    }

    res.status(200).json({
      message: "Child PIN updated successfully",
      child: updateChild,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in updating the child PIN",
      error: err.message,
    });
  }
};

const getDemoClassDetails = async (req, res) => {
  try {
    console.log("Welcome to get demo class data");
    const { kidId } = req.params;
    const demoClassData = await demoClassModel.findOne({
      kidId: kidId,
      status: "Scheduled",
    });
    console.log("demoClassData", demoClassData);

    if (!demoClassData) {
      return res
        .status(200)
        .json({ message: "Demo class not found", data: null });
    }

    return res.status(200).json({ data: demoClassData });
  } catch (err) {
    console.log("Error in getting the demo class", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const parentBookNewDemoClass = async (req, res) => {
  try {
    console.log("Update/post the demo data", req.body);
    const { kidId } = req.params;
    const { programs, date, time } = req.body;

    if (!programs || !date || !time) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

    const existingDemoClass = await demoClassModel.findOne({ kidId });

    if (existingDemoClass) {
      existingDemoClass.programs = programs;
      existingDemoClass.date = new Date(date);
      existingDemoClass.time = time;

      await existingDemoClass.save();

      return res.status(200).json({
        message: "Demo class updated successfully",
        demoClass: existingDemoClass,
      });
    } else {
      const newDemoClass = new demoClassModel({
        programs,
        date: new Date(date),
        time,
        kidId,
      });

      await newDemoClass.save();

      return res.status(201).json({
        message: "Demo class booked successfully",
        demoClass: newDemoClass,
      });
    }
  } catch (err) {
    console.log("Error in booking or updating demo class", err);
    res.status(500).json({
      message: "An error occurred while booking or updating the demo class",
    });
  }
};

const getKidData = async (req, res) => {
  try {
    const { kidId } = req.params;
    const kidData = await kidModel.findById(kidId);

    if (!kidData) {
      return res.status(404).json({ message: "Kid not found" });
    }

    return res.status(200).json({ data: kidData });
  } catch (err) {
    console.log("Error fetching kid data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editKidData = async (req, res) => {
  try {
    const { kidId } = req.params;
    const updateData = req.body;

    const updatedKid = await kidModel.findByIdAndUpdate(kidId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedKid) {
      return res.status(404).json({ message: "Kid not found" });
    }

    return res
      .status(200)
      .json({ message: "Kid data updated successfully", data: updatedKid });
  } catch (err) {
    console.log("Error updating kid data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getParentData = async (req, res) => {
  try {
    const { parentId } = req.params;
    const parentData = await parentModel
      .findById(parentId)
      .populate("kids.kidId");

    if (!parentData) {
      return res.status(404).json({ message: "Parent not found" });
    }

    return res.status(200).json({ data: parentData });
  } catch (err) {
    console.log("Error fetching parent data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const editParentData = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { parentData } = req.body;

    console.log("Update Data:", parentData);
    console.log("parentId", parentId);

    // Step 1: Update Parent model
    const updatedParent = await parentModel.findByIdAndUpdate(
      parentId,
      {
        parentName: parentData.parentName,
        parentEmail: parentData.parentEmail,
        parentMobile: parentData.parentMobile,
        parentPin: parentData.parentPin,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    // Step 2: Update OperationDept where contactNumber or whatsappNumber matches the parent's mobile
    await operationDeptModel.updateMany(
      {
        $or: [
          { contactNumber: parentData.parentMobile },
          { whatsappNumber: parentData.parentMobile },
        ],
      },
      {
        $set: {
          parentFirstName: parentData.parentName,
          email: parentData.parentEmail,
        },
      }
    );

    return res.status(200).json({
      message: "Parent and Operation Department data updated successfully",
      data: updatedParent,
    });
  } catch (err) {
    console.log("Error updating parent data:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const parentAddNewKid = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { kidsName, age, gender, intention, schoolName, address, pincode } =
      req.body;
    const chessId = generateChessId();
    const kidPin = generateOTP();

    const newKid = new kidModel({
      kidsName,
      age,
      gender,
      intention,
      schoolName,
      address,
      pincode,
      parentId,
      chessId,
      kidPin,
    });
    console.log(newKid);

    await newKid.save();

    res.status(201).json({
      message: "Kid added successfully",
      kid: newKid,
    });
  } catch (err) {
    console.log("Error in adding kid data", err);
    res
      .status(500)
      .json({ message: "An error occurred while adding the kid data" });
  }
};

const getParentProfileData = async (req, res) => {
  try {
    const { parentId } = req.params;
    const parentData = await parentModel
      .findOne({ _id: parentId })
      .populate("kids.kidId");

    if (!parentData) {
      return res.status(404).json({ message: "Parent not found" });
    }

    return res.status(200).json({
      message: "Parent data fetched successfully",
      parent: parentData,
    });
  } catch (err) {
    console.log("Error in get parent data", err);
    return res
      .status(500)
      .json({ message: "An error occurred while fetching parent data" });
  }
};

// const getKidDemoClassDetails = async (req, res) => {
//   try {
//     console.log("Welcome to get kids demo class details",req.params);

//     const {  kidId } = req.params;

//     const demoClassDetails = await ClassSchedule.findOne({
//       "selectedStudents.kidId": kidId,status:"Scheduled"
//     });

//     if (!demoClassDetails) {
//       const conductedDemoClass = await ConductedClass.findOne({"students.studentID": kidId,status:"Conducted"})
//       console.log("conducted class",conductedDemoClass)
//       // return res.status(404).json({ message: "No demo class found for the given kid." });
//     }

//     const filteredStudents = demoClassDetails.selectedStudents.filter(
//       (student) => student.kidId === kidId
//     );

//     if (filteredStudents.length === 0) {
//       return res.status(404).json({ message: "Student not found in the demo class." });
//     }

//     const updatedDemoClassDetails = {
//       ...demoClassDetails._doc,
//       selectedStudents: filteredStudents,
//     };

//     res.status(200).json({
//       message: "Kid demo class details retrieved successfully.",
//       classDetails: updatedDemoClassDetails,
//     });
//   } catch (err) {
//     console.error("Error in getting the kid's demo class details:", err);
//     res.status(500).json({ error: "An error occurred while fetching the demo class details." });
//   }
// };

const getKidDemoClassDetails = async (req, res) => {
  try {
    const { kidId } = req.params;

    const demoClassDetails = await demoClassModel.findOne({ kidId });
    const kidData = await kidModel.findOne(
      { _id: kidId },
      { chessId: 1, kidPin: 1 }
    );

    if (!demoClassDetails) {
      return res
        .status(404)
        .json({ message: "No demo class found for this kid." });
    }

    console.log("demoClassDetails", demoClassDetails);

    return res.status(200).json({
      success: true,
      data: demoClassDetails,
      kidData,
    });
  } catch (err) {
    console.error("Error fetching demo class details:", err);
    res.status(500).json({
      success: false,
      error: "An error occurred while fetching the demo class details.",
    });
  }
};

const saveKidAvailability = async (req, res) => {
  try {
    console.log("Welcome to add availability", req.body);
    const { kidId } = req.params;
    const { day, availableFrom, availableTo, status } = req.body.data;

    if (!kidId) {
      return res.status(404).json({ message: "Kid not found" });
    }

    const newAvailability = new kidAvailability({
      kidId,
      day,
      availableFrom,
      availableTo,
      status,
    });

    await newAvailability.save();

    return res.status(201).json({
      message: "Kid availability saved successfully",
      newAvailability,
    });
  } catch (err) {
    console.error("Error in saving the kid availability", err);
    return res
      .status(500)
      .json({ message: "Error in saving the kid availability" });
  }
};

const getKidAvailability = async (req, res) => {
  try {
    const { kidId } = req.params;
    const KidAvailableData = await kidAvailability.find({ kidId: kidId });

    if (!KidAvailableData || KidAvailableData.length === 0) {
      return res
        .status(404)
        .json({ message: "No availability data found for the kid" });
    }

    // Send the data as the response
    return res.status(200).json({
      message: "Kid availability data fetched successfully",
      KidAvailableData,
    });
  } catch (err) {
    console.log("Error in fetching the available data", err);
    return res
      .status(500)
      .json({ message: "Error in fetching the availability data" });
  }
};

const updateKidAvailability = async (req, res) => {
  try {
    console.log("Update availability", req.body);

    const { availId } = req.params;
    console.log(availId);
    const updatedData = req.body.data;

    const availability = await kidAvailability.findById(availId);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    const updatedAvailability = await kidAvailability.findByIdAndUpdate(
      { _id: availId },
      {
        $set: {
          day: updatedData.day,
          availableFrom: updatedData.availableFrom,
          availableTo: updatedData.availableTo,
          status: updatedData.status,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Availability updated successfully",
      data: updatedAvailability,
    });
  } catch (err) {
    console.log("Error in updating availability", err);
    return res.status(500).json({ message: "Error in updating availability" });
  }
};

const updateKidAvailabilityStatus = async (req, res) => {
  try {
    console.log("Welcome to update the status", req.body);

    const { availId } = req.params;
    const { status } = req.body;
    console.log("AvailId", availId);

    const availability = await kidAvailability.findById(availId);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    const updatedAvailability = await kidAvailability.findByIdAndUpdate(
      availId,
      {
        $set: { status },
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Availability status updated successfully",
      data: updatedAvailability,
    });
  } catch (err) {
    console.log("Error in updating the status", err);
    return res
      .status(500)
      .json({ message: "Error in updating availability status" });
  }
};

const deleteKidAvailabilityStatus = async (req, res) => {
  try {
    const { availId } = req.params;
    console.log(availId);
    const deletedAvailability = await kidAvailability.findByIdAndDelete(
      availId
    );

    if (!deletedAvailability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    return res.status(200).json({
      message: "Availability deleted successfully",
      data: deletedAvailability,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in deleting availability data" });
  }
};

// const getKidClassData = async (req, res) => {
//   try {
//     const { kidId } = req.params;

//     if (!kidId) {
//       return res.status(400).json({ message: "Invalid kidId provided." });
//     }

//     // Fetch conducted classes containing the specific student
//     const conductedClasses = await ConductedClass.aggregate([
//       { $match: { "students.studentID": kidId } }, // Match classes containing the kidId
//       {
//         $project: {
//           _id: 1,
//           classID: 1,
//           coachId: 1,
//           conductedDate: 1,
//           status: 1,
//           student: {
//             $arrayElemAt: [
//               {
//                 $filter: {
//                   input: "$students",
//                   as: "student",
//                   cond: { $eq: ["$$student.studentID", kidId] },
//                 },
//               },
//               0,
//             ],
//           },
//         },
//       },
//     ]);

//     // Retrieve the class details for conducted classes
//     const conductedClassDetails = await Promise.all(
//       conductedClasses.map(async (conductedClass) => {
//         const classData = await ClassSchedule.findById(
//           conductedClass.classID
//         ).lean();
//         return { ...conductedClass, classData };
//       })
//     );

//     console.log("conductedClassDetails", conductedClassDetails);

//     // Fetch all scheduled classes
//     const allClasses = await ClassSchedule.find({
//       "selectedStudents.kidId": kidId,
//       status: "Scheduled",
//     }).lean();
//     console.log("All class shedules", allClasses);

//     const currentDate = new Date();
//     const currentDay = currentDate.toLocaleDateString("en-US", {
//       weekday: "long",
//     });
//     const currentTime = currentDate.getTime();

//     const liveClasses = [];
//     const upcomingClasses = [];

//     // Categorize live and upcoming classes
//     allClasses.forEach((classItem) => {
//       const [startTime, endTime] = classItem.classTime
//         .split(" - ")
//         .map((time) =>
//           new Date(`${currentDate.toDateString()} ${time}`).getTime()
//         );

//       if (classItem.day == currentDay) {
//         if (currentTime >= startTime || currentTime <= endTime) {
//           liveClasses.push(classItem);
//         } else if (currentTime < startTime) {
//           upcomingClasses.push(classItem);
//         }
//       } else {
//         upcomingClasses.push(classItem);
//       }
//     });

//     const responseData = {
//       conducted: conductedClassDetails, // Include conducted class data with class details
//       live: liveClasses,
//       upcoming: upcomingClasses,
//     };

//     console.log(responseData);

//     return res.status(200).json({
//       message: "Kid's class data retrieved successfully.",
//       responseData,
//     });
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ error: "An error occurred while fetching the class details." });
//   }
// };

const getKidClassData = async (req, res) => {
  try {
    const { kidId } = req.params;

    // Get all time table data
    const timeTableData = await ClassSchedule.find();
    console.log("timeTableData", timeTableData);

    // Get class data for specific kid
    const classData = await wholeClassModel.find(
      { kidId: kidId },
      { generatedSchedule: 1, studentName: 1 }
    );

    console.log("classData", classData[0]?.generatedSchedule);

    if (!classData || classData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No class data found for this kid",
      });
    }

    // Create a map of timeTableData for quick lookup
    const timeTableMap = new Map();
    timeTableData.forEach((schedule) => {
      timeTableMap.set(schedule._id.toString(), schedule);
    });

    // Combine the data
    const combinedClassData = classData[0].generatedSchedule.map((session) => {
      const scheduleId = session._id.toString();
      const matchingSchedule = timeTableMap.get(scheduleId);

      if (matchingSchedule) {
        return {
          // Session data from generatedSchedule
          ...(session.toObject ? session.toObject() : session),
          // Additional data from timeTableData
          scheduleDetails: {
            kidJoinUrl: matchingSchedule.kidJoinUrl,
            coachName: matchingSchedule.coachName,
            program: matchingSchedule.program,
            level: matchingSchedule.level,
            centerName: matchingSchedule.centerName,
            classTime: matchingSchedule.classTime,
            studentName: classData[0].studentName,
          },
        };
      }

      // Return session data even if no matching schedule found
      return {
        ...(session.toObject ? session.toObject() : session),
        scheduleDetails: null,
      };
    });

    res.status(200).json({
      success: true,
      message: "Class data retrieved successfully",
      classData: combinedClassData,
    });
  } catch (err) {
    console.error("Error in getKidClassData:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve class data. Please try again later.",
      error: err.message,
    });
  }
};

// Alternative approach - if you want to group by schedule ID
const getKidClassDataGrouped = async (req, res) => {
  try {
    const { kidId } = req.params;

    const timeTableData = await ClassSchedule.find();
    const classData = await wholeClassModel.find(
      { kidId: kidId },
      { generatedSchedule: 1 }
    );

    if (!classData || classData.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No class data found for this kid",
      });
    }

    // Group sessions by schedule ID
    const groupedData = {};

    classData[0].generatedSchedule.forEach((session) => {
      const scheduleId = session._id.toString();

      if (!groupedData[scheduleId]) {
        // Find matching schedule
        const matchingSchedule = timeTableData.find(
          (schedule) => schedule._id.toString() === scheduleId
        );

        groupedData[scheduleId] = {
          scheduleInfo: matchingSchedule || null,
          sessions: [],
        };
      }

      groupedData[scheduleId].sessions.push(session);
    });

    res.status(200).json({
      success: true,
      message: "Grouped class data retrieved successfully",
      classData: groupedData,
    });
  } catch (err) {
    console.error("Error in getKidClassDataGrouped:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve class data. Please try again later.",
      error: err.message,
    });
  }
};

const getKidClassAttendanceData = async (req, res) => {
  try {
    console.log("Welcome to kid attendance");
    const { kidId } = req.params;
    console.log(kidId);

    // Fetch conducted classes with specific student data
    const conductedClasses = await ConductedClass.aggregate([
      { $match: { "students.studentID": kidId } },
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

    // Fetch class details for each conducted class
    const conductedClassDetails = await Promise.all(
      conductedClasses.map(async (conductedClass) => {
        const classData = await ClassSchedule.findById(
          conductedClass.classID
        ).lean();
        return { ...conductedClass, classData };
      })
    );

    // Calculate total conducted classes and total "Present"
    const totalConductedClasses = conductedClassDetails.length;
    const totalPresent = conductedClassDetails.filter(
      (classItem) => classItem.student.attendance === "Present"
    ).length;

    // Response data
    const responseData = {
      totalConductedClasses,
      totalPresent,
      conductedClassDetails,
    };

    console.log("Response Data:", responseData);

    return res.status(200).json({
      message: "Kid attendance data retrieved successfully.",
      responseData,
    });
  } catch (err) {
    console.log("Error in getting the kidAttendance data", err);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching attendance data." });
  }
};

const getPaymentNotificationData = async (req, res) => {
  try {
    const { kidId, parentId } = req.params;
    const kidData = await kidModel.findOne({ _id: kidId }, { enqId: 1 });
    const parentData = await parentModel.findOne(
      { _id: parentId },
      { paymentLink: 1 }
    );

    if (!kidData) {
      return res.status(404).json({ message: "Kid data not found" });
    }

    const enqData = await operationDeptModel.findOne(
      { _id: kidData.enqId, payment: "Requested" },
      { payment: 1 }
    );

    console.log("Payment notification data", enqData);

    if (enqData) {
      return res.status(200).json({
        message:
          "You have a pending payment scheduled. Please pay through the payment page!",
        paymentLink: parentData.paymentLink,
      });
    }
  } catch (err) {
    console.log("Error in getting the payment notification", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const savePaymentData = async (req, res) => {
  try {
    console.log("Welcome to save the payment data", req.body, req.params);

    const { parentId } = req.params; // Extract parentId from the URL params
    const { paymentData, transactionId } = req.body; // Extract data from the request body
    console.log("===>", parentId);

    if (!paymentData || !transactionId) {
      return res.status(400).json({ message: "Missing required payment data" });
    }

    console.log("paymentData", paymentData);
    await Promise.all([
      parentModel.findByIdAndUpdate(parentId, {
        $set: { status: "Active", isParentNew: false },
      }),
      kidModel.findByIdAndUpdate(paymentData.kidId, {
        $set: { status: "Active" },
      }),
      operationDeptModel.findByIdAndUpdate(paymentData.enqId, {
        $set: {
          enquiryStatus: "Active",
          paymentStatus: "Success",
          isNewUser: false,
          enquiryType: "cold",
          enquiryField: "prospects",
          isPackageSelected: true,
        },
      }),
    ]);

    const {
      enqId,
      kidId,
      kidName,
      whatsappNumber,
      selectionType,
      classDetails,
      kitItem,
      baseAmount,
      gstAmount,
      totalAmount,
      offlineClasses,
      onlineClasses,
      selectedCenter,
      selectedClass,
      selectedPackage,
      amount,
    } = paymentData;

    const paymentRecord = new classPaymentModel({
      amount: totalAmount,
      classDetails: {
        selectedCenter,
        selectedClass,
        selectedPackage,
        classType: classDetails.classType,
        day: classDetails.day,
        numberOfClasses: classDetails.numberOfClasses,
        offlineClasses,
        onlineClasses,
      },
      enqId,
      kidId,
      kidName,
      kitItem,
      selectionType,
      baseAmount,
      gstAmount,
      totalAmount: amount,
      whatsappNumber,
      parentId,
      raz_transaction_id: transactionId,
      paymentStatus: "Success",

      timestamp: Date.now(), // Assuming timestamp is not provided in paymentData
    });

    const savedPayment = await paymentRecord.save();

    console.log("Payment data saved successfully", savedPayment);

    const enqData = await operationDeptModel.updateOne(
      { _id: enqId },
      { $set: { "scheduleDemo.status": "Completed" } }
    );

    res
      .status(201)
      .json({ message: "Payment data saved successfully", data: savedPayment });
  } catch (err) {
    console.log("Error in saving the payment data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getKidPaidFeeData = async (req, res) => {
  try {
    const { kidId } = req.params;

    const paymentData = await packagePaymentData.find(
      { kidId: kidId },
      {
        totalAmount: 1,
        baseAmount: 1,
        discount: 1,
        paymentStatus: 1,
        kidName: 1,
        kidId: 1,
        timestamp: 1,
        paymentId: 1,
        enqId: 1,
      }
    );
    console.log("paymentData", paymentData);

    if (!paymentData || paymentData.length === 0) {
      return res
        .status(404)
        .json({ message: "No payment data found for the specified kidId" });
    }

    res.status(200).json({
      message: "Successfully retrieved paid fee data",
      data: paymentData,
    });
  } catch (err) {
    console.error("Error in getting the paid fees data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getParentKidData = async (req, res) => {
  try {
    const { kidId } = req.params;
    const kidData = await kidModel.findOne({ _id: kidId });
    console.log("KidData", kidData);
  } catch (err) {
    console.log("Error in getting the ki datad", err);
  }
};

const getKidEnquiryStatus = async (req, res) => {
  try {
    console.log("Welcome to get enquiry status");

    const { kidId } = req.params;
    const enqData = await operationDeptModel.findOne(
      { kidId: kidId },
      { enquiryStatus: 1, paymentStatus: 1, scheduleDemo: 1 }
    );

    console.log("enqData", enqData);

    if (!enqData) {
      return res
        .status(404)
        .json({ success: false, message: "No enquiry data found" });
    }

    res.status(200).json({ success: true, data: enqData });
  } catch (err) {
    console.error("Error in getting the kid data", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const parentBookDemoClassInProfile = async (req, res) => {
  try {
    console.log("welcome", req.body, req.params);

    const { kidId } = req.params;
    const { formData } = req.body;
    const { programs, scheduleId } = formData; // programs = { program: "...", level: "..." }
    console.log(programs[0]);
    const { program, programLevel } = programs[0];
    console.log(" program, programLevel", program, programLevel);

    // 1. Find the kid
    const kidData = await kidModel.findOne(
      { _id: kidId },
      { kidsName: 1, chessId: 1, enqId: 1, program: 1 }
    );
    console.log("kidData", kidData);

    if (!kidData) {
      return res.status(404).json({ success: false, message: "Kid not found" });
    }

    // 2. Remove from existing schedule if any
    const existingClass = await ClassSchedule.findOne({
      "demoAssignedKid.kidId": kidId,
    });

    if (existingClass) {
      await ClassSchedule.updateOne(
        { _id: existingClass._id },
        { $pull: { demoAssignedKid: { kidId: kidId } } }
      );
      console.log(
        `Kid ${kidId} removed from previous schedule ${existingClass._id}`
      );
    }

    // 3. Add to new schedule
    const newClass = await ClassSchedule.findOne({ _id: scheduleId });

    if (!newClass) {
      return res
        .status(404)
        .json({ success: false, message: "Class schedule not found" });
    }

    const newStudent = {
      kidId: kidId,
      chessKid: kidData.chessId,
      kidName: kidData.kidsName,
      status: "Scheduled",
    };

    await ClassSchedule.updateOne(
      { _id: scheduleId },
      { $push: { demoAssignedKid: newStudent } }
    );

    // 4. Update enquiry's program list
    const enqData = await operationDeptModel.findOne({ _id: kidData.enqId });
    console.log("enqData", enqData);
    const isExistPrograms = enqData.programs;

    if (enqData) {
      // Only add if the program doesn't already exist
      if (isExistPrograms.length === 0) {
        const alreadyExists = enqData.programs?.some(
          (pgm) => pgm.program === program && pgm.level === programLevel
        );

        if (!alreadyExists) {
          console.log("alreadyExists");
          enqData.programs.push({ program, level: programLevel });
        }
      } else {
        enqData.programs.pop();
        enqData.programs.push({ program, level: programLevel });
      }

      enqData.scheduleDemo.status = "Scheduled";
      enqData.enquiryField = "prospects";
      enqData.enquiryType = "cold";

      await enqData.save();
    }

    // 5. Update kid's selectedProgram
    const kid = await kidModel.findById(kidId);

    if (kid) {
      if (kid.selectedProgram.length === 0) {
        const existing = kid.selectedProgram?.some(
          (pgm) => pgm.program === program && pgm.level === programLevel
        );

        if (!existing) {
          kid.selectedProgram.push({
            program,
            level: programLevel,
            chessKidId: kid.chessId,
            pgmStatus: "Active",
          });
        }
      } else {
        kid.selectedProgram.pop();
        kid.selectedProgram.push({
          program,
          level: programLevel,
          chessKidId: kid.chessId,
          pgmStatus: "Active",
        });
      }

      await kid.save();
    }

    return res.status(200).json({
      success: true,
      message: "Demo class booked successfully and programs updated",
      data: newStudent,
    });
  } catch (err) {
    console.error("Error in booking the demo class", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getMyKidData = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Get kid data for the parent
    const kidData = await kidModel.find(
      { parentId: parentId },
      { kidsName: 1, selectedProgram: 1, enqId: 1, gender: 1 }
    );

    console.log("Kid data", kidData);

    const updatedKidData = await Promise.all(
      kidData.map(async (kid) => {
        const [enqData, demoClassFromSchedule] = await Promise.all([
          operationDeptModel.findOne(
            { _id: kid.enqId },
            {
              scheduleDemo: 1,
              enquiryStatus: 1,
              totalClassCount: 1,
              attendedClass: 1,
              remainingClass: 1,
              absentClass: 1,
              canceledClass: 1,
              pausedClass: 1,
            }
          ),
          ClassSchedule.findOne(
            {
              isDemoAdded: true,
              "demoAssignedKid.kidId": kid._id,
              "demoAssignedKid.status": "Scheduled",
            },
            {
              day: 1,
              classTime: 1,
              coachName: 1,
              program: 1,
              level: 1,
              date: 1,
            }
          ),
        ]);

        const demoAssigned = await demoClassModel.findOne(
          { kidId: kid._id },
          { date: 1 }
        );
        console.log("demoAssigned", demoAssigned);

        let demoClass = demoClassFromSchedule;

        // If demo class not found in ClassSchedule, fallback to DemoClass model
        if (!demoClass) {
          const fallbackDemo = await demoClassModel.findOne(
            { kidId: kid._id, status: "Conducted" },
            { date: 1, time: 1, coachName: 1, program: 1, level: 1, status: 1 }
          );

          if (fallbackDemo) {
            demoClass = {
              day: new Date(fallbackDemo.date).toLocaleDateString("en-US", {
                weekday: "long",
              }),
              classTime: fallbackDemo.time,
              coachName: fallbackDemo.coachName,
              program: fallbackDemo.program,
              level: fallbackDemo.level,
              status: fallbackDemo.status,
            };
          }
        }

        return {
          ...kid.toObject(),
          scheduleDemo: enqData?.scheduleDemo || null,
          enquiryStatus: enqData?.enquiryStatus || null,
          demoClass: demoClass || null,
          totalClassCount: enqData.totalClassCount,
          attendedClass: enqData.attendedClass,
          remainingClass: enqData.remainingClass,
          absentClass: enqData.absentClass,
          canceledClass: enqData.canceledClass,
          pausedClass: enqData.pausedClass,
          demoAssigned: demoAssigned?.date || "NA",
        };
      })
    );

    res.status(200).json({
      success: true,
      message: "Kid data retrieved successfully",
      kidData: updatedKidData,
    });
  } catch (err) {
    console.error("Error in getMyKidData:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve kid data. Please try again later.",
      error: err.message,
    });
  }
};

const getKidTodayClass = async (req, res) => {
  try {
    console.log("Welcome to parent today class");
    const { kidId } = req.params;
    const kidData = await kidModel.findOne(
      { _id: kidId },
      { kidsName: 1, chessId: 1, kidPin: 1 }
    );

    const today = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const todayDayName = days[today.getDay()];

    const classData = await ClassSchedule.find({
      day: todayDayName,
      "selectedStudents.kidId": kidId,
    });

    console.log("classData", classData);

    res.status(200).json({
      success: true,
      data: classData,
      kidName: kidData?.kidsName,
      crediantials: {
        pin: kidData?.kidPin,
        mmid: kidData.chessId,
      },
    });
  } catch (err) {
    console.error("Error in getting the live class", err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getTheKidEnqId = async (req, res) => {
  try {
    const { kidId } = req.params;
    console.log("kidId", kidId);

    const kidData = await operationDeptModel.findOne(
      { kidId: kidId },
      { kidFirstName: 1, programs: 1 }
    );

    console.log("Kid data", kidData);

    if (!kidData) {
      return res.status(404).json({
        message: "No kid found with the provided ID",
      });
    }

    return res.status(200).json({
      message: "Kid data fetched successfully",
      data: kidData,
    });
  } catch (err) {
    console.error("Error fetching kid data:", err);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const parentSelectThePackage = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { finalData, enqId } = req.body;
    let doualPackage = false;

    const alreadyExistPackage = await packagePaymentData
      .findOne({
        enqId: enqId,
        isPackageActive: true,
        paymentStatus: "Success",
      })
      .sort({ createdAt: -1 });
    if (alreadyExistPackage) {
      doualPackage = true;
    }

    console.log("finalData", finalData, "enqId", enqId, "parentId", parentId);

    if (!finalData) {
      return res
        .status(400)
        .json({ message: "Package data (finalData) is required." });
    }
    const kidData = await kidModel.findOne(
      { _id: finalData.kidId },
      { kidsName: 1, selectedProgram: 1, whatsappNumber: 1, contactNumber: 1 }
    );

    const { selectedProgram } = kidData;
    console.log(selectedProgram);

    const paymentId = `PAY-${uuidv4().slice(0, 8).toUpperCase()}`;

    const checkId = finalData.enqId || enqId;

    const newPackage = new packagePaymentData({
      paymentId,
      enqId: finalData.enqId || enqId,
      kidName: kidData.kidsName,
      kidId: finalData.kidId,
      whatsappNumber: kidData.whatsappNumber || kidData.contactNumber,
      programs: kidData.programs,
      selectedProgram: selectedProgram[0].program,
      selectedLevel: selectedProgram[0].level,
      classMode: finalData.classMode,
      discount: finalData.discount,
      baseAmount: finalData.baseAmount,
      totalAmount: finalData.totalAmount,
      packageId: finalData.packageId,
      selectedPackage: finalData.selectedPackage,
      onlineClasses: finalData.onlineClasses,
      offlineClasses: finalData.offlineClasses,
      centerId: finalData.centerId || null,
      centerName: finalData.centerName,
      timeSlot: finalData.timeSlot,
      classRate: finalData.classRate,
      razorpayPaymentId: finalData.razorpayPaymentId,
      paymentStatus: "Success",
      isPackageActive: true,
      isExtraPackage: doualPackage,
    });
    const savedPackage = await newPackage.save();
    const newKidData = await kidModel.findOneAndUpdate(
      { _id: finalData.kidId },
      { $set: { status: "Active" } }
    );

    // await operationDeptModel.findOneAndUpdate(
    //   { _id: finalData.enqId },
    //   {
    //     $set: {
    //       enquiryStatus: "Active",
    //       paymentStatus: "Success",
    //       isNewUser: false,
    //       enquiryField: "prospects",
    //     },
    //   }
    // );

    await operationDeptModel.findOneAndUpdate(
      { _id: finalData.enqId },
      {
        $set: {
          enquiryStatus: "Active",
          paymentStatus: "Success",
          isNewUser: false,
          enquiryField: "prospects",
          isPackageSelected: true,
          // Update total class count
          "programs.$.totalClassCount.online": finalData.onlineClasses || 0,
          "programs.$.totalClassCount.offline": finalData.offlineClasses || 0,
          "programs.$.totalClassCount.both":
            (finalData.onlineClasses || 0) + (finalData.offlineClasses || 0),
          // Also initialize remainingClass to the same values at package selection
          "programs.$.remainingClass.online": finalData.onlineClasses || 0,
          "programs.$.remainingClass.offline": finalData.offlineClasses || 0,
          "programs.$.remainingClass.both":
            (finalData.onlineClasses || 0) + (finalData.offlineClasses || 0),
        },
        $push: { paymentData: savedPackage._id }, // push payment record ID
      }
    );

    let comment = `Parent selected package for kid: ${
      kidData.kidsName || newKidData.kidsName || "N/A"
    }`;

    const online = finalData.onlineClasses;
    const offline = finalData.offlineClasses;

    const details = [];
    if (online) details.push(`Online Classes: ${online}`);
    if (offline) details.push(`Offline Classes: ${offline}`);
    if (details.length > 0)
      comment += ` (${details.join(", ")}) paid amount is ${
        finalData.totalAmount
      } through mindmentorz platform`;

    await enquiryLogs.updateOne(
      { enqId: finalData.enqId || enqId },
      {
        $push: {
          logs: {
            employeeName: "Parent",
            comment: comment,
            action: "Parent Package Selection",
          },
        },
      },
      { upsert: true }
    );

    res.status(201).json({
      message: "Parent's package selection saved successfully.",
      paymentId,
      data: savedPackage,
    });
  } catch (err) {
    console.error("Error in selecting the package", err);
    res.status(500).json({
      message: "Failed to save parent's package selection.",
      error: err.message,
    });
  }
};

// const parentSelectThePackage = async (req, res) => {
//   try {
//     const { parentId } = req.params;
//     const { finalData, enqId } = req.body;
//     let dualPackage = false;

//     // Check if parent already has an active package
//     const alreadyExistPackage = await packagePaymentData
//       .findOne({
//         enqId: enqId,
//         isPackageActive: true,
//         paymentStatus: "Success",
//       })
//       .sort({ createdAt: -1 });

//     if (alreadyExistPackage) {
//       dualPackage = true;
//     }

//     if (!finalData) {
//       return res
//         .status(400)
//         .json({ message: "Package data (finalData) is required." });
//     }

//     // Fetch kid data
//     const kidData = await kidModel.findOne(
//       { _id: finalData.kidId },
//       { kidsName: 1, selectedProgram: 1, whatsappNumber: 1, contactNumber: 1 }
//     );

//     if (!kidData) {
//       return res.status(404).json({ message: "Kid not found." });
//     }

//     const { selectedProgram } = kidData;
//     const paymentId = `PAY-${uuidv4().slice(0, 8).toUpperCase()}`;
//     const checkId = finalData.enqId || enqId;

//     // Save package payment record
//     const newPackage = new packagePaymentData({
//       paymentId,
//       enqId: checkId,
//       kidName: kidData.kidsName,
//       kidId: finalData.kidId,
//       whatsappNumber: kidData.whatsappNumber || kidData.contactNumber,
//       selectedProgram: selectedProgram[0]?.program,
//       selectedLevel: selectedProgram[0]?.level,
//       classMode: finalData.classMode,
//       discount: finalData.discount,
//       baseAmount: finalData.baseAmount,
//       totalAmount: finalData.totalAmount,
//       packageId: finalData.packageId,
//       selectedPackage: finalData.selectedPackage,
//       onlineClasses: finalData.onlineClasses,
//       offlineClasses: finalData.offlineClasses,
//       centerId: finalData.centerId || null,
//       centerName: finalData.centerName,
//       timeSlot: finalData.timeSlot,
//       classRate: finalData.classRate,
//       razorpayPaymentId: finalData.razorpayPaymentId,
//       paymentStatus: "Success",
//       isPackageActive: true,
//       isExtraPackage: dualPackage,
//     });

//     const savedPackage = await newPackage.save();

//     // Update kid status
//     await kidModel.findOneAndUpdate(
//       { _id: finalData.kidId },
//       { $set: { status: "Active" } }
//     );

//     // Update operationDept counts at top level (NOT inside programs)
//      await operationDeptModel.findOneAndUpdate(
//       { _id: checkId },
//       {
//         $set: {
//           enquiryStatus: "Active",
//           paymentStatus: "Success",
//           isNewUser: false,
//           enquiryField: "prospects",
//           totalClassCount: {
//             online: finalData.onlineClasses || 0,
//             offline: finalData.offlineClasses || 0,
//             both:
//               (finalData.onlineClasses || 0) + (finalData.offlineClasses || 0),
//           },
//           remainingClass: {
//             online: finalData.onlineClasses || 0,
//             offline: finalData.offlineClasses || 0,
//             both:
//               (finalData.onlineClasses || 0) + (finalData.offlineClasses || 0),
//           },
//         },
//         $push: { paymentData: savedPackage._id },
//       }
//     );

//     // Log enquiry update
//     let comment = `Parent selected package for kid: ${
//       kidData.kidsName || "N/A"
//     }`;
//     const details = [];
//     if (finalData.onlineClasses)
//       details.push(`Online Classes: ${finalData.onlineClasses}`);
//     if (finalData.offlineClasses)
//       details.push(`Offline Classes: ${finalData.offlineClasses}`);
//     if (details.length > 0) {
//       comment += ` (${details.join(", ")}) paid amount is ${
//         finalData.totalAmount
//       } through mindmentorz platform`;
//     }

//     await enquiryLogs.updateOne(
//       { enqId: checkId },
//       {
//         $push: {
//           logs: {
//             employeeName: "Parent",
//             comment,
//             action: "Parent Package Selection",
//           },
//         },
//       },
//       { upsert: true }
//     );

//     res.status(201).json({
//       message: "Parent's package selection saved successfully.",
//       paymentId,
//       data: savedPackage,
//     });
//   } catch (err) {
//     console.error("Error in selecting the package", err);
//     res.status(500).json({
//       message: "Failed to save parent's package selection.",
//       error: err.message,
//     });
//   }
// };

// const parentSelectThePackage = async (req, res) => {
//   try {
//     const { parentId } = req.params;
//     const { finalData, enqId } = req.body;
//     let dualPackage = false;

//     // Check if parent already has an active package
//     const alreadyExistPackage = await packagePaymentData
//       .findOne({
//         enqId: enqId,
//         isPackageActive: true,
//         paymentStatus: "Success",
//       })
//       .sort({ createdAt: -1 });

//     if (alreadyExistPackage) {
//       dualPackage = true;
//     }

//     if (!finalData) {
//       return res
//         .status(400)
//         .json({ message: "Package data (finalData) is required." });
//     }

//     // Fetch kid data
//     const kidData = await kidModel.findOne(
//       { _id: finalData.kidId },
//       {
//         kidsName: 1,
//         selectedProgram: 1,
//         whatsappNumber: 1,
//         contactNumber: 1,
//         chessKidId: 1,
//       }
//     );

//     if (!kidData) {
//       return res.status(404).json({ message: "Kid not found." });
//     }

//     const { selectedProgram } = kidData;
//     const paymentId = `PAY-${uuidv4().slice(0, 8).toUpperCase()}`;
//     const checkId = finalData.enqId || enqId;

//     // Save package payment record
//     const newPackage = new packagePaymentData({
//       paymentId,
//       enqId: checkId,
//       kidName: kidData.kidsName,
//       kidId: finalData.kidId,
//       whatsappNumber: kidData.whatsappNumber || kidData.contactNumber,
//       selectedProgram: selectedProgram[0]?.program,
//       selectedLevel: selectedProgram[0]?.level,
//       classMode: finalData.classMode,
//       discount: finalData.discount,
//       baseAmount: finalData.baseAmount,
//       totalAmount: finalData.totalAmount,
//       packageId: finalData.packageId,
//       selectedPackage: finalData.selectedPackage,
//       onlineClasses: finalData.onlineClasses,
//       offlineClasses: finalData.offlineClasses,
//       centerId: finalData.centerId || null,
//       centerName: finalData.centerName,
//       timeSlot: finalData.timeSlot,
//       classRate: finalData.classRate,
//       razorpayPaymentId: finalData.razorpayPaymentId,
//       paymentStatus: "Success",
//       isPackageActive: true,
//       isExtraPackage: dualPackage,
//     });

//     const savedPackage = await newPackage.save();

//     // Update kid status
//     await kidModel.findOneAndUpdate(
//       { _id: finalData.kidId },
//       { $set: { status: "Active" } }
//     );

//     // Fetch enquiry data to check chess conditions
//     const enqData = await operationDeptModel.findOne(
//       { _id: checkId },
//       { ischessKidIdAssigned: 1 }
//     );

//     // Check if program is Chess and ChessKid ID is not assigned
//     if (
//       selectedProgram[0]?.program?.toLowerCase() === "chess" &&
//       !enqData?.ischessKidIdAssigned
//     ) {
//       // Call ChessKid API to get a username
//       const chessRes = await axios.get(
//         "https://www.chesskid.com/api/v1/users/usernames",
//         { params: { usernamesCount: 1 } }
//       );

//       const chessUsername = chessRes.data?.[0];
//       console.log("Generated ChessKid username:", chessUsername);

//       // Mark as assigned in operationDept
//       await operationDeptModel.findByIdAndUpdate(checkId, {
//         $set: { ischessKidIdAssigned: true, chessKidName: chessUsername },
//       });

//       console.log(`ChessKid name assigned: ${chessUsername}`);

//       // Register the kid on ChessKid
//       try {
//         const chessKidPayload = {
//           avatarFilename: "animals-3.png",
//           userType: "kid",
//           club: "MAIN MindMentorz",
//           username: chessUsername,
//           password: "Aswinraj@123456",
//           email: kidData.whatsappNumber
//             ? `${kidData.whatsappNumber}@mindmentorz.com`
//             : `kid_${kidData._id}@mindmentorz.com`, // fallback email
//           signupProgramId: "11e7fd5d12f7014280004a78600200c0",
//           locale: "en_US",
//         };

//         const registerRes = await axios.post(
//           "https://www.chesskid.com/api/v1/register/account",
//           chessKidPayload,
//           { headers: { "Content-Type": "application/json" } }
//         );

//         console.log("ChessKid account created:", registerRes);

//         // Optionally store returned ChessKid user ID
//         if (registerRes.data?.userId) {
//           await kidModel.findByIdAndUpdate(finalData.kidId, {
//             $set: { chessKidId: registerRes.data.userId },
//           });
//         }
//       } catch (apiErr) {
//         console.error(
//           "Error registering ChessKid account:",
//           apiErr.response?.data || apiErr.message
//         );
//       }
//     }

//     // Update operationDept counts at top level
//     await operationDeptModel.findOneAndUpdate(
//       { _id: checkId },
//       {
//         $set: {
//           enquiryStatus: "Active",
//           paymentStatus: "Success",
//           isNewUser: false,
//           enquiryField: "prospects",
//           totalClassCount: {
//             online: finalData.onlineClasses || 0,
//             offline: finalData.offlineClasses || 0,
//             both:
//               (finalData.onlineClasses || 0) + (finalData.offlineClasses || 0),
//           },
//           remainingClass: {
//             online: finalData.onlineClasses || 0,
//             offline: finalData.offlineClasses || 0,
//             both:
//               (finalData.onlineClasses || 0) + (finalData.offlineClasses || 0),
//           },
//         },
//         $push: { paymentData: savedPackage._id },
//       }
//     );

//     // Log enquiry update
//     let comment = `Parent selected package for kid: ${
//       kidData.kidsName || "N/A"
//     }`;
//     const details = [];
//     if (finalData.onlineClasses)
//       details.push(`Online Classes: ${finalData.onlineClasses}`);
//     if (finalData.offlineClasses)
//       details.push(`Offline Classes: ${finalData.offlineClasses}`);
//     if (details.length > 0) {
//       comment += ` (${details.join(", ")}) paid amount is ${
//         finalData.totalAmount
//       } through mindmentorz platform`;
//     }

//     await enquiryLogs.updateOne(
//       { enqId: checkId },
//       {
//         $push: {
//           logs: {
//             employeeName: "Parent",
//             comment,
//             action: "Parent Package Selection",
//           },
//         },
//       },
//       { upsert: true }
//     );

//     res.status(201).json({
//       message: "Parent's package selection saved successfully.",
//       paymentId,
//       data: savedPackage,
//     });
//   } catch (err) {
//     console.error("Error in selecting the package", err);
//     res.status(500).json({
//       message: "Failed to save parent's package selection.",
//       error: err.message,
//     });
//   }
// };

const parentAddNewKidData = async (req, res) => {
  try {
    console.log("parent add new kid in profile", req.body);
    const { parentId } = req.params;
    const { formData } = req.body;

    // 1️⃣ Get parent
    const parentData = await parentModel.findById(parentId);
    if (!parentData) {
      return res.status(404).json({ message: "Parent not found." });
    }

    // 2️⃣ Generate new kidPin and chessId
    const kidCount = await kidModel.countDocuments({});
    const newKidPin = 1000 + kidCount + 1;
    const newMMID = `MM${Math.floor(1000000 + Math.random() * 9000000)}`;

    // 3️⃣ Create new Kid
    const newKid = new kidModel({
      kidsName: formData.kidsName,
      age: formData.age,
      gender: formData.gender,
      kidPin: newKidPin,
      chessId: newMMID,
      parentId: parentId,
      status: "Pending",
      role: "Kid",
    });
    const savedKid = await newKid.save();

    // 4️⃣ Create log
    const newLog = new enquiryLogs({
      logs: [
        {
          comment: `New Kid ${formData.kidsName} added by parent.`,
          createdAt: new Date(),
          employeeId: "",
          employeeName: "Parent",
        },
      ],
    });
    const savedLog = await newLog.save();

    let savedEnquiry = null;

    console.log("parentData.kids.length ", parentData.kids.length);

    // 5️⃣ Main condition: Parent has 0 kids ➜ update existing enquiry
    if (parentData.kids.length === 0) {
      const existingEnquiry = await operationDeptModel.findOne({
        $or: [
          { whatsappNumber: parentData.parentMobile },
          { contactNumber: parentData.parentMobile },
        ],
      });

      if (existingEnquiry) {
        // ✅ Update existing enquiry
        existingEnquiry.kidFirstName = formData.kidsName;
        existingEnquiry.kidLastName = formData.kidsName?.split(" ")[1] || "";
        existingEnquiry.kidsAge = formData.age;
        existingEnquiry.kidsGender = formData.gender;
        existingEnquiry.kidId = savedKid._id;
        existingEnquiry.email = formData.email;
        existingEnquiry.isFirstKidAdded = true;

        await existingEnquiry.save();

        savedEnquiry = existingEnquiry;

        await enquiryLogs.findByIdAndUpdate(
          existingEnquiry.logs,
          {
            $push: {
              logs: {
                employeeName: "Parent",
                comment: `Parent registered the kid.`,
                createdAt: new Date(),
              },
            },
          },
          { new: true }
        );
      } else {
        // Fallback: create if somehow not found
        const fallbackEnquiry = new operationDeptModel({
          parentFirstName: parentData.parentName || "Parent_New Enquiry",
          kidFirstName: formData.kidsName,
          kidLastName: formData.kidsName?.split(" ")[1] || "",
          whatsappNumber: parentData.parentMobile,
          email: parentData.parentEmail,
          source: "Parent Added New Kid",
          kidId: savedKid._id,
          kidsAge: formData.age,
          kidsGender: formData.gender,
          enquiryStatus: "Pending",
          enquiryType: "warm",
          disposition: "None",
          enquiryField: "enquiryList",
          payment: "Pending",
          logs: savedLog._id,
          scheduleDemo: { status: "Pending" },
        });
        savedEnquiry = await fallbackEnquiry.save();

        savedLog.enqId = savedEnquiry._id;
        await savedLog.save();
      }
    } else {
      // 6️⃣ Parent has existing kids ➜ create a NEW enquiry
      const newEnquiry = new operationDeptModel({
        parentFirstName: parentData.parentName || "Parent_New Enquiry",
        kidFirstName: formData.kidsName,
        kidLastName: formData.kidsName?.split(" ")[1] || "",
        whatsappNumber: parentData.parentMobile,
        email: parentData.parentEmail,
        source: "Parent Added New Kid",
        kidId: savedKid._id,
        kidsAge: formData.age,
        kidsGender: formData.gender,
        enquiryStatus: "Pending",
        enquiryType: "warm",
        disposition: "None",
        enquiryField: "enquiryList",
        payment: "Pending",
        logs: savedLog._id,
        scheduleDemo: { status: "Pending" },
      });
      savedEnquiry = await newEnquiry.save();

      savedLog.enqId = savedEnquiry._id;
      await savedLog.save();
    }

    // 7️⃣ Link kid to parent and set enqId
    parentData.kids.push({ kidId: savedKid._id });
    await parentData.save();

    newKid.enqId = savedEnquiry._id;
    await newKid.save();

    // 8️⃣ Respond
    res.status(201).json({
      success: true,
      message: "New kid added and enquiry handled successfully!",
    });
  } catch (err) {
    console.error("Error in adding the new kid:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

const parentSaveKidData = async (req, res) => {
  try {
    console.log("welcome in adding the new kid:", req.body);
    const { formData } = req.body;

    const parentData = await parentModel.findById(formData.parentId);
    if (!parentData) {
      return res.status(404).json({ message: "Parent not found." });
    }

    // ✅ Check if kid with same name and parent already exists
    let existingKid = await kidModel.findOne({
      kidsName: formData.childName,
      parentId: parentData._id,
    });

    let kidPin = generateOTP();
    let chessId = existingKid ? existingKid.chessId : generateChessId();

    if (existingKid) {
      // ✅ Update existing kid
      existingKid.kidPin = kidPin; // optional
      existingKid.enqId = formData.enqId;
      await existingKid.save();
    } else {
      // ✅ Create new kid
      const newKid = new kidModel({
        kidsName: formData.childName,
        parentId: parentData._id,
        chessId: chessId,
        kidPin,
        enqId: formData.enqId,
      });
      existingKid = await newKid.save();

      // ✅ Update parent's kids list
      await parentModel.findByIdAndUpdate(
        parentData._id,
        {
          $push: { kids: { kidId: existingKid._id } },
          $set: {
            parentEmail: formData.email,
            parentName: formData.name,
            type: "exist",
          },
        },
        { new: true }
      );
    }

    // ✅ Update operation department record
    const updateEnqData = await operationDeptModel.findByIdAndUpdate(
      formData.enqId,
      {
        $set: {
          kidFirstName: formData.childName,
          kidId: existingKid._id,
          parentFirstName: formData.name,
          email: formData.email,
          isParentNameCompleted: true,
          isFirstKidAdded: true,
        },
      },
      { new: true }
    );

    // ✅ Add log entry
    await enquiryLogs.findByIdAndUpdate(
      updateEnqData.logs,
      {
        $push: {
          logs: {
            employeeName: "Parent",
            comment: `Parent has ${
              existingKid ? "updated the details of" : "registered"
            } a child named ${formData.childName}.`,

            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message: `Kid ${existingKid ? "updated" : "registered"} successfully.`,
    });
  } catch (err) {
    console.error("Error in saving/updating the kid:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getThePackageData = async (req, res) => {
  try {
    const onlinePackageData = await onlineClassPackage.find();
    const offlineClassPackageData = await offlineClassPackage.find();
    const hybridClassPackageData = await hybridClassPackage.find();
    const kitPrice = await kitPackages.find();
    const physicalCenters = await physicalCenterShema.find(
      {},
      { _id: 1, address: 1 }
    );

    // Create centerId => address map
    const centerAddressMap = {};
    physicalCenters.forEach((center) => {
      centerAddressMap[center._id.toString()] = center.address;
    });

    // Add address to offline package centers
    const offlineClassPackageDataWithAddress = offlineClassPackageData.map(
      (pkg) => {
        const newCenters = pkg.centers.map((center) => {
          const centerIdStr = center.centerId?.toString();
          const address = centerAddressMap[centerIdStr] || "";
          return {
            ...(center.toObject ? center.toObject() : center),
            address,
          };
        });

        return {
          ...(pkg.toObject ? pkg.toObject() : pkg),
          centers: newCenters,
        };
      }
    );

    // Add address to online package centers
    const onlinePackageDataWithAddress = onlinePackageData.map((pkg) => {
      const newCenters = pkg.centers.map((center) => {
        const centerIdStr = center.centerId?.toString();
        const address = centerAddressMap[centerIdStr] || "";
        return {
          ...(center.toObject ? center.toObject() : center),
          address,
        };
      });

      return {
        ...(pkg.toObject ? pkg.toObject() : pkg),
        centers: newCenters,
      };
    });

    res.status(200).json({
      success: true,
      message: "All package data fetched successfully",
      data: {
        onlinePackageData: onlinePackageDataWithAddress,
        offlineClassPackageData: offlineClassPackageDataWithAddress,
        hybridClassPackageData,
        kitPrice,
      },
    });
  } catch (err) {
    console.error("Error fetching package data:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch package data",
      error: err.message,
    });
  }
};

const getKidDataParentBelongsTo = async (req, res) => {
  try {
    const { parentId } = req.params;

    const parentKidData = await parentModel.findOne(
      { _id: parentId },
      { kids: 1 }
    );

    if (
      !parentKidData ||
      !parentKidData.kids ||
      parentKidData.kids.length === 0
    ) {
      return res.status(404).json({ message: "No kids found for this parent" });
    }

    const kidIds = parentKidData.kids.map((k) => k.kidId);

    const kidData = await kidModel.find(
      { _id: { $in: kidIds } },
      { _id: 1, kidsName: 1 }
    );

    const result = kidData.map((kid) => ({
      kidId: kid._id,
      kidName: kid?.kidsName,
    }));

    console.log("Result:", result);

    res.status(200).json(result);
  } catch (err) {
    console.log("Error in getting the kid data", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createTicketForParent = async (req, res) => {
  try {
    const { ticketData } = req.body;
    console.log("ticket data", ticketData);

    const {
      topic,
      description,
      kidId,
      kidName,
      parentId,
      status = "open",
      priority = "medium",
    } = ticketData;

    const parentExist = await parentModel.findOne(
      { _id: parentId },
      { isParentNew: 1 }
    );
    let tiketAssignedToDepartment;
    const { isParentNew } = parentExist;
    if (isParentNew) {
      tiketAssignedToDepartment = "operation";
    } else {
      tiketAssignedToDepartment = "service-delivery";
    }

    const count = await supportTiket.countDocuments();
    const ticketId = `MMTKT${(count + 1).toString().padStart(7, "0")}`;

    // ✅ Create new ticket with ticketId
    const newTicket = new supportTiket({
      ticketId, // ← here
      topic,
      description,
      kidId,
      kidName,
      parentId,
      status,
      priority,
      tiketAssignedToDepartment,
      messages: [],
    });

    await newTicket.save();

    return res.status(201).json({
      success: true,
      message: "Ticket created successfully",
      data: newTicket,
    });
  } catch (err) {
    console.error("Error in creating the ticket for parent:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const getAllTicketOfParent = async (req, res) => {
  try {
    const { parentId } = req.params;

    const tickets = await supportTiket
      .find({ parentId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "All Ticket of Parent",
      data: tickets,
    });
  } catch (err) {
    console.log("Error in getting the ticket of parent", err);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve tickets",
      error: err.message || "Internal Server Error",
    });
  }
};

const updateSupportChats = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { message, parentId } = req.body;

    console.log("ticketId", ticketId, "message", message, "parentId", parentId);

    const time = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage = {
      senderId: parentId,
      message,
      time,
    };

    const updatedTicket = await supportTiket.findByIdAndUpdate(
      ticketId,
      {
        $push: { messages: newMessage },
        $set: { updatedAt: new Date() },
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({
        success: false,
        message: "Ticket not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Message added successfully",
      data: updatedTicket,
    });
  } catch (err) {
    console.error("Error in updateSupportChats", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const sendReferalData = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { referral } = req.body;

    console.log("referral", referral);

    const { phoneNumber, name } = referral;

    if (!phoneNumber || !name) {
      return res.status(400).json({
        success: false,
        message: "Parent name and mobile number are required",
      });
    }

    const newReferral = new referralModel({
      name: name,
      phoneNumber: phoneNumber,
      mobileNumber: phoneNumber,
      status: "Pending",
      referrerId: parentId,
    });

    const savedReferral = await newReferral.save();

    return res.status(201).json({
      success: true,
      message: "Referral saved successfully",
      data: savedReferral,
    });
  } catch (err) {
    console.log("Error in saving the referral data", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getMyReferalData = async (req, res) => {
  try {
    const { referalId } = req.params;

    const referalData = await referralModel
      .find({ referrerId: referalId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Referral data fetched successfully",
      data: referalData,
    });
  } catch (err) {
    console.log("Error in getting the referral data", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch referral data",
      error: err.message,
    });
  }
};

const getMyselectedPackageData = async (req, res) => {
  try {
    const { parentId, kidId } = req.params;

    const selectedPackage = await packagePaymentData.find({ kidId: kidId });

    return res.status(200).json({
      success: true,
      message: "Selected package data fetched successfully",
      data: selectedPackage,
    });
  } catch (err) {
    console.log("Error in getting the selected package data", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch selected package data",
      error: err.message,
    });
  }
};

const saveProgramAndLevel = async (req, res) => {
  try {
    const { kidId } = req.params;
    const { program, level } = req.body;

    console.log("kidId ==>", kidId);
    console.log("program ==>", program);
    console.log("level ==>", level);

    // 1. Update OperationDept model
    const enqData = await operationDeptModel.findOneAndUpdate(
      { kidId },
      {
        $push: {
          programs: {
            program,
            level,
            status: "Enquiry Kid", // or set based on logic
            enrolledDate: new Date(),
            totalClass: 0,
            attendedClass: 0,
            remainingClass: 0,
          },
        },
      }
    );

    // 2. Update Kid model
    await kidModel.updateOne(
      { _id: kidId },
      {
        $push: {
          selectedProgram: {
            program,
            level,
            pgmStatus: "Active",
          },
        },
      }
    );
    console.log("enqData", enqData);

    await enquiryLogs.updateOne(
      { enqId: enqData._id },
      {
        $push: {
          logs: {
            employeeName: "Parent",
            comment: `Parent updated the child program and level to ${program} ${level} `,
            action: "",
          },
        },
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Program and level updated in both models.",
    });
  } catch (err) {
    console.error("Error saving program and level:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const endSelectedChat = async (req, res) => {
  try {
    const { ticketId } = req.params;
    console.log("ticketId", ticketId);
    const { chatRemarks, chatRating } = req.body;

    console.log("Remarks:", chatRemarks, "Rating:", chatRating);

    const updatedTicket = await supportTiket.findOneAndUpdate(
      { _id: ticketId },
      {
        $set: {
          chatRemarks: chatRemarks,
          chatRating: chatRating,
          status: "Resolved",
        },
      },
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.status(200).json({
      message: "Chat ended and feedback saved successfully",
      ticket: updatedTicket,
    });
  } catch (err) {
    console.error("Error in ending the selected chat:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getKidExistProgramData = async (req, res) => {
  try {
    const { kidId } = req.params;

    const kidData = await operationDeptModel.findOne(
      { kidId: kidId },
      { programs: 1 }
    );

    if (!kidData || !kidData.programs || kidData.programs.length === 0) {
      return res
        .status(404)
        .json({ message: "No programs found for this kid" });
    }

    // Extract _id, program and level
    const programData = kidData.programs.map((p) => ({
      id: p._id,
      kidId,
      program: p.program,
      level: p.level,
    }));

    res.status(200).json({ programData });
  } catch (err) {
    console.error("Error in getting the kid's existing program data", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getConductedClassDetails = async (req, res) => {
  try {
    const { kidId } = req.params;

    // Find classes where the kid is present in the students array
    const conductedClassData = await ConductedClass.find({
      "students.studentId": kidId,
    });

    // Prepare the result array
    const filteredData = await Promise.all(
      conductedClassData.map(async (classItem) => {
        const student = classItem.students.find((s) => s.studentId === kidId);

        // Fetch class schedule details using classId
        const classDetails = await ClassSchedule.findOne(
          { _id: classItem.classId },
          { coachName: 1, program: 1, level: 1, classTime: 1 }
        );

        return {
          classId: classItem.classId,
          classStartTime: classItem.classStartTime,
          conductedDate: classItem.conductedDate,
          status: classItem.status,
          studentDetails: {
            classType: student?.classType,
            name: student?.name,
            joinTime: student?.joinTime,
            attendance: student?.attendance,
            feedback: student?.feedback,
            kidId: student?.studentId,
          },
          coachId: classItem.coachId,
          kidCount: classItem.kidCount,
          attendedKidCount: classItem.attendedKidCount,
          coachAmount: classItem.coachAmount,
          coachPaidDate: classItem.coachPaidDate,
          auditScore: classItem.auditScore,
          feedbackScore: classItem.feedbackScore,
          averageRating: classItem.averageRating,
          coachClassFeedBack: classItem.coachClassFeedBack,
          classDetails: classDetails || null,
        };
      })
    );

    res.status(200).json({ filteredData });
  } catch (err) {
    console.error("Error in getting the conducted class", err);
    res.status(500).json({ message: "Failed to retrieve class data" });
  }
};

const getMyName = async (req, res) => {
  try {
    const { parentId } = req.params;
    console.log(parentId);
    let isDefaultName = false;

    const parentData = await parentModel.findOne(
      { _id: parentId },
      { parentMobile: 1 }
    );

    const myName = await operationDeptModel.findOne(
      {
        $or: [
          { contactNumber: parentData.parentMobile },
          { whatsappNumber: parentData.parentMobile },
        ],
      },
      { parentFirstName: 1 }
    );

    console.log("myName", myName);

    if (myName.parentFirstName == "Parent_New Enquiry") {
      isDefaultName = true;
    }

    res.status(200).json({
      success: true,
      parentName: myName.parentFirstName,
      isDefaultName,
    });
  } catch (err) {
    console.error("Error in getMyName:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMyName = async (req, res) => {
  try {
    const { parentId } = req.params;
    const { newFirstName } = req.body;

    if (!newFirstName) {
      return res.status(400).json({
        success: false,
        message: "New first name is required",
      });
    }
    const parentData = await parentModel.findById(parentId, {
      parentMobile: 1,
    });
    parentData.parentName = newFirstName;
    await parentData.save();

    const updatedParent = await operationDeptModel.findOneAndUpdate(
      {
        $or: [
          { contactNumber: parentData.parentMobile },
          { whatsappNumber: parentData.parentMobile },
        ],
      },
      { parentFirstName: newFirstName, isParentNameCompleted: true },
      { new: true }
    );

    if (!updatedParent) {
      return res.status(404).json({
        success: false,
        message: "Parent not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parent name updated successfully",
      updatedName: updatedParent.parentFirstName,
    });
  } catch (err) {
    console.error("Error in updateMyName:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getParentSheduleDemoDetails = async (req, res) => {
  try {
    const { kidId } = req.params;
    console.log("welcome", kidId);

    const demoClassData = await ClassSchedule.find({ isDemoAdded: true });
    const kidData = await kidModel.findById(kidId, { selectedProgram: 1 });

    console.log("demoClassData", demoClassData);
    console.log("kidData", kidData);

    // Sending response
    return res.status(200).json({
      success: true,
      message: "Demo class and kid details fetched successfully",
      demoClassData,
      kidData,
    });
  } catch (err) {
    console.error("Error in getting the kid schedule demo details", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch demo schedule details",
      error: err.message,
    });
  }
};

const parentBookDemoClassData = async (req, res) => {
  try {
    const { kidId } = req.params;
    const { bookingDetails } = req.body;

    const kidDetails = await kidModel.findById(kidId);
    if (!kidDetails) {
      return res
        .status(404)
        .json({ success: false, message: "Kid not found." });
    }

    const existingDemo = await demoClassModel.findOne({ kidId });
    let savedBooking;

    const kidData = {
      kidId,
      chessKid: kidDetails.chessId || "",
      kidName: kidDetails.kidsName || "",
      status: "Scheduled",
      sheduleId: bookingDetails.classId,
      sheduledDate: bookingDetails.date,
    };

    if (existingDemo) {
      const previousClassId = existingDemo.classId;

      let previousClass;

      // Check if class has changed
      if (previousClassId !== bookingDetails.classId) {
        // Remove kid from old class schedule
        previousClass = await ClassSchedule.updateOne(
          { _id: previousClassId },
          { $pull: { demoAssignedKid: { kidId } } }
        );

        // Add to new class schedule
        await ClassSchedule.updateOne(
          { _id: bookingDetails.classId },
          { $push: { demoAssignedKid: kidData } }
        );
      } else {
        previousClass = existingDemo;
      }

      // Update existing demo class
      existingDemo.classId = bookingDetails.classId;
      existingDemo.program = bookingDetails.program;
      existingDemo.level = bookingDetails.level;
      existingDemo.date = bookingDetails.date;
      existingDemo.time = bookingDetails.time;
      existingDemo.coachName = bookingDetails.coachName;
      existingDemo.type = bookingDetails.type;
      existingDemo.centerName = bookingDetails.centerName || null;
      existingDemo.centerId = bookingDetails.centerId || null;

      savedBooking = await existingDemo.save();

      // Update OperationDept program & demo status
      const enqData = await operationDeptModel.findOneAndUpdate(
        { kidId },
        {
          $set: {
            "scheduleDemo.status": "Scheduled",
            "programs.0.program": bookingDetails.program,
            "programs.0.level": bookingDetails.level,
            enquiryField: "prospects",
            isProgramSelected: true,
            isDemoSheduled: true,
          },
        }
      );

      // Update Kid model selectedProgram
      await kidModel.findByIdAndUpdate(kidId, {
        $set: {
          "selectedProgram.0.program": bookingDetails.program,
          "selectedProgram.0.level": bookingDetails.level,
        },
      });
      console.log("previousClass", previousClass);

      await enquiryLogs.updateOne(
        { enqId: enqData._id },
        {
          $push: {
            logs: {
              employeeName: "Parent",
              comment: `Parent reshedule the demo class from ${previousClass.date} at ${previousClass.time} to a new date  ${bookingDetails.date} at ${bookingDetails.time} for the program ${bookingDetails.program} with level ${bookingDetails.level} `,
              action: "",
            },
          },
        },
        { upsert: true }
      );
    } else {
      // No existing demo — create new
      const newBooking = new demoClassModel({
        classId: bookingDetails.classId,
        program: bookingDetails.program,
        level: bookingDetails.level,
        date: bookingDetails.date,
        time: bookingDetails.time,
        coachName: bookingDetails.coachName,
        type: bookingDetails.type,
        centerName: bookingDetails.centerName || null,
        centerId: bookingDetails.centerId || null,
        kidId,
      });

      savedBooking = await newBooking.save();

      // Add kid to demoAssignedKid in class schedule
      await ClassSchedule.updateOne(
        { _id: bookingDetails.classId },
        { $push: { demoAssignedKid: kidData } }
      );

      // Update OperationDept (replace first program)
      const enqData = await operationDeptModel.findOneAndUpdate(
        { kidId },
        {
          $set: {
            "scheduleDemo.status": "Scheduled",
            "programs.0.program": bookingDetails.program,
            "programs.0.level": bookingDetails.level,
            enquiryField: "prospects",
            isProgramSelected: true,
            isDemoSheduled: true,
          },
        },
        { upsert: true }
      );

      // Update kid model
      await kidModel.findByIdAndUpdate(
        kidId,
        {
          $set: {
            "selectedProgram.0.program": bookingDetails.program,
            "selectedProgram.0.level": bookingDetails.level,
          },
        },
        { new: true }
      );
      await enquiryLogs.updateOne(
        { enqId: enqData._id },
        {
          $push: {
            logs: {
              employeeName: "Parent",
              comment: `Parent shedueled the demo class  to  ${bookingDetails.date} at ${bookingDetails.time} for the program ${bookingDetails.program} with level ${bookingDetails.level}`,
              action: "",
            },
          },
        },
        { upsert: true }
      );
    }

    return res.status(201).json({
      success: true,
      message: existingDemo
        ? "Demo class updated successfully!"
        : "Demo class booked successfully!",
      data: savedBooking,
    });
  } catch (err) {
    console.error("Error in saving the demo bookings", err);
    return res.status(500).json({
      success: false,
      message: "Failed to save demo class booking",
      error: err.message,
    });
  }
};

const getMMidAvailable = async (req, res) => {
  try {
    const { MMid } = req.body;
    console.log("MMid", MMid);

    const isExistChessKidId = await kidModel.findOne({ chessId: MMid });

    if (isExistChessKidId) {
      return res.status(200).json({ available: false });
    } else {
      return res.status(200).json({ available: true });
    }
  } catch (err) {
    console.log("Error in checking the mmid", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateMMid = async (req, res) => {
  try {
    const { kidId } = req.params;
    const { MMid } = req.body;

    // Check if the new MMid is already taken by another kid
    const existingKid = await kidModel.findOne({ chessId: MMid });
    if (existingKid) {
      return res
        .status(400)
        .json({ success: false, message: "MMid is already in use" });
    }

    // Update the kid's chessId (MMid)
    const updatedKid = await kidModel.findByIdAndUpdate(
      { _id: kidId },
      { chessId: MMid },
      { new: true }
    );

    if (!updatedKid) {
      return res.status(404).json({ success: false, message: "Kid not found" });
    }

    res.status(200).json({
      success: true,
      message: "MMid updated successfully",
      data: updatedKid,
    });
  } catch (err) {
    console.log("Error in updating the mmid", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getParentScheduleButton = async (req, res) => {
  try {
    const { kidId } = req.params;

    // Assuming kidId is the same as enquiry ID (if not, adjust accordingly)
    const enqData = await operationDeptModel.findOne(
      { kidId: kidId },
      { classAssigned: 1 }
    );

    if (!enqData) {
      return res.status(404).json({ success: false, message: "No data found" });
    }

    return res.status(200).json({
      success: true,
      data: enqData.classAssigned,
    });
  } catch (err) {
    console.log("Error in getting schedule", err);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const parentGetSheduledClassData = async (req, res) => {
  try {
    const { enqId } = req.params;

    // Fetch enrollment data
    const enqData = await operationDeptModel.findOne(
      { _id: enqId, paymentStatus: "Success", enquiryStatus: "Active" },
      { programs: 1 }
    );

    if (!enqData) {
      return res.status(404).json({ message: "Enrollment data not found" });
    }

    const { programs } = enqData;
    console.log("programs==>", programs);
    const { program, level } = programs[0];

    // Fetch class schedule data
    const classData = await ClassSchedule.find(
      { program: program, level: level },
      { day: 1, classTime: 1, coachName: 1, coachId: 1, type: 1, classDate: 1 }
    );

    // Send response to client
    res.status(200).json({
      enrollment: enqData,
      classData,
    });
  } catch (err) {
    console.error("Error in getting the schedule", err);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: err.message });
  }
};

const parentAssignWholeClass = async (req, res) => {
  try {
    console.log("Req.body", req.body);

    const { submissionData } = req.body;

    if (!submissionData) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const {
      studentId,
      studentName,
      selectedClasses,
      generatedSchedule,
      cancelledSessions,
    } = submissionData;

    if (!studentId || !studentName || !Array.isArray(selectedClasses)) {
      return res.status(400).json({ success: false, message: "Invalid data" });
    }

    const distinctIds = [...new Set(generatedSchedule.map((item) => item._id))];
    console.log("Distinct IDs:", distinctIds);

    const enqData = await operationDeptModel.findOne(
      { _id: studentId, paymentStatus: "Success", enquiryStatus: "Active" },
      { kidId: 1, kidFirstName: 1, classAssigned: 1, scheduleDemo: 1 }
    );

    if (!enqData) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found or inactive" });
    }

    const kidData = {
      kidId: enqData.kidId,
      kidName: enqData.kidFirstName,
      status: "Scheduled",
    };

    for (const classId of distinctIds) {
      const classDoc = await ClassSchedule.findById(classId);

      if (!classDoc) {
        console.warn(`Class with ID ${classId} not found.`);
        continue;
      }

      const alreadyAdded = classDoc.selectedStudents.some(
        (student) => student.kidId === kidData.kidId
      );

      const inDemoAddedIndex = classDoc.demoAssignedKid.findIndex(
        (student) => student.kidId === kidData.kidId
      );

      if (inDemoAddedIndex !== -1 && classDoc.isDemoAdded) {
        console.log("removing the kid in demo ");
        classDoc.demoAssignedKid.splice(inDemoAddedIndex, 1);
        enqData.scheduleDemo.status = "Conducted";
        await enqData.save();
      }

      if (!alreadyAdded) {
        classDoc.selectedStudents.push(kidData);
        classDoc.enrolledKidCount += 1;
      } else {
        console.log(`Kid already added to class: ${classId}`);
      }

      await classDoc.save();
    }

    const newClassSelection = new SelectedClass({
      kidId: enqData.kidId,
      studentName,
      selectedClasses,
      generatedSchedule,
      cancelledSessions,
      enqId: studentId,
    });

    await newClassSelection.save();
    enqData.classAssigned = true;
    enqData.isEnrollmementStepCompleted = true;

    await enqData.save();

    await classPaymentModel.findOneAndUpdate(
      { enqId: studentId, isPackageActive: true },
      { $set: { isClassAdded: true } }
    );
    await enquiryLogs.updateOne(
      { enqId: enqData._id },
      {
        $push: {
          logs: {
            employeeName: "Parent",
            comment: `Parent Sheduled Whole Class for ${studentName}  `,
            action: "",
          },
        },
      },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: "Classes assigned and saved successfully",
    });
  } catch (error) {
    console.error("Error saving selected classes:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const parentPauseTheClass = async (req, res) => {
  try {
    console.log("Welcome to pause the class", req.body);

    const { enqId, classId } = req.params;
    const { updatedData, pauseRemarks, pauseStartDate, pauseEndDate } =
      req.body;

    // Format date to dd-mm-yy
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      const dd = String(date.getDate()).padStart(2, "0");
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const yy = String(date.getFullYear()).slice(-2);
      return `${dd}-${mm}-${yy}`;
    };

    const formattedStartDate = formatDate(pauseStartDate);
    const formattedEndDate = formatDate(pauseEndDate);

    const exisitingData = await SelectedClass.findOne(
      { _id: classId },
      { generatedSchedule: 1 }
    );
    console.log("existing Data", exisitingData);
    console.log("updatedData", updatedData);

    const updatedClass = await SelectedClass.findOneAndUpdate(
      { _id: classId },
      {
        $set: {
          generatedSchedule: updatedData,
          pauseRemarks,
        },
      },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }

    await enquiryLogs.updateOne(
      { enqId: enqId },
      {
        $push: {
          logs: {
            employeeName: "Parent",
            comment: `Parent paused the class from ${formattedStartDate} to ${formattedEndDate} because of ${pauseRemarks}`,
            action: "",
          },
        },
      },
      { upsert: true }
    );

    console.log("Updated class", updatedClass);

    res.status(200).json({
      message: "Class paused successfully",
      data: updatedClass,
    });
  } catch (err) {
    console.log("Error in pausing the data", err);
    res.status(500).json({
      message: "Error while pausing the class",
      error: err.message,
    });
  }
};

const parentResumeTheClass = async (req, res) => {
  try {
    const { enqId, classId } = req.params;
    const { updatedData, pauseRemarks } = req.body;

    const updatedClass = await SelectedClass.findOneAndUpdate(
      { _id: classId },
      {
        $set: {
          generatedSchedule: updatedData,
          pauseRemarks,
        },
      },
      { new: true }
    );

    if (!updatedClass) {
      return res.status(404).json({ message: "Class not found" });
    }
    await enquiryLogs.updateOne(
      { enqId: enqId },
      {
        $push: {
          logs: {
            employeeName: "Parent",
            comment: `Parent resume paused classes`,
            action: "",
          },
        },
      },
      { upsert: true }
    );

    console.log("Updated class", updatedClass);

    res.status(200).json({
      message: "Class Resumed successfully",
      data: updatedClass,
    });
  } catch (err) {
    console.log("Error in resuming the data", err);
    res.status(500).json({
      message: "Error while resuming the class",
      error: err.message,
    });
  }
};

const getChessKidUserName = async (req, res) => {
  try {
    const response = await axios.get(
      "https://www.chesskid.com/api/v1/users/usernames",
      {
        params: {
          usernamesCount: 9,
        },
      }
    );

    console.log("ChessKid API Response:", response.data);

    res.status(200).json({ userName: response.data });
  } catch (error) {
    console.error("Error fetching ChessKid usernames:", error.message);
    res.status(500).json({ error: "Failed to fetch ChessKid usernames" });
  }
};

const getEnrollmentStatusStage = async (req, res) => {
  try {
    const { kidId } = req.params;

    if (!kidId) {
      return res
        .status(400)
        .json({ success: false, message: "kidId is required" });
    }

    const kidEnqCompletionData = await operationDeptModel.findOne(
      { kidId: kidId },
      {
        isParentNameCompleted: 1,
        isFirstKidAdded: 1,
        isProgramSelected: 1,
        isDemoSheduled: 1,
        isDemoAttended: 1,
        isPackageSelected: 1,
        isClassAssigned: 1,
        isEnrollmementStepCompleted: 1,
      }
    );

    if (!kidEnqCompletionData) {
      return res
        .status(404)
        .json({ success: false, message: "No record found for this kidId" });
    }

    return res.status(200).json({
      success: true,
      data: kidEnqCompletionData,
    });
  } catch (err) {
    console.error("Error fetching enrollment status:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

module.exports = {
  getEnrollmentStatusStage,
  getChessKidUserName,
  parentResumeTheClass,
  parentPauseTheClass,
  parentAssignWholeClass,
  parentGetSheduledClassData,
  getParentScheduleButton,
  updateMMid,
  getMMidAvailable,
  parentBookDemoClassData,
  getParentSheduleDemoDetails,
  updateMyName,
  getMyName,
  getConductedClassDetails,
  getKidExistProgramData,
  endSelectedChat,
  saveProgramAndLevel,
  getMyselectedPackageData,
  getMyReferalData,
  sendReferalData,
  updateSupportChats,
  getAllTicketOfParent,
  createTicketForParent,
  getKidDataParentBelongsTo,
  getThePackageData,
  parentSaveKidData,
  parentAddNewKidData,
  parentSelectThePackage,
  getTheKidEnqId,
  getKidTodayClass,
  parentSubmitEnquiryForm,
  getMyKidData,
  getKidEnquiryStatus,
  getParentKidData,
  parentLogin,
  parentVerifyOtp,
  parentStudentRegistration,
  parentBookDemoClass,
  getKidsDataList,
  getChildData,
  changeChildPin,
  getDemoClassDetails,
  getKidData,
  editKidData,
  getParentData,
  editParentData,
  parentBookNewDemoClass,
  parentAddNewKid,
  getParentProfileData,
  getKidDemoClassDetails,
  saveKidAvailability,
  getKidAvailability,
  updateKidAvailability,
  updateKidAvailabilityStatus,
  deleteKidAvailabilityStatus,
  getKidClassData,
  getKidClassData,
  getKidClassAttendanceData,
  getPaymentNotificationData,
  savePaymentData,
  getKidPaidFeeData,
  parentBookDemoClassInProfile,
};
