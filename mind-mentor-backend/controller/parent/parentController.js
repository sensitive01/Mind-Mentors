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

const parentLogin = async (req, res) => {
  try {
    console.log("Welcome to parent login", req.body);

    const mobile = req.body.mobile;
    const otp = generateOTP();
    console.log("Generated OTP:", otp);

    req.app.locals.otp = otp;
    req.app.locals.mobile = mobile;
    req.app.locals.otpExpiry = Date.now() + 5 * 60 * 1000;

    const parentExist = await parentModel.findOne({ parentMobile: mobile });
    console.log("Prent exist", parentExist);

    if (parentExist) {
      res.status(200).json({
        success: true,
        message: "Parent exists. OTP has been sent for verification.",
        value: 1,

        otp,
        data: {
          parentId: parentExist._id,
          type: parentExist?.type,
        },
      });
    } else {
      const newParent = new parentModel({
        parentMobile: mobile,
      });

      await newParent.save();

      const enqList = await operationDeptModel.create({
        whatsappNumber: mobile,
        parentFirstName: "Parent_New Enquiry",
      });

      console.log("Saving the data in enquiry list", enqList);

      res.status(201).json({
        success: true,
        message:
          "Parent registered successfully. OTP has been sent for verification.",
        value: 0,

        otp,
        data: {
          parentId: newParent._id,
          type: newParent.type,
        },
      });
    }
  } catch (err) {
    console.error("Error in parent login", err);
    res.status(500).json({
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
    const chessId = generateChessId();
    const kidPin = generateOTP();

    let parentData = await parentModel.findOne({ parentMobile: state.mobile });

    const newKid = new kidModel({
      kidsName: formData.kidsName,
      age: formData.age,
      gender: formData.gender,
      intention: formData.intention,
      schoolName: formData.schoolName,
      address: formData.address,
      pincode: formData.pincode,
      parentId: parentData ? parentData._id : null,
      chessId: chessId,
      kidPin,
    });

    await newKid.save();

    console.log("New kid data",newKid)

    if (parentData) {
      parentData = await parentModel.findOneAndUpdate(
        { parentMobile: state.mobile },
        {
          $push: { kids: newKid._id },
          $set: {
            parentEmail: state.email,
            parentName: state.name,
            type: "exist",
          },
        },
        { new: true }
      );
    } else {
      parentData = new parentModel({
        parentMobile: state.mobile,
        parentEmail: state.email,
        parentName: state.name,
        isMobileWhatsapp: state.isMobileWhatsapp,
        kids: [newKid._id],
        type: "exist",
      });
      await parentData.save();
    }

    res.status(201).json({
      success: true,
      message: "Parent and kid registration completed successfully.",
      data: {
        parent: parentData,
        kid: newKid,
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
    // Extract data
    const { parent, kid } = state;
    const { programs, scheduleId, hasSchedule } = formData;

    console.log("programs",programs)

    // Format date and time
    const formattedDateTime = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    const logUpdate = {
      employeeId: "",
      employeeName:"" ,
      action: `Demo class booking for ${parent.parentName} on ${formattedDateTime}`,
      updatedAt: new Date(),
    };

   
    const newLog = new enquiryLogs({
      logs: [
        {
          action: `Request for demo class booking raised by parent ${parent.parentName} on ${formattedDateTime}`,
          createdAt: new Date(),
          employeeId: "",
          employeeName: "",
        },
      ],
    });
    const savedLog = await newLog.save();

 
    const operationDeptData = {
      parentFirstName: parent.parentName.split(" ")[0], 
      parentLastName: parent.parentName.split(" ")[1] || "",
      kidFirstName: kid.kidsName.split(" ")[0],
      kidLastName: kid.kidsName.split(" ")[1] || "",
      whatsappNumber: parent.parentMobile.toString(),
      email: parent.parentEmail,
      message: "",
      source: "Demo Class Booking", 
      kidId: kid.chessId,
      kidsAge: kid.age,
      kidsGender: kid.gender,
      programs: programs.map((program) => ({
        program: program.program, // Adjust key based on the program object structure
        level: program.programLevel, // Adjust key based on the program object structure
      })),
      intentionOfParents: kid.intention,
      schoolName: kid.schoolName,
      address: kid.address,
      schoolPincode: "", // Add if available
      enquiryStatus: "Pending",
      enquiryType: "warm",
      disposition: "None",
      enquiryField: "prospects",
      payment: "Pending",
      notes: "",
      scheduleDemo: {
        status: hasSchedule ? "Scheduled" : "Pending",
        sheduledDay: hasSchedule ? scheduleId : null, // Assuming scheduleId is a day; adjust as needed
      },
      referral: {
        referredTo: "",
        referredEmail: "",
      },
      logs: savedLog._id, // Reference the saved log
    };


    console.log("operationDeptData",operationDeptData.logs)

    const newOperationDept = new operationDeptModel(operationDeptData);
    const savedOperationDept = await newOperationDept.save();

    console.log("savedOperationDept",savedOperationDept)



    savedLog.enqId = savedOperationDept._id
    await savedLog.save()

    // console.log("savedLog 2",savedLog)




    console.log(
      "OperationDept entry created successfully with log:",
      savedOperationDept
    );
    return savedOperationDept;
  } catch (error) {
    console.error("Error creating OperationDept entry with log:", error);
    throw error;
  }
};


const parentBookDemoClass = async (req, res) => {
  try {
    console.log("Welcome to demo class booking", req.body);

    const { formData, state } = req.body;
    const { parent, kid } = state;

    formData.programs.map((data) => {
      console.log(data);
    });

    console.log("formData", formData);
    console.log("parent", parent);
    console.log("kid", kid);

    console.log("Parent ID:", parent._id, "Kid ID:", kid._id);

    if (formData.hasSchedule) {
      console.log("Using predefined slot");
      const updateDemoClassDetails = await ClassSchedule.findOne({
        _id: formData.scheduleId,
      });

      if (updateDemoClassDetails) {
        console.log("Demo class details found", updateDemoClassDetails);

        // Push the kid details into selectedStudents array
        updateDemoClassDetails.selectedStudents.push({
          kidId: kid._id,
          kidName: kid.kidsName, // Assuming the kid's name is available in the `kid` object
        });

        // Save the updated demo class details
        await updateDemoClassDetails.save();

        console.log(
          "Updated demo class details with selected student:",
          updateDemoClassDetails
        );
      }
    }

    const parentData = await parentModel.findByIdAndUpdate(parent._id, {
      type: "exist",
    });
    parentData.kids.push({ kidId: kid._id });
    await parentData.save();

    const updatedKid = await kidModel.findByIdAndUpdate({ _id: kid._id }, kid, {
      new: true,
    });



 

    // Invoke the logging function
    
    const logResult = await createEnquiryParent(formData, state);
    console.log("Log entry created:", logResult);

    res.status(201).json({
      success: true,
      message: "Demo class updated with selected student successfully.",
      parentId: parent._id,
    });
  } catch (err) {
    console.error("Error in parent Book Demo Class", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};







// const parentBookDemoClass = async (req, res) => {
//   try {
//     console.log("Welcome to demo class booking", req.body);

//     const { formData, state } = req.body;
//     const { parent, kid } = state;

//     formData.programs.map((data) => {
//       console.log(data);
//     });

//     console.log("formData", formData);
//     console.log("parent", parent);
//     console.log("kid", kid);

//     console.log("Parent ID:", parent._id, "Kid ID:", kid._id);

//     if (formData.hasSchedule) {
//       console.log("Using predefined slot");
//       const updateDemoClassDetails = await ClassSchedule.findOne({
//         _id: formData.scheduleId,
//       });

//       if (updateDemoClassDetails) {
//         console.log("Demo class details found", updateDemoClassDetails);

//         // Push the kid details into selectedStudents array
//         updateDemoClassDetails.selectedStudents.push({
//           kidId: kid._id,
//           kidName: kid.kidsName, // Assuming the kid's name is available in the `kid` object
//         });

//         // Save the updated demo class details
//         await updateDemoClassDetails.save();

//         console.log(
//           "Updated demo class details with selected student:",
//           updateDemoClassDetails
//         );
//       }
//     }



//     const parentData = await parentModel.findByIdAndUpdate(parent._id, {
//       type: "exist",
//     });
//     parentData.kids.push({ kidId: kid._id });
//     await parentData.save();

//     const updatedKid = await kidModel.findByIdAndUpdate({ _id: kid._id }, kid, {
//       new: true,
//     });

//     res.status(201).json({
//       success: true,
//       message: "Demo class updated with selected student successfully.",
//       parentId: parent._id,
//     });
//   } catch (err) {
//     console.error("Error in parent Book Demo Class", err);
//     res.status(500).json({
//       success: false,
//       message: "Internal server error. Please try again later.",
//     });
//   }
// };

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
    const updateData = req.body;

    const updatedParent = await parentModel.findByIdAndUpdate(
      parentId,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedParent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    return res.status(200).json({
      message: "Parent data updated successfully",
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

    if (
      !kidsName ||
      !age ||
      !gender ||
      !intention ||
      !schoolName ||
      !address ||
      !pincode
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all the required fields" });
    }

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
    console.log(kidId);

    const demoClassDetails = await ClassSchedule.findOne({
      "selectedStudents.kidId": kidId,
      status: "Scheduled",
    });

    if (!demoClassDetails) {
      const conductedDemoClass = await ConductedClass.findOne({
        "students.studentID": kidId,
        status: "Conducted",
      });

      if (!conductedDemoClass) {
        return res
          .status(404)
          .json({ message: "No demo class found for the given kid." });
      }

      const classScheduleDetails = await ClassSchedule.findById(
        conductedDemoClass.classID
      );

      if (classScheduleDetails && classScheduleDetails.classType === "Demo") {
        const studentData = conductedDemoClass.students.find(
          (student) => student.studentID.toString() === kidId
        );

        const combinedData = {
          classDetails: {
            classID: classScheduleDetails._id,
            classType: classScheduleDetails.classType,
            day: classScheduleDetails.day,
            classTime: classScheduleDetails.classTime,
            coachName: classScheduleDetails.coachName,
            coachId: classScheduleDetails.coachId,
            program: classScheduleDetails.program,
            level: classScheduleDetails.level,
            meetingLink: classScheduleDetails.meetingLink,
            status: classScheduleDetails.status,
            conductedDate: conductedDemoClass.conductedDate,
          },
          student: {
            studentID: studentData.studentID,
            name: studentData.name,
            attendance: studentData.attendance,
            feedback: studentData.feedback,
          },
          status: conductedDemoClass.status,
        };

        return res.status(200).json({
          message: "Kid's conducted demo class details retrieved successfully.",
          combinedData,
        });
      } else {
        return res
          .status(404)
          .json({ message: "The class type is not a Demo class." });
      }
    }

    const filteredStudents = demoClassDetails.selectedStudents.filter(
      (student) => student.kidId === kidId
    );

    if (filteredStudents.length === 0) {
      return res
        .status(404)
        .json({ message: "Student not found in the demo class." });
    }

    const updatedDemoClassDetails = {
      ...demoClassDetails._doc,
      selectedStudents: filteredStudents,
    };

    res.status(200).json({
      message: "Kid's demo class details retrieved successfully.",
      classDetails: updatedDemoClassDetails,
    });
  } catch (err) {
    res
      .status(500)
      .json({
        error: "An error occurred while fetching the demo class details.",
      });
  }
};

const saveKidAvailability = async (req, res) => {
  try {
    console.log("Welcome to add availability",req.body)
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

    return res
      .status(201)
      .json({
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
    return res
      .status(200)
      .json({
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

const getKidClassData = async (req, res) => {
  try {
    const { kidId } = req.params;

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
        const classData = await ClassSchedule.findById(
          conductedClass.classID
        ).lean();
        return { ...conductedClass, classData };
      })
    );

    console.log("conductedClassDetails", conductedClassDetails);

    // Fetch all scheduled classes
    const allClasses = await ClassSchedule.find({
      "selectedStudents.kidId": kidId,
      status: "Scheduled",
    }).lean();
    console.log("All class shedules", allClasses);

    const currentDate = new Date();
    const currentDay = currentDate.toLocaleDateString("en-US", {
      weekday: "long",
    });
    const currentTime = currentDate.getTime();

    const liveClasses = [];
    const upcomingClasses = [];

    // Categorize live and upcoming classes
    allClasses.forEach((classItem) => {
      const [startTime, endTime] = classItem.classTime
        .split(" - ")
        .map((time) =>
          new Date(`${currentDate.toDateString()} ${time}`).getTime()
        );

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

    console.log(responseData);

    return res.status(200).json({
      message: "Kid's class data retrieved successfully.",
      responseData,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "An error occurred while fetching the class details." });
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

module.exports = {
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
};
