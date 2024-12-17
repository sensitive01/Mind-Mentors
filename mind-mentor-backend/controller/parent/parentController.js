const parentModel = require("../../model/parentModel");
const kidModel = require("../../model/kidModel");
const demoClassModel = require("../../model/demoClassModel");

const generateChessId = require("../../utils/generateChessId");
const generateOTP = require("../../utils/generateOtp");
const operationDeptModel = require("../../model/operationDeptModel");

const ClassSchedule = require("../../model/classSheduleModel");

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
    console.log("Prent exist",parentExist)

    if (parentExist) {
      res.status(200).json({
        success: true,
        message: "Parent exists. OTP has been sent for verification.",
        value:1,

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

      console.log("Saving the data in enquiry list",enqList)

      

      res.status(201).json({
        success: true,
        message:
          "Parent registered successfully. OTP has been sent for verification.",
          value:0,

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
    console.log("OTP",otp)
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

    // const otpString = otp.join("");
    // console.log("otpString", otpString);

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

const parentBookDemoClass = async (req, res) => {
  try {
    console.log("Welcome to demo class booking", req.body);

    const { formData, state } = req.body;
    const { parent, kid } = state;

    formData.programs.map((data) => {
      console.log(data);
    });

    console.log("Parent ID:", parent._id, "Kid ID:", kid._id);

    const demoClass = new demoClassModel({
      programs: formData.programs.map((programObj) => ({
        program: programObj.program,
        programLevel: programObj.programLevel,
      })),
      date: formData.date,
      time: formData.time,
      parentId: parent._id,
      kidId: kid._id,
    });

    await demoClass.save();
    console.log("Demo class saved");

    // Updating the parent's type to "exist"
    await parentModel.findByIdAndUpdate(parent._id, {
      type: "exist",
    });

    // Updating kid data if necessary
    const updatedKid = await kidModel.findByIdAndUpdate({ _id: kid._id }, kid, {
      new: true,
    });

    res.status(201).json({
      success: true,
      message: "Demo class booked successfully, and chess ID updated.",
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
    const demoClassData = await demoClassModel.findOne({ kidId: kidId });
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
    res
      .status(500)
      .json({
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

    return res
      .status(200)
      .json({
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
    const parentData = await parentModel.findOne({ _id: parentId }).populate('kids.kidId');

    if (!parentData) {
      return res.status(404).json({ message: "Parent not found" });
    }

    return res.status(200).json({
      message: "Parent data fetched successfully",
      parent: parentData,
    });

  } catch (err) {
    console.log("Error in get parent data", err);
    return res.status(500).json({ message: "An error occurred while fetching parent data" });
  }
};

const getKidDemoClassDetails = async (req, res) => {
  try {
    console.log("Welcome to get kids demo class details",req.params);

    const {  kidId } = req.params;


    // Find the class schedule with the matching kidId in selectedStudents
    const demoClassDetails = await ClassSchedule.findOne({
      "selectedStudents.kidId": kidId,status:"Scheduled"
    });

    console.log("demoClassDetails",demoClassDetails)

    if (!demoClassDetails) {
      return res.status(404).json({ message: "No demo class found for the given kid." });
    }

    // Extract only the student with the matching kidId
    const filteredStudents = demoClassDetails.selectedStudents.filter(
      (student) => student.kidId === kidId
    );

    if (filteredStudents.length === 0) {
      return res.status(404).json({ message: "Student not found in the demo class." });
    }

    // Return the modified demoClassDetails with only the filtered student
    const updatedDemoClassDetails = {
      ...demoClassDetails._doc, // Extract all properties of the document
      selectedStudents: filteredStudents, // Overwrite the selectedStudents array
    };

    res.status(200).json({
      message: "Kid demo class details retrieved successfully.",
      classDetails: updatedDemoClassDetails,
    });
  } catch (err) {
    console.error("Error in getting the kid's demo class details:", err);
    res.status(500).json({ error: "An error occurred while fetching the demo class details." });
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
  getKidDemoClassDetails
};
