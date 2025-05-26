const OperationDept = require("../../../model/operationDeptModel");
const leaves = require("../../../model/leavesModel");
const attendance = require("../../../model/attendanceModel");
const Task = require("../../../model/taskModel");
const kidSchema = require("../../../model/kidModel");
const parentSchema = require("../../../model/parentModel");
const DemoClass = require("../../../model/demoClassModel");
const Parent = require("../../../model/parentModel");
const generateChessId = require("../../../utils/generateChessId");
const generateOTP = require("../../../utils/generateOtp");
const Employee = require("../../../model/employeeModel");
const enquiryLogs = require("../../../model/enquiryLogs");
const moment = require("moment");
const ClassSchedule = require("../../../model/classSheduleModel");
const ConductedClass = require("../../../model/conductedClassSchema");
const ActivityLog = require("../../../model/taskLogModel");
const NotesSection = require("../../../model/enquiryNoteSection");
const sendMessage = require("../../../utils/sendMessage");
const packageSchema = require("../../../model/packageDetails");
const Voucher = require("../../../model/discount_voucher/voucherModel");
const PhysicalCenters = require("../../../model/physicalcenter/physicalCenterShema");
const classPaymentModel = require("../../../model/classPaymentModel");
const { CALLING_API } = require("../../../config/variables/variables");
const onlineClassPackage = require("../../../model/class/onlineClassPackage");
const offlineClassPackage = require("../../../model/class/offlineClassPackage");
const hybridClassPackage = require("../../../model/class/hybridClassPackage");
const kitPackages = require("../../../model/class/kitPrice");

const registerEmployee = async (req, res) => {
  try {
    // Extract employee details from the request body
    const { name, email, password, department, role } = req.body;

    // Validate the input
    if (!name || !email || !password || !department) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if the email already exists
    const existingEmployee = await Employee.findOne({ email });
    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Create a new employee
    const newEmployee = new Employee({
      name,
      email,
      password,
      department,
      role: role || "employee", // Default role is "employee"
    });

    // Save the employee to the database
    await newEmployee.save();

    // Return a success response
    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      data: {
        id: newEmployee._id,
        name: newEmployee.name,
        email: newEmployee.email,
        department: newEmployee.department,
        role: newEmployee.role,
        status: newEmployee.status,
      },
    });
  } catch (error) {
    console.error("Error registering employee:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while registering the employee",
    });
  }
};

const operationEmailVerification = async (req, res) => {
  try {
    console.log("Welcome to operation employee verification", req.body);

    const { email } = req.body;
    console.log(email);

    const operationEmail = await Employee.findOne({ email: email });
    console.log("operationEmail", operationEmail);

    if (operationEmail) {
      console.log("Email exists");
      return res.status(200).json({
        success: true,
        message: "Email verification successful. Employee exists.",
        operationEmail,
      });
    } else {
      console.log("No details found");
      return res.status(404).json({
        success: false,
        message: "No employee details found for the provided email.",
      });
    }
  } catch (err) {
    console.error("Error in verifying the employee login", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Password Verification
const operationPasswordVerification = async (req, res) => {
  try {
    console.log("Welcome to verify operation dept password", req.body);

    const { password, email } = req.body;

    const operationEmail = await Employee.findOne({
      email: email,
      password: password,
    });

    console.log(operationEmail);

    if (operationEmail) {
      return res.status(200).json({
        success: true,
        message: "Password verification successful.",
        operationEmail,
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Invalid password. Please try again.",
      });
    }
  } catch (err) {
    console.error("Error in verify password", err);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

// Create Enquiry Form
const enquiryFormData = async (req, res) => {
  try {
    console.log("Welcome to create new enquiry", req.body);

    const formData = req.body;
    const { empId } = req.body;

    const empData = await Employee.findOne(
      { _id: empId },
      { department: 1, firstName: 1 }
    );
    if (!empData) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const newEntry = await OperationDept.create(formData);

    const logEntry = {
      enqId: newEntry._id,
      logs: [
        {
          employeeId: empId,
          employeeName: empData.firstName,
          department: empData.department,
          comment: "Enquiry form submission",
          action: `Enquiry form submitted by ${empData.firstName} in ${
            empData.department
          } on ${new Date().toLocaleString()}`,
          createdAt: new Date(),
        },
      ],
    };
    const logData = await enquiryLogs.create(logEntry);
    newEntry.logs = logData._id;
    await newEntry.save();

    res.status(201).json({
      success: true,
      message: "Enquiry form submitted successfully",
      id: newEntry._id,
    });
  } catch (error) {
    console.error("Error submitting enquiry form", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit enquiry form. Please try again later.",
    });
  }
};

const updateEnquiryDetails = async (req, res) => {
  try {
    const { enqId, step } = req.params;
    console.log(enqId, step);
    console.log("req.body", req.body);

    const updateData = await OperationDept.findOneAndUpdate(
      { _id: enqId },
      { $set: req.body },
      { new: true }
    );

    if (updateData) {
      res.status(200).json({
        message: "Enquiry updated successfully",
        updateData,
      });
    } else {
      res.status(404).json({ message: "Enquiry not found" });
    }
  } catch (err) {
    console.log("Error in updating the enquiry data", err);
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

// const updateProspectData = async (req, res) => {
//   try {
//     console.log("..........................................");
//     console.log("Prospects");
//     const formattedDateTime = new Intl.DateTimeFormat("en-US", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(new Date());

//     const { id } = req.params;
//     const { empId } = req.body;

//     const empData = await Employee.findOne(
//       { _id: empId },
//       { firstName: 1, department: 1 }
//     );
//     if (!empData) {
//       return res.status(404).json({ message: "Employee not found" });
//     }
//     console.log("Employee Data", empData);

//     const enquiryData = await OperationDept.findOne({ _id: id });
//     if (!enquiryData) {
//       return res.status(404).json({ message: "Enquiry data not found" });
//     }
//     console.log("Enquiry Data", enquiryData);

//     console.log("..........................................");

//     // 1. Handle Parent Registration
//     let parentData = await parentSchema.findOne({
//       parentMobile: enquiryData.whatsappNumber,
//     });

//     // If Parent doesn't exist, create a new one
//     if (!parentData) {
//       parentData = new parentSchema({
//         parentName: enquiryData.parentFirstName,
//         parentEmail: enquiryData.email,
//         parentMobile: enquiryData.whatsappNumber,
//         kids: [],
//         type: "new",
//         status: "Active",
//       });

//       await parentData.save();
//     }
//     console.log("parent data after move to prospects", parentData);

//     // 2. Handle Kid Registration
//     const chessId = generateChessId();
//     const kidPin = generateOTP();

//     // Create new Kid
//     const newKid = new kidSchema({
//       enqId: id,
//       kidsName: enquiryData.kidFirstName,
//       age: enquiryData.kidsAge,
//       gender: enquiryData.kidsGender,
//       schoolName: enquiryData.schoolName,
//       address: enquiryData.address,
//       pincode: enquiryData.pincode,
//       parentId: parentData._id,
//       selectedProgram: enquiryData.programs || "",
//       chessId,
//       kidPin,
//     });

//     await newKid.save();
//     console.log("kids data after move to prospects", parentData);

//     parentData.kids.push({ kidId: newKid._id });
//     await parentData.save();

//     enquiryData.kidId = newKid._id;
//     await enquiryData.save();

//     // 4. Update the Log in the Log Database
//     if (enquiryData.logs) {
//       console.log("insode the logs");
//       const logUpdate = {
//         employeeId: empId,
//         employeeName: empData.firstName,
//         action: `Enuiry data is moved to prospects by ${empData.firstName} in ${empData.department} department on ${formattedDateTime}`,

//         updatedAt: new Date(),
//       };

//       const newLogs = await enquiryLogs.findByIdAndUpdate(
//         { _id: enquiryData.logs },
//         {
//           $push: { logs: logUpdate },
//         },
//         { new: true }
//       );

//       console.log("new log updated", newLogs);
//     }

//     // 5. Create Log Entries for the Action
//     const logs = [
//       {
//         employeeId: empId,
//         employeeName: empData.firstName,

//         action: `Enquiry moved to prospects by ${
//           empData.name
//         } on ${new Date().toLocaleString()}`,
//         createdAt: new Date(),
//       },
//     ];

//     if (parentData._id) {
//       logs.push({
//         employeeId: empId,
//         employeeName: empData.firstName,
//         comments: `Registered new parent with ID: ${parentData._id}`,
//         action: "Parent Registration",
//         createdAt: new Date(),
//       });
//     }

//     if (newKid._id) {
//       logs.push({
//         employeeId: empId,
//         employeeName: empData.firstName,
//         comments: `Registered new kid with ID: ${newKid._id}`,
//         action: "Kid Registration",
//         createdAt: new Date(),
//       });
//     }

//     // 6. Update the OperationDept Entry
//     const updatedEntry = await OperationDept.findByIdAndUpdate(
//       { _id: id },
//       {
//         $set: { enquiryField: "prospects" },
//       },
//       { new: true }
//     );

//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Prospect data not found" });
//     }

//     console.log("updatedEntry", updatedEntry);

//     // Return Success Response
//     res.status(200).json({
//       success: true,
//       message: "Prospect data updated successfully and moved to prospects",
//       data: updatedEntry,
//       parentData: parentData,
//       kidData: newKid,
//     });
//   } catch (error) {
//     console.error("Error updating prospect data", error);
//     res.status(500).json({
//       success: false,
//       message: "Failed to update prospect data. Please try again later.",
//     });
//   }
// };

const updateProspectData = async (req, res) => {
  try {
    console.log("..........................................");
    console.log("Prospects");

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    const { id } = req.params;
    const { empId } = req.body;

    // Fetch Employee Data
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }
    console.log("Employee Data", empData);

    // Fetch Enquiry Data
    const enquiryData = await OperationDept.findOne({ _id: id });
    if (!enquiryData) {
      return res.status(404).json({ message: "Enquiry data not found" });
    }
    console.log("Enquiry Data", enquiryData);

    console.log("..........................................");

    // 1. Handle Parent Registration
    let parentData = await parentSchema.findOne({
      parentMobile: enquiryData.whatsappNumber,
    });

    if (parentData) {
      // Update existing parent data
      parentData.parentName =
        enquiryData.parentFirstName || parentData.parentName;
      parentData.parentEmail = enquiryData.email || parentData.parentEmail;
      parentData.status = "Active"; // Ensure the status remains active
      await parentData.save();
      console.log("Updated Parent Data:", parentData);
    } else {
      // Create new parent
      parentData = new parentSchema({
        parentName: enquiryData.parentFirstName,
        parentEmail: enquiryData.email,
        parentMobile: enquiryData.whatsappNumber,
        kids: [],
        type: "new",
        status: "Active",
      });
      await parentData.save();
      console.log("New Parent Created:", parentData);
    }

    // 2. Handle Kid Registration
    let kidData = await kidSchema.findOne({ enqId: id });

    if (kidData) {
      // Update existing kid data
      kidData.kidsName = enquiryData.kidFirstName || kidData.kidsName;
      kidData.age = enquiryData.kidsAge || kidData.age;
      kidData.gender = enquiryData.kidsGender || kidData.gender;
      kidData.schoolName = enquiryData.schoolName || kidData.schoolName;
      kidData.address = enquiryData.address || kidData.address;
      kidData.pincode = enquiryData.pincode || kidData.pincode;
      kidData.selectedProgram = enquiryData.programs || kidData.selectedProgram;
      await kidData.save();
      console.log("Updated Kid Data:", kidData);
    } else {
      // Create new kid
      const chessId = generateChessId();
      const kidPin = generateOTP();

      kidData = new kidSchema({
        enqId: id,
        kidsName: enquiryData.kidFirstName,
        age: enquiryData.kidsAge,
        gender: enquiryData.kidsGender,
        schoolName: enquiryData.schoolName,
        address: enquiryData.address,
        pincode: enquiryData.pincode,
        parentId: parentData._id,
        selectedProgram: enquiryData.programs || "",
        chessId,
        kidPin,
      });

      await kidData.save();
      console.log("New Kid Created:", kidData);

      // Link Kid to Parent
      parentData.kids.push({ kidId: kidData._id });
      await parentData.save();
    }

    // 3. Link Kid to Enquiry Data
    enquiryData.kidId = kidData._id;
    await enquiryData.save();

    // 4. Update Logs in Log Database
    if (enquiryData.logs) {
      console.log("Inside logs update");
      const logUpdate = {
        employeeId: empId,
        employeeName: empData.firstName,
        action: `Enquiry moved to prospects by ${empData.firstName} in ${empData.department} department.`,
        updatedAt: new Date(),
      };

      await enquiryLogs.findByIdAndUpdate(
        { _id: enquiryData.logs },
        { $push: { logs: logUpdate } },
        { new: true }
      );
      console.log("Logs updated successfully");
    }

    // 5. Create Log Entries for the Action
    const logs = [
      {
        employeeId: empId,
        employeeName: empData.firstName,
        action: `Enquiry moved to prospects by ${empData.firstName}`,
        createdAt: new Date(),
      },
    ];

    if (parentData._id) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        comments: `Registered/Updated parent with ID: ${parentData._id}`,
        action: "Parent Registration",
        createdAt: new Date(),
      });
    }

    if (kidData._id) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        comments: `Registered/Updated kid with ID: ${kidData._id}`,
        action: "Kid Registration",
        createdAt: new Date(),
      });
    }

    // 6. Update the OperationDept Entry
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      { _id: id },
      { $set: { enquiryField: "prospects" } },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Prospect data not found" });
    }

    console.log("Updated Entry:", updatedEntry);

    // Return Success Response
    res.status(200).json({
      success: true,
      message: "Prospect data updated successfully and moved to prospects",
      data: updatedEntry,
      parentData,
      kidData,
    });
  } catch (error) {
    console.error("Error updating prospect data", error);
    res.status(500).json({
      success: false,
      message: "Failed to update prospect data. Please try again later.",
    });
  }
};

const moveBackToEnquiry = async (req, res) => {
  try {
    console.log("..........................................");
    console.log("move back to enquiry", req.params, req.body);
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    const { id } = req.params;
    const { empId } = req.body;

    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }
    console.log("Employee Data", empData);

    const enquiryData = await OperationDept.findOne({ _id: id });
    if (!enquiryData) {
      return res.status(404).json({ message: "Enquiry data not found" });
    }
    console.log("Enquiry Data", enquiryData);

    // 4. Update the Log in the Log Database
    if (enquiryData.logs) {
      console.log("insode the logs");
      const logUpdate = {
        employeeId: empId,
        employeeName: empData.firstName,
        action: `Enuiry data is moved to prospects by ${empData.firstName} in ${empData.department} department on ${formattedDateTime}`,

        updatedAt: new Date(),
      };

      const newLogs = await enquiryLogs.findByIdAndUpdate(
        { _id: enquiryData.logs },
        {
          $push: { logs: logUpdate },
        },
        { new: true }
      );

      console.log("new log updated", newLogs);
    }

    // 5. Create Log Entries for the Action
    const logs = [
      {
        employeeId: empId,
        employeeName: empData.firstName,

        action: `Enquiry moved to prospects by ${
          empData.name
        } on ${new Date().toLocaleString()}`,
        createdAt: new Date(),
      },
    ];

    // 6. Update the OperationDept Entry
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      { _id: id },
      {
        $set: { enquiryField: "enquiryList" },
      },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Prospect data not found" });
    }

    console.log("updatedEntry", updatedEntry);

    // Return Success Response
    res.status(200).json({
      success: true,
      message: "Prospect data  successfully and moved to enquiry ",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating prospect data", error);
    res.status(500).json({
      success: false,
      message: "Failed to update prospect data. Please try again later.",
    });
  }
};

// Get All Enquiries
// const getAllEnquiries = async (req, res) => {
//   try {
//     const enquiries = await OperationDept.find({ enquiryField: "enquiryList" });

//     const customizedEnquiries = await Promise.all(
//       enquiries.map(async (enquiry) => {
//         const parentName = `${enquiry.parentFirstName || ""} ${
//           enquiry.parentLastName || ""
//         }`.trim();
//         const kidName = `${enquiry.kidFirstName || ""} ${
//           enquiry.kidLastName || ""
//         }`.trim();

//         let latestAction = null;
//         if (enquiry.logs) {
//           const lastLog = await enquiryLogs.findOne({ _id: enquiry.logs });

//           const sortedLogs = lastLog.logs.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//           latestAction = sortedLogs[0].action;
//         }

//         let lastNoteAction = await NotesSection.findOne(
//           { enqId: enquiry._id },
//           { "notes.disposition": 1 }
//         );
//         console.log(".........................................")
//         console.log("lastNoteAction==>", lastNoteAction);
//         console.log(".........................................")

//         if (lastNoteAction) {
//           const sortedLogs = lastNoteAction.notes.sort(
//             (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
//           );
//           lastNoteAction = sortedLogs[sortedLogs.length-1];
//         }
//         console.log("lastNoteAction",lastNoteAction)

//         const formatDate = (date) => {
//           if (!date) return null;
//           const d = new Date(date);
//           const day = String(d.getDate()).padStart(2, "0");
//           const month = String(d.getMonth() + 1).padStart(2, "0");
//           const year = d.getFullYear();
//           return `${day}-${month}-${year}`;
//         };

//         const createdAt = formatDate(enquiry.createdAt);
//         const updatedAt = formatDate(enquiry.updatedAt);

//         return {
//           ...enquiry.toObject(),
//           parentName,
//           kidName,
//           latestAction,

//           createdAt,
//           updatedAt,
//         };
//       })
//     );

//     res.status(200).json(customizedEnquiries);
//   } catch (error) {
//     console.log("Error", error);
//     res.status(500).json({ message: "Error fetching data" });
//   }
// };

const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await OperationDept.find({ enquiryField: "enquiryList" });

    const customizedEnquiries = await Promise.all(
      enquiries.map(async (enquiry) => {
        const parentName = `${enquiry.parentFirstName || ""} ${
          enquiry.parentLastName || ""
        }`.trim();
        const kidName = `${enquiry.kidFirstName || ""} ${
          enquiry.kidLastName || ""
        }`.trim();

        let latestAction = null;
        if (enquiry.logs) {
          const lastLog = await enquiryLogs.findOne({ _id: enquiry.logs });
          if (lastLog?.logs?.length) {
            const sortedLogs = lastLog.logs.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
            latestAction = sortedLogs[0]?.action || null;
          }
        }

        let lastNoteAction = null;
        const noteSection = await NotesSection.findOne(
          { enqId: enquiry._id },
          { notes: 1, createdOn: 1 }
        );
        if (noteSection?.notes?.length) {
          // Assuming notes are in chronological order
          lastNoteAction = noteSection.notes[noteSection.notes.length - 1];
        }

        const formatDate = (date) => {
          if (!date) return null;
          const d = new Date(date);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        };

        const createdAt = formatDate(enquiry.createdAt);
        const updatedAt = formatDate(enquiry.updatedAt);

        return {
          ...enquiry.toObject(),
          parentName,
          kidName,
          latestAction,
          lastNoteAction: lastNoteAction?.disposition || "None",
          createdOn: lastNoteAction?.createdOn || "createdOn",
          createdAt,
          updatedAt,
        };
      })
    );

    res.status(200).json(customizedEnquiries);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

const getProspectsData = async (req, res) => {
  try {
    const enquiries = await OperationDept.find({ enquiryField: "prospects" });

    const customizedEnquiries = await Promise.all(
      enquiries.map(async (enquiry) => {
        const parentName = `${enquiry.parentFirstName || ""} ${
          enquiry.parentLastName || ""
        }`.trim();
        const kidName = `${enquiry.kidFirstName || ""} ${
          enquiry.kidLastName || ""
        }`.trim();

        let latestAction = null;
        if (enquiry.logs) {
          const lastLog = await enquiryLogs
            .findOne({ _id: enquiry.logs })
            .sort({ createdAt: -1 })
            .limit(1);
          const sortedLogs = lastLog.logs.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          latestAction = sortedLogs[0].action;
        }

        let lastNoteAction = null;
        const noteSection = await NotesSection.findOne(
          { enqId: enquiry._id },
          { notes: 1, createdOn: 1 }
        );
        if (noteSection?.notes?.length) {
          lastNoteAction = noteSection.notes[noteSection.notes.length - 1];
        }

        const formatDate = (date) => {
          if (!date) return null;
          const d = new Date(date);
          const day = String(d.getDate()).padStart(2, "0");
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const year = d.getFullYear();
          return `${day}-${month}-${year}`;
        };

        const createdAt = formatDate(enquiry.createdAt);
        const updatedAt = formatDate(enquiry.updatedAt);

        return {
          ...enquiry.toObject(),
          parentName,
          kidName,
          latestAction,
          lastNoteAction: lastNoteAction?.disposition || "None",
          createdOn: lastNoteAction?.createdOn || "Created On",

          createdAt,
          updatedAt,
        };
      })
    );

    res.status(200).json(customizedEnquiries);
  } catch (error) {
    console.log("Error", error);
    res.status(500).json({ message: "Error fetching data" });
  }
};

// Update Enquiry
const updateEnquiry = async (req, res) => {
  try {
    console.log("Welcome to update enquiry", req.params, req.body);
    const { id } = req.params;

    if (req.body.parentName) {
      const parentNameParts = req.body.parentName.trim().split(" ");
      req.body.parentFirstName = parentNameParts[0] || "";
      req.body.parentLastName = parentNameParts.slice(1).join(" ") || "";
    }

    if (req.body.kidName) {
      const kidNameParts = req.body.kidName.trim().split(" ");
      req.body.kidFirstName = kidNameParts[0] || "";
      req.body.kidLastName = kidNameParts.slice(1).join(" ") || "";
    }

    const updatedEntry = await OperationDept.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json(updatedEntry);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ message: "Error updating data" });
  }
};

// Delete Enquiry
const deleteEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEntry = await OperationDept.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({ message: "Enquiry deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting data" });
  }
};

// Update Enquiry Status (Cold/Warm)
const updateEnquiryStatus = async (req, res) => {
  try {
    console.log("Status update", req.body, req.params);

    const { id } = req.params;
    const { enquiryStatus, empId } = req.body;

    // Fetch employee data

    if (!["cold", "warm"].includes(enquiryStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. It must be either 'cold' or 'warm'.",
      });
    }

    const existingEntry = await OperationDept.findById(id);
    console.log("Existing Entry", existingEntry.logs);

    if (!existingEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const previousStatus = existingEntry.enquiryType || "unknown";

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    // Update the enquiry type
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      { _id: id },
      { enquiryType: enquiryStatus },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const empData = await Employee.findOne(
      { _id: empId },
      { department: 1, firstName: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    console.log("empData==>", empData, empData.firstName);

    const logId = existingEntry.logs;

    // Push logs
    const logUpdate = await enquiryLogs.findByIdAndUpdate(
      { _id: logId },
      {
        $push: {
          logs: {
            employeeId: empId,
            employeeName: empData.firstName, // empData.firstName should exist here
            comment: `Status updated from '${previousStatus}' to '${enquiryStatus}'`,
            action: `Status updated by ${empData.firstName} in ${empData.department} department from '${previousStatus}' to '${enquiryStatus}' on ${formattedDateTime}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    console.log(
      `Status updated by _id:${empData._id}---> name:${empData.firstName}--->department:${empData.department} from '${previousStatus}' to '${enquiryStatus} on ${formattedDateTime}'`
    );

    if (!logUpdate) {
      return res.status(404).json({ message: "Log document not found" });
    }

    res.status(200).json({
      success: true,
      message: `Enquiry status updated successfully from '${previousStatus}' to '${enquiryStatus}' on ${formattedDateTime}`,
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating enquiry status", error);
    res.status(500).json({
      success: false,
      message: "Error updating enquiry status",
      error: error.message,
    });
  }
};

// Add Notes to Enquiry
const addNotesToEnquiry = async (req, res) => {
  try {
    const { id } = req.params;
    const { enquiryStageTag, addNoteTo, notes } = req.body;

    if (!enquiryStageTag || !addNoteTo || !notes) {
      return res.status(400).json({
        success: false,
        message: "Enquiry Stage Tag, Add Note To, and Notes are required.",
      });
    }

    const newNote = { enquiryStageTag, addNoteTo, notes };

    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { $push: { notes: newNote } },
      { new: true }
    );

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: updatedEntry,
    });
  } catch (error) {
    res.status(500).json({ message: "Error adding note to enquiry" });
  }
};

const updateProspectStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { enquiryStatus } = req.body;
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { enquiryStatus },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({
      success: true,
      message: "Prospect status updated successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error updating prospect status", error);
    res.status(500).json({ message: "Error updating prospect status" });
  }
};

// Schedule Demo
const scheduleDemo = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, status } = req.body;
    const empData = await Employee.findOne(
      { id: id },
      { firstName: 1, department: 1, _id: 1 }
    );
    console.log("empData", empData);
    // const updatedEntry = await OperationDept.findByIdAndUpdate(
    //   id,
    //   { scheduleDemo: { date, status } },
    //   { new: true }
    // );
    // if (!updatedEntry) {
    //   return res.status(404).json({ message: "Enquiry not found" });
    // }
    // res.status(200).json({
    //   success: true,
    //   message: "Demo scheduled successfully",
    //   data: updatedEntry,
    // });
  } catch (error) {
    console.error("Error scheduling demo", error);
    res.status(500).json({ message: "Error scheduling demo" });
  }
};

// Add Notes
// const addNotes = async (req, res) => {
//   try {
//     console.log("Add notes", req.body);
//     const { id } = req.params; // Enquiry ID
//     const { notes, empId } = req.body;
//     const { enquiryStatus, disposition,notes } = notes;

//     // Fetch employee details
//     const empData = await Employee.findOne(
//       { _id: empId },
//       { firstName: 1, department: 1 }
//     );
//     if (!empData) {
//       return res.status(404).json({ message: "Employee not found" });
//     }

//     console.log("Employee Data", empData);

//     // Ensure that notes is a string
//     // let notesToSave = notes;
//     // if (typeof notes === "object") {
//     //   notesToSave = notes.notes || "";
//     // }
//     const formattedDateTime = new Intl.DateTimeFormat("en-US", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     }).format(new Date());

//     // Validate enquiryStatus and disposition
//     const validEnquiryStatus = [
//       "Pending",
//       "Qualified Lead",
//       "Unqualified Lead",
//     ];
//     const validDisposition = ["RnR", "Call Back", "None"];

//     // if (enquiryStatus && !validEnquiryStatus.includes(enquiryStatus)) {
//     //   return res.status(400).json({ message: "Invalid enquiryStatus value" });
//     // }

//     // if (disposition && !validDisposition.includes(disposition)) {
//     //   return res.status(400).json({ message: "Invalid disposition value" });
//     // }

//     // Fetch the current entry to compare changes
//     const currentEntry = await OperationDept.findById(id);
//     console.log("currentEntry",currentEntry)
//     if (!currentEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }

//     // Prepare logs for changes
//     const logs = [];
//     const actionDescription = []; // For a summary of changes
//     const oldNote = currentEntry.notes || "Empty Note";
//     console.log("Old note", oldNote);

//     if (
//       notesToSave !== currentEntry.notes ||
//       oldNote !== "Empty Note" ||
//       oldNote !== ""
//     ) {
//       logs.push({
//         employeeId: empId,
//         employeeName: empData.firstName,
//         comment: `Updated notes from "${currentEntry.notes}" to "${notesToSave}"`,
//         action: ` ${empData.firstName} in ${empData.department} department updated notes from "${oldNote}" to "${notesToSave}"  on ${formattedDateTime}`,
//         createdAt: new Date(),
//       });
//       actionDescription.push("Notes Updated");
//     }

//     if (
//       (enquiryStatus && enquiryStatus !== currentEntry.enquiryStatus) ||
//       currentEntry.enquiryStatus !== ""
//     ) {
//       logs.push({
//         employeeId: empId,
//         employeeName: empData.firstName,
//         comment: `Changed enquiryStatus from "${currentEntry.enquiryStatus}" to "${enquiryStatus}"`,
//         action: ` ${empData.firstName} in ${empData.department} department updated enquiry status from "${currentEntry.enquiryStatus}" to "${enquiryStatus}"  on ${formattedDateTime}`,
//         createdAt: new Date(),
//       });
//       actionDescription.push("Enquiry Status Updated");
//     }

//     if (disposition && disposition !== currentEntry.disposition||currentEntry.disposition!=="") {
//       logs.push({
//         employeeId: empId,
//         employeeName: empData.firstName,
//         comment: `Changed disposition from "${currentEntry.disposition}" to "${disposition}"`,
//         action: `${empData.firstName} in ${empData.department} department Updated disposition from "${currentEntry.disposition}" to "${disposition}" on ${formattedDateTime} `,
//         createdAt: new Date(),
//       });
//       actionDescription.push("Disposition Updated");
//     }

//     // Update the OperationDept entry
//     const updatedEntry = await OperationDept.findByIdAndUpdate(
//       id,
//       {
//         notes: notesToSave,
//         enquiryStatus: enquiryStatus || currentEntry.enquiryStatus,
//         disposition: disposition,
//       },
//       { new: true }
//     );

//     const noteToAdd = {
//       enquiryStatus:
//         ` ${empData.firstName} in ${empData.department} department updated enquiry status from "${currentEntry.enquiryStatus}" to "${enquiryStatus}"` ||
//         currentEntry.enquiryStatus,
//       disposition:
//         `${empData.firstName} in ${empData.department} department Updated disposition from "${currentEntry.disposition}" to "${disposition}"` ||
//         currentEntry.disposition,
//       note:
//         `${empData.firstName} in ${empData.department} department updated notes from "${oldNote}" to "${notesToSave}"` ||
//         currentEntry.notes,
//     };

//     let notesSection = await NotesSection.findOne({ enqId: id });

//     if (!notesSection) {
//       notesSection = new NotesSection({
//         enqId: id,
//         notes: [noteToAdd],
//       });
//     } else {
//       notesSection.notes.push(noteToAdd);
//     }

//     await notesSection.save();

//     if (!updatedEntry) {
//       return res.status(404).json({ message: "Enquiry not found" });
//     }

//     // Update logs in the Log model
//     const logId = currentEntry.logs; // Assuming logs field contains the Log document ID
//     const logUpdate = await enquiryLogs.findByIdAndUpdate(
//       logId,
//       { $push: { logs: { $each: logs } } }, // Append the prepared logs
//       { new: true }
//     );

//     if (!logUpdate) {
//       return res.status(404).json({ message: "Log document not found" });
//     }

//     // Respond with success
//     res.status(200).json({
//       success: true,
//       message: `Enquiry updated successfully. Actions performed: ${actionDescription.join(
//         ", "
//       )}`,
//       data: updatedEntry,
//     });
//   } catch (error) {
//     console.error("Error adding notes:", error);
//     res
//       .status(500)
//       .json({ message: "Error adding notes", error: error.message });
//   }
// };

const addNotes = async (req, res) => {
  try {
    console.log("Add notes", req.body);
    const { id } = req.params; // Enquiry ID
    const { notes, empId } = req.body;
    const { enquiryStatus, disposition, notes: notesToSave } = notes;

    // Fetch employee details
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    // Fetch the current entry to compare changes
    const currentEntry = await OperationDept.findById(id);
    if (!currentEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Prepare logs for changes
    const logs = [];
    const actionDescription = [];
    const oldNote = currentEntry.notes || "Empty Note";

    // Determine the values to save, falling back to old values if new ones are empty
    const updatedNotes = notesToSave !== "" ? notesToSave : currentEntry.notes;
    const updatedEnquiryStatus =
      enquiryStatus !== "" ? enquiryStatus : currentEntry.enquiryStage;
    const updatedDisposition =
      disposition !== "" ? disposition : currentEntry.disposition;

    if (updatedNotes !== currentEntry.notes) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        department: empData.department,
        comment: `Updated note as "${updatedNotes}"`,
        action: `${empData.firstName} in ${empData.department} department updated notes from "${oldNote}" to "${updatedNotes}" on ${formattedDateTime}`,
        createdAt: new Date(),
      });
      actionDescription.push("Notes Updated");
    }

    if (updatedEnquiryStatus !== currentEntry.enquiryStatus) {
      logs.push({
        employeeId: empId,
        department: empData.department,
        employeeName: empData.firstName,
        comment: `Updated enquiryStatus as "${updatedEnquiryStatus}"`,
        action: `${empData.firstName} in ${empData.department} department updated enquiry status from "${currentEntry.enquiryStatus}" to "${updatedEnquiryStatus}" on ${formattedDateTime}`,
        createdAt: new Date(),
      });
      actionDescription.push("Enquiry Status Updated");
    }

    if (updatedDisposition !== currentEntry.disposition) {
      logs.push({
        employeeId: empId,
        employeeName: empData.firstName,
        department:empData.department,
        comment: `Updated disposition as"${updatedDisposition}"`,
        action: `${empData.firstName} in ${empData.department} department updated disposition from "${currentEntry.disposition}" to "${updatedDisposition}" on ${formattedDateTime}`,
        createdAt: new Date(),
      });
      actionDescription.push("Disposition Updated");
    }

    // Update the OperationDept entry
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      {
        notes: updatedNotes,
        enquiryStage: updatedEnquiryStatus,
        disposition: updatedDisposition,
      },
      { new: true }
    );

    const noteToAdd = {
      enquiryStage: `${updatedEnquiryStatus}` || currentEntry.enquiryStatus,
      disposition: `${updatedDisposition}` || currentEntry.disposition,
      note: `${updatedNotes}` || currentEntry.notes,
      updatedBy: empData.firstName,
      department:empData.department,
      createdOn: `${formattedDateTime}`,
    };

    let notesSection = await NotesSection.findOne({ enqId: id });

    if (!notesSection) {
      notesSection = new NotesSection({
        enqId: id,
        notes: [noteToAdd],
      });
    } else {
      notesSection.notes.push(noteToAdd);
    }

    await notesSection.save();

    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    // Update logs in the Log model
    const logId = currentEntry.logs;
    const logUpdate = await enquiryLogs.findByIdAndUpdate(
      logId,
      { $push: { logs: { $each: logs } } },
      { new: true }
    );

    if (!logUpdate) {
      return res.status(404).json({ message: "Log document not found" });
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: `Enquiry updated successfully. Actions performed: ${actionDescription.join(
        ", "
      )}`,
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error adding notes:", error);
    res
      .status(500)
      .json({ message: "Error adding notes", error: error.message });
  }
};

const cancelDemoClassForKid = async (req, res) => {
  try {
    console.log("Welcome to cancel the demo", req.params, req.body);

    // Extract the ID from request parameters
    const { enqId, classId, empId } = req.params;

    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    // Find the enrollment data to get the kidId and scheduleDemo
    const enqData = await OperationDept.findOne(
      { _id: enqId },
      { kidId: 1, scheduleDemo: 1, logs: 1 }
    );
    console.log("EnqData", enqData);
    if (!enqData) {
      return res.status(404).json({ message: "Enrollment data not found" });
    }

    const { kidId, scheduleDemo } = enqData;

    // Remove the student from the demo class
    const democlassData = await ClassSchedule.updateOne(
      { "selectedStudents.kidId": kidId, _id: classId },
      { $pull: { selectedStudents: { kidId: kidId } } }
    );
    console.log("cancelled demo class", democlassData);

    // // Update the scheduleDemo.status to "Pending"
    const updatedEnqData = await OperationDept.updateOne(
      { _id: enqId },
      { $set: { "scheduleDemo.status": "Pending" } }
    );

    if (updatedEnqData.modifiedCount === 0) {
      return res
        .status(500)
        .json({ message: "Failed to update demo schedule status" });
    }
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    // Update logs for each student
    const classSchedule = await ClassSchedule.findById(classId);

    await enquiryLogs.findByIdAndUpdate(
      enqData.logs,
      {
        $push: {
          logs: {
            employeeId: empId,
            employeeName: empData.firstName, // Assuming 'name' contains the employee's full name
            action: ` ${empData.firstName} in the ${empData.department} department cancelled the demo class for the ${classSchedule.program} . Created on ${formattedDateTime}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).json({
      message:
        "Demo class canceled successfully, and schedule status updated to Pending",
    });
  } catch (err) {
    console.error("Error in canceling the demo", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const rescheduleDemoClass = async (req, res) => {
  try {
    console.log("Welcome to reschedule demo class", req.body);
    const { classId, empId } = req.params; // Get classId and empId from params
    const { selectedStudents } = req.body; // List of kidIds to be rescheduled

    // Fetch class details
    const classSchedule = await ClassSchedule.findById(classId);
    if (!classSchedule) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Fetch employee details
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Fetch kids data
    const kidsData = await OperationDept.find(
      { kidId: { $in: selectedStudents } },
      { kidFirstName: 1, logs: 1, kidId: 1 }
    );
    if (kidsData.length === 0) {
      return res.status(404).json({ message: "Kids data not found" });
    }

    // Remove each kid from their current class
    const removeStudent = await ClassSchedule.updateMany(
      { "selectedStudents.kidId": { $in: selectedStudents } },
      { $pull: { selectedStudents: { kidId: { $in: selectedStudents } } } }
    );
    console.log("Removed students from current class:", removeStudent);

    // Add students to the new class
    const addStudentsData = kidsData.map((kid) => ({
      kidId: kid.kidId,
      kidName: kid.kidFirstName,
    }));

    const addStudent = await ClassSchedule.findByIdAndUpdate(
      classId,
      {
        $push: { selectedStudents: { $each: addStudentsData } },
      },
      { new: true }
    );

    console.log("Added students to new class:", addStudent);

    // Log the rescheduling action
    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    await Promise.all(
      kidsData.map((kid) =>
        enquiryLogs.findByIdAndUpdate(
          kid.logs,
          {
            $push: {
              logs: {
                employeeId: empId,
                employeeName: empData.firstName,
                action: `${empData.firstName} in the ${empData.department} department rescheduled a demo class for the ${classSchedule.program} program at the ${classSchedule.level} level with coach ${classSchedule.coachName}. Created on ${formattedDateTime}`,
                createdAt: new Date(),
              },
            },
          },
          { new: true }
        )
      )
    );

    res.status(200).json({ message: "Demo class rescheduled successfully" });
  } catch (err) {
    console.error("Error in rescheduling the demo class", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addNotesToTasks = async (req, res) => {
  try {
    console.log("Incoming Request to Add Notes to Task"); // Start of function debug
    const { id } = req.params; // Task ID
    const { enquiryStageTag, addNoteTo, notes } = req.body;

    // Retrieve empId from localStorage (client-side)
    const empId =
      req.headers.empid ||
      req.body.addedBy ||
      req.headers["empid-from-localstorage"]; // Attempting to get from headers

    console.log("Params (Task ID):", id);
    console.log("Request Body Received:", req.body);

    // Check for required fields
    if (!enquiryStageTag || !notes) {
      console.error("Validation Error: Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Enquiry Stage Tag and Notes are required.",
      });
    }

    // Fetch the employee details who added the note
    const addingEmployee = await Employee.findById(empId);
    if (!addingEmployee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    // Prepare new note object
    const newNote = {
      enquiryStageTag,
      addNoteTo: addNoteTo || "parent", // Default to 'parent'
      notes,
    };
    console.log("Prepared New Note Object:", newNote);

    // Update the task with the new note
    console.log("Attempting to update task with ID:", id);
    const updatedEntry = await Task.findByIdAndUpdate(
      id,
      { $push: { notes: newNote } },
      { new: true, runValidators: true } // Ensure validation is applied
    );

    // Check if the task was found
    if (!updatedEntry) {
      console.error("Task Not Found for ID:", id);
      return res.status(404).json({
        success: false,
        message: "Task not found with the provided ID.",
      });
    }

    // Log the activity (Adding Note)
    await ActivityLog.create({
      taskId: updatedEntry._id,
      action: "ADD_NOTE",
      details: `Note added to task ID: ${id} by ${addingEmployee.firstName}.${addingEmployee.email}`,
      performedBy: empId,
      performedByName: `${addingEmployee.firstName} ,${addingEmployee.email}`,
    });

    // Send success response
    console.log("Note added successfully to task ID:", id);
    return res.status(200).json({
      success: true,
      message: "Note added successfully.",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error occurred while adding note:", error.message);
    console.error("Stack Trace:", error.stack);
    return res.status(500).json({
      success: false,
      message: "An error occurred while adding the note.",
      error: error.message,
    });
  }
};

// Referral to a Friend
const referToFriend = async (req, res) => {
  try {
    const { id } = req.params;
    const { referredTo, referredEmail } = req.body;
    const updatedEntry = await OperationDept.findByIdAndUpdate(
      id,
      { referral: { referredTo, referredEmail } },
      { new: true }
    );
    if (!updatedEntry) {
      return res.status(404).json({ message: "Enquiry not found" });
    }
    res.status(200).json({
      success: true,
      message: "Referral added successfully",
      data: updatedEntry,
    });
  } catch (error) {
    console.error("Error adding referral", error);
    res.status(500).json({ message: "Error adding referral" });
  }
};
const createLeave = async (req, res) => {
  try {
    console.log("Eelcome to create leave", req.body);
    const { empId, ...leaveData } = req.body;

    const emp = await Employee.findById(empId).select("firstName");
    if (!emp) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    const newLeave = new leaves({
      ...leaveData,
      empId,
      employeeName: emp.firstName,
    });

    await newLeave.save();

    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      return `${day}/${month}/${year}`;
    };

    const formattedLeave = {
      ...newLeave._doc,
      leaveStartDate: formatDate(newLeave.leaveStartDate),
      leaveEndDate: newLeave.leaveEndDate
        ? formatDate(newLeave.leaveEndDate)
        : null,
    };

    res.status(201).json({
      success: true,
      message: "Leave created successfully",
      data: formattedLeave,
    });
  } catch (error) {
    console.error("Error creating leave", error);
    res.status(500).json({
      success: false,
      message: "Failed to create leave. Please try again later.",
    });
  }
};

const formatDate = (inputDate) => {
  const dateObj = new Date(inputDate);
  const dd = String(dateObj.getDate()).padStart(2, "0");
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const yy = String(dateObj.getFullYear()).slice(-2);
  return `${dd}-${mm}-${yy}`;
};

const createAttendance = async (req, res) => {
  try {
    const { empId } = req.params;
    const { status } = req.body;
    console.log("status", status);

    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    const now = new Date();
    const time = now.toLocaleTimeString();

    if (status === "Logout") {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const endOfToday = new Date(startOfToday);
      endOfToday.setDate(startOfToday.getDate() + 1);

      const todayAttendance = await attendance.findOne({
        empId,
        date: { $gte: startOfToday, $lt: endOfToday },
      });

      if (!todayAttendance) {
        return res.status(404).json({
          success: false,
          message: "Login record not found for today to mark logout.",
        });
      }

      todayAttendance.logoutTime = time;
      todayAttendance.isLogoutMarked = true;

      await todayAttendance.save();

      return res.status(201).json({
        success: true,
        message: "Logout marked successfully.",
        data: todayAttendance,
      });
    }

    const newAttendance = new attendance({
      date: now,
      loginTime: time,
      empId,
      empName: empData.firstName,
      department: empData.department,
      status,
      isLoginMarked: true,
    });

    await newAttendance.save();

    res.status(201).json({
      success: true,
      message: "Login attendance recorded successfully.",
      data: newAttendance,
    });
  } catch (error) {
    console.error("Error recording attendance", error);
    res.status(500).json({
      success: false,
      message: "Failed to record attendance. Please try again later.",
    });
  }
};

const getMyLeaveData = async (req, res) => {
  try {
    console.log("Welcome to fetch the leaves");
    const { empId } = req.params;
    const empLeaves = await leaves.find({ empId: empId });

    if (empLeaves && empLeaves.length > 0) {
      // Format the dates before sending the response
      const formattedLeaves = empLeaves.map((leave) => ({
        ...leave._doc,
        leaveStartDate: new Date(leave.leaveStartDate).toLocaleDateString(
          "en-US"
        ),
        leaveEndDate: new Date(leave.leaveEndDate).toLocaleDateString("en-US"),
        createdAt: new Date(leave.createdAt).toLocaleDateString("en-US"),
      }));

      res.status(200).json({
        success: true,
        message: "Employee leave data fetched successfully",
        formattedLeaves,
      });
    } else {
      res.status(401).json({
        success: false,
        message: "No leave data found for this employee",
      });
    }
  } catch (err) {
    console.error("Error in fetching my leaves", err);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching leave data",
      error: err.message,
    });
  }
};

const getMyIndividualLeave = async (req, res) => {
  try {
    const { levId } = req.params;
    const leavesData = await leaves.findOne({ _id: levId });

    if (!leavesData) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    console.log(leavesData);
    return res.status(200).json({ success: true, leavesData });
  } catch (err) {
    console.error("Error in getting the leave", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

const updateLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const { updatedData } = req.body;

    // Check if leave exists
    const existingLeave = await leaves.findById(id);
    if (!existingLeave) {
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });
    }

    // Delete the existing leave
    await leaves.findByIdAndDelete(id);

    // Get employee name from empId
    const emp = await Employee.findById(updatedData.empId).select("firstName");
    if (!emp) {
      return res
        .status(404)
        .json({ success: false, message: "Employee not found" });
    }

    // Create a new leave record
    const newLeave = new leaves({
      ...updatedData,
      employeeName: emp.firstName,
    });

    await newLeave.save();

    res.status(201).json({
      success: true,
      message: "Leave updated successfully by replacing the old one",
      data: newLeave,
    });
  } catch (error) {
    console.error("Error updating leave", error);
    res.status(500).json({ success: false, message: "Error updating leave" });
  }
};

const deleteLeave = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLeave = await leaves.findByIdAndDelete(id);
    if (!deletedLeave) {
      return res.status(404).json({ message: "Leave not found" });
    }
    res.status(200).json({ message: "Leave deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting leave" });
  }
};
const getAllLeaves = async (req, res) => {
  try {
    const { email } = req.query;
    console.log(email);

    // Fetch leaves for the given email
    const leavess = await leaves.find({ empEmail: email });

    // Format the dates to dd/mm/yy
    const formatDate = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
      return `${day}/${month}/${year}`;
    };

    // Format the response
    const formattedLeaves = leavess.map((leave) => ({
      ...leave._doc, // Spread the original leave document
      leaveStartDate: formatDate(leave.leaveStartDate),
      leaveEndDate: formatDate(leave.leaveEndDate),
    }));

    res.status(200).json(formattedLeaves);
  } catch (error) {
    console.error("Error fetching leaves", error);
    res.status(500).json({ message: "Error fetching leaves" });
  }
};
const createTask = async (req, res) => {
  try {
    console.log(req.body);
    const { task, taskDate, taskTime, assignedTo } = req.body;
    const empId = req.headers.empId || req.body.assignedBy;

    if (!empId) {
      return res
        .status(400)
        .json({ message: "AssignedBy (empId) is required" });
    }

    if (!empId) {
      return res.status(400).json({ message: "Invalid Employee ID format" });
    }

    const assigningEmployee = await Employee.findById(empId);
    console.log("assigningEmployee", assigningEmployee);
    const assignedToEmployee = await Employee.findOne({ email: assignedTo });
    if (!assigningEmployee) {
      return res.status(404).json({ message: "Assigning employee not found" });
    }

    const taskDateTime = new Date(`${taskDate}T${taskTime}:00`);

    const newTask = await Task.create({
      taskTime: taskDateTime,
      task,
      assignedBy: {
        id: empId,
        name: `${assigningEmployee.firstName}`,
        email: assigningEmployee.email,
        department: assigningEmployee.department,
      },
      assignedTo,
      assignedToName: assignedToEmployee.firstName,
      assignedTodepartment: assignedToEmployee.department,
    });

    // Log the activity
    await ActivityLog.create({
      taskId: newTask._id,
      action: "CREATE",
      details: `Task "${task}" created by ${assigningEmployee.firstName}.${assigningEmployee.email}`,
      performedBy: empId,
      performedByName: `${assigningEmployee.firstName}  ${assigningEmployee.email}`,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    });
  } catch (error) {
    console.error("Error creating task", error);
    res.status(400).json({ message: "Failed to create task", error });
  }
};
// Get All Tasks
const getAllTasks = async (req, res) => {
  try {
    // Fetch all tasks and populate 'assignedBy'
    const tasks = await Task.find().populate("assignedBy", "name email");
    console.log("Task==>", tasks);

    // Format date and time to dd/mm/yy HH:mm
    const formatDateTime = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formattedTasks = tasks.map((task) => ({
      ...task._doc, // Spread the original task document
      taskTime: formatDateTime(task.taskTime),
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
      assignedBy: task.assignedBy || { name: "No assigned person", email: "" }, // Keep it as an object
    }));

    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again later.",
    });
  }
};

const getTaskById = async (req, res) => {
  try {
    console.log("Welcome to my task");
    const { id } = req.params; // Get the task ID from the route parameters

    // Validate the task ID format
    if (!id) {
      return res.status(400).json({ message: "Invalid Task ID format" });
    }

    // Fetch the task by ID and populate 'assignedBy'
    const task = await Task.findById(id).populate("assignedBy", "name email");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Format date and time to dd/mm/yy HH:mm
    const formatDateTime = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = String(d.getFullYear()).slice(-2);
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    const formattedTask = {
      ...task._doc, // Spread the original task document
      taskTime: formatDateTime(task.taskTime),
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
      assignedBy: task.assignedBy || { name: "No assigned person", email: "" }, // Ensure assignedBy is always an object
    };

    res.status(200).json(formattedTask);
  } catch (error) {
    console.error("Error fetching task by ID", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch task. Please try again later.",
    });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params; // Task ID from the request params
    const { status } = req.body; // New status from the request body
    const empId = req.headers.empid; // Employee ID from headers

    // Validate inputs
    if (!id) {
      return res.status(400).json({ message: "Task ID is required" });
    }
    if (!status) {
      return res.status(400).json({ message: "Task status is required" });
    }
    if (!empId) {
      return res.status(400).json({ message: "UpdatedBy (empId) is required" });
    }
    if (!empId) {
      return res.status(400).json({ message: "Invalid Employee ID format" });
    }

    // Fetch employee details
    const updatingEmployee = await Employee.findById(empId);
    if (!updatingEmployee) {
      return res.status(404).json({ message: "Updating employee not found" });
    }

    // Update the task
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      {
        status,
        statusUpdatedBy: {
          id: empId,
          name: `${updatingEmployee.firstName} ${updatingEmployee.lastName}`,
          email: updatingEmployee.email,
        },
      },
      { new: true, runValidators: true } // Return the updated document and apply validation
    );

    if (!updatedTask) {
      return res
        .status(404)
        .json({ message: "Task not found with the provided ID" });
    }

    // Log the activity
    await ActivityLog.create({
      taskId: updatedTask._id,
      action: "UPDATE",
      details: `Task status updated to "${status}" by ${updatingEmployee.firstName}.${updatingEmployee.email}`,
      performedBy: empId,
      performedByName: `${updatingEmployee.firstName} ${updatingEmployee.email}`,
    });

    res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task status", error);
    res.status(500).json({ message: "Failed to update task status", error });
  }
};

const getMyPendingTasks = async (req, res) => {
  try {
    console.log("Welcome to get all task", req.params);

    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "empId are required" });
    }

    const empData = await Employee.findOne({ _id: id }, { email: 1 });
    console.log(empData);

    // Fetch tasks assigned to the employee
    const tasks = await Task.find({
      assignedTo: empData.email,
    });

    // Log the tasks if needed for debugging
    console.log(tasks);

    // Format date and time to dd/mm/yy HH:mm
    const formatDateTime = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Format the tasks with proper date and time
    const formattedTasks = tasks.map((task) => ({
      ...task._doc, // Spread the original task document
      taskTime: formatDateTime(task.taskTime),
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
    }));

    // Send response with the filtered tasks
    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again later.",
    });
  }
};

const assignTaskToOthers = async (req, res) => {
  try {
    console.log("Welcome to get all task", req.params);

    const { id } = req.params;
    console.log(id);

    if (!id) {
      return res.status(400).json({ message: "empId are required" });
    }

    const empData = await Employee.findOne({ _id: id }, { email: 1 });
    console.log(empData);

    // Fetch tasks assigned to the employee
    const tasks = await Task.find({
      "assignedBy.email": empData.email,
    });

    // Log the tasks if needed for debugging

    // Format date and time to dd/mm/yy HH:mm
    const formatDateTime = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Format the tasks with proper date and time
    const formattedTasks = tasks.map((task) => ({
      ...task._doc, // Spread the original task document
      taskTime: formatDateTime(task.taskTime),
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
    }));

    // Send response with the filtered tasks
    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again later.",
    });
  }
};

const getMyTasks = async (req, res) => {
  try {
    console.log("Welcome to get all task", req.params);

    // Fetch tasks assigned to the employee
    const tasks = await Task.find();

    // Log the tasks if needed for debugging
    console.log(tasks);

    // Format date and time to dd/mm/yy HH:mm
    const formatDateTime = (date) => {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = String(d.getFullYear()).slice(-2); // Get last 2 digits of the year
      const hours = String(d.getHours()).padStart(2, "0");
      const minutes = String(d.getMinutes()).padStart(2, "0");
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    // Format the tasks with proper date and time
    const formattedTasks = tasks.map((task) => ({
      ...task._doc, // Spread the original task document
      taskTime: formatDateTime(task.taskTime),
      createdAt: formatDateTime(task.createdAt),
      updatedAt: formatDateTime(task.updatedAt),
    }));

    // Send response with the filtered tasks
    res.status(200).json(formattedTasks);
  } catch (error) {
    console.error("Error fetching tasks", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks. Please try again later.",
    });
  }
};

// Update Task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params; // Task ID from the request params
    const empId = req.headers.empId || req.body.empId; // Employee ID from headers or body

    if (!empId) {
      return res
        .status(400)
        .json({ message: "Employee ID (empId) is required" });
    }

    // Fetch task before updating to get the task details
    const taskToUpdate = await Task.findById(id);
    if (!taskToUpdate) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Proceed with updating the task
    const updatedTask = await Task.findByIdAndUpdate(id, req.body, {
      new: true, // Return the updated document
      runValidators: true, // Ensure that validations are applied
    });

    // Check if the task was updated successfully
    if (!updatedTask) {
      return res.status(404).json({ message: "Failed to update task" });
    }

    // Log the activity for task update
    const updatingEmployee = await Employee.findById(empId);
    if (!updatingEmployee) {
      return res.status(404).json({ message: "Updating employee not found" });
    }

    await ActivityLog.create({
      taskId: updatedTask._id,
      action: "UPDATE",
      details: `Task updated by ${
        updatingEmployee.firstName
      }  Changes: ${JSON.stringify(req.body)}`,
      performedBy: empId,
      performedByName: `${updatingEmployee.firstName}`,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task. Please try again later.",
      error: error.message,
    });
  }
};

const getActivityLogsByTaskId = async (req, res) => {
  try {
    const { id } = req.params; // 'id' from the route parameter

    // Debugging the received taskId
    console.log("Received Task ID:", id);

    // Validate the task ID format
    if (!id) {
      return res
        .status(400)
        .json({ message: "Invalid Task ID format", taskId: id });
    }

    // Fetch all activity logs associated with the provided task ID
    const activityLogs = await ActivityLog.find({ taskId: id }).sort({
      createdAt: -1,
    }); // Sort by most recent first

    if (!activityLogs || activityLogs.length === 0) {
      return res
        .status(404)
        .json({ message: "No activity logs found for the provided task" });
    }

    res.status(200).json({
      success: true,
      message: "Activity logs for task retrieved successfully",
      data: activityLogs,
    });
  } catch (error) {
    console.error("Error fetching activity logs by task ID", error);
    res.status(500).json({ message: "Failed to fetch activity logs", error });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting task", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task. Please try again later.",
    });
  }
};

const fetchAttendance = async (req, res) => {
  try {
    const { date } = req.query; // Get the date from query params, e.g., '?date=YYYY-MM-DD'

    // Parse the date or use today's date
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0); // Reset time to midnight

    // Fetch all employee names (assuming an Employee model or predefined list)
    const employees = await Employee.find({}, { name: 1 }); // Fetch all employee names

    // Fetch attendance for the target date
    const attendanceRecords = await attendance.find({
      attendanceDate: targetDate,
    });

    // Create a map of attendance records for quick lookup
    const attendanceMap = attendanceRecords.reduce((acc, record) => {
      acc[record.employeeName] = record;
      return acc;
    }, {});

    // Generate the attendance response, marking absent if no record found
    const attendanceResponse = employees.map((employee) => {
      if (attendanceMap[employee.name]) {
        return {
          employeeName: employee.firstName,
          status: attendanceMap[employee.name].status,
          time: attendanceMap[employee.name].time,
        };
      } else {
        return {
          employeeName: employee.firstName,
          status: "Absent",
          time: null, // No time for absent employees
        };
      }
    });

    res.status(200).json({
      success: true,
      data: attendanceResponse,
    });
  } catch (error) {
    console.error("Error fetching attendance", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attendance. Please try again later.",
    });
  }
};

const getAllKidData = async (req, res) => {
  try {
    // Fetch all kids data (excluding `kidPin`)
    const kidsData = await kidSchema.find({}, { kidPin: 0 });

    const kidsWithParentData = await Promise.all(
      kidsData.map(async (kid) => {
        const parentData = await parentSchema.findOne(
          { _id: kid.parentId },
          { parentName: 1, parentEmail: 1, parentMobile: 1 }
        );
        return {
          ...kid.toObject(),
          parentData,
        };
      })
    );

    console.log(kidsWithParentData);

    // Return the result
    res.status(200).json(kidsWithParentData);
  } catch (err) {
    console.error("Error in getting kids data", err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getAllParentData = async (req, res) => {
  try {
    // Fetch all parent data (excluding `parentPin`)
    const parentData = await parentSchema.find({}, { parentPin: 0 });

    // Fetch kids data for each parent
    const parentsWithKidsData = await Promise.all(
      parentData.map(async (parent) => {
        // Fetch kids data based on `parentId`
        const kidsData = await kidSchema.find(
          { parentId: parent._id },
          { kidPin: 0 } // Exclude `kidPin`
        );
        return {
          ...parent.toObject(), // Convert Mongoose document to plain object
          kidsData,
        };
      })
    );

    console.log(parentsWithKidsData);

    // Return the result
    res.status(200).json(parentsWithKidsData);
  } catch (err) {
    console.error("Error in getting the parent data", err);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
};

const getProspectsStudentsData = async (req, res) => {
  try {
    const prospectData = await OperationDept.find(
      { enquiryField: "prospects", "scheduleDemo.status": "Pending" },
      {
        parentFirstName: 1,
        kidFirstName: 1,
        programs: 1,
        whatsappNumber: 1,
        email: 1,
        logs: 1,
      }
    );

    if (!prospectData || prospectData.length === 0) {
      return res.status(404).json({ message: "No prospect data found" });
    }

    res.status(200).json({
      success: true,
      message: "Prospect data retrieved successfully",
      data: prospectData,
    });
  } catch (err) {
    console.error("Error in getting prospects data", err);
    res.status(500).json({
      success: false,
      message: "Error in retrieving prospect data",
      error: err.message,
    });
  }
};
const scheduleDemoClass = async (req, res) => {
  try {
    console.log("Welcome to schedule demo class");
    console.log(req.params, req.body);

    const { id } = req.params;
    const { date, time, selectedProgram, email, _id, kidFirstName } =
      req.body.data;
    console.log("_id", _id);

    if (!date || !time || !selectedProgram) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const empData = await Employee.findOne(
      { _id: id },
      { department: 1, name: 1 }
    );
    if (!empData) {
      return res.status(404).json({ message: "Employee not found." });
    }
    console.log("Employee Data", empData);

    const parentData = await Parent.findOne({ parentEmail: email }, { _id: 1 });
    if (!parentData) {
      return res.status(404).json({ message: "Parent not found." });
    }

    const kidsData = await kidSchema.findOne(
      { parentId: parentData._id },
      { _id: 1 }
    );
    if (!kidsData) {
      return res.status(404).json({ message: "Kid not found." });
    }

    const existingClasses = await DemoClass.find({
      date,
      time,
      kidId: kidsData._id,
    });
    if (existingClasses.length > 0) {
      return res.status(400).json({
        message: `A demo class is already scheduled for this date and time.`,
        existingClasses,
      });
    }

    const demoClass = await DemoClass.create({
      date,
      time,
      programs: [
        {
          program: selectedProgram.program,
          programLevel: selectedProgram.level,
        },
      ],
      kidId: kidsData._id,
      parentId: parentData._id,
      scheduledByName: empData.name,
      scheduledById: id,
      enqId: _id,
    });

    const logId = await OperationDept.findOne({ _id: _id }, { logs: 1 });
    console.log("logs data", logId);

    const logs = [
      {
        employeeId: id,
        employeeName: empData.firstName,

        action: `Demo class is sheduled for ${kidFirstName} with ${selectedProgram.program} Level: ${selectedProgram.level}`,
        createdAt: new Date(),
      },
    ];

    const updatedEnquiry = await enquiryLogs.findOneAndUpdate(
      { _id: logId.logs },
      {
        $push: {
          logs: logs,
        },
      },
      { new: true }
    );

    const updateStatus = await OperationDept.findByIdAndUpdate(
      _id,
      {
        $set: {
          "scheduleDemo.status": "Sheduled",
        },
      },
      { new: true }
    );

    console.log("id", updateStatus, _id);

    if (!updatedEnquiry) {
      return res
        .status(404)
        .json({ message: "Log not found in enquiry form." });
    }

    // Respond with the created demo class and updated enquiry log
    res.status(201).json({
      message: "Demo class scheduled successfully and log updated.",
      demoClass,
      updatedEnquiry,
    });
  } catch (err) {
    console.error("Error scheduling demo class:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
};

const getAllAttandanceData = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
  } catch (err) {
    console.log("Error in fetching the attandance", err);
  }
};

const getAllSheduleClass = async (req, res) => {
  try {
    const scheduleData = await ClassSchedule.find({ isDemoAdded: true });
    console.log("Demo Class Schedule Data:", scheduleData);

    res.status(200).json({
      success: true,
      message: "Demo class schedules retrieved successfully",
      scheduleData,
    });
  } catch (err) {
    console.error("Error in getting the demo class", err);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};

const fetchAllLogs = async (req, res) => {
  try {
    console.log("Welcome to fetch logs");
    const { id } = req.params;

    const logsData = await enquiryLogs.findOne({ enqId: id });

    if (!logsData) {
      return res.status(404).json({ message: "Logs not found" });
    }

    // 👉 Sort the logs array by createdAt descending
    const sortedLogs = logsData.logs.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Extract only createdAt and action
    const logs = sortedLogs.map((log) => ({
      comment: log.comment,
      empName: log.employeeName,
      department: log.department,
      createdAt: moment(log.createdAt).format("DD-MM-YY , hh:mm A"),
      action: log.action,
    }));

    return res.status(200).json(logs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in fetching the logs", error: err.message });
  }
};

const getDemoClassAndStudentsData = async (req, res) => {
  try {
    console.log(
      "Welcome to getting the demo class and student data ==>",
      req.params
    );
    const { enqId } = req.params;

    // Find kids data by enquiry ID
    const kidsData = await OperationDept.findOne(
      {
        _id: enqId,
        enquiryField: "prospects",
        "scheduleDemo.status": "Pending",
      },
      { kidFirstName: 1, kidId: 1, programs: 1 } // Project only the required fields
    );

    if (!kidsData) {
      return res.status(404).json({ message: "Kids data not found" });
    }

    console.log("Kids Data", kidsData);

    // Extract program and level from kidsData
    const { programs } = kidsData;
    const programFilters = programs.map((program) => ({
      program: program.program,
      level: program.level,
    }));

    // Find class data matching program and level
    const classData = await ClassSchedule.find({
      $or: programFilters, // Match any program and level from kidsData
      isDemoAdded: true, // Ensure the class type is "Demo"
      // status: "Scheduled", // Match only scheduled classes
    });

    if (!classData.length) {
      return res.status(404).json({ message: "No demo classes found" });
    }

    console.log("Class Data", classData);

    res.status(200).json({ classData, kidsData });
  } catch (err) {
    console.error("Error in getting the demo class and student data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSheduledDemoClassDataOfKid = async (req, res) => {
  try {
    console.log(
      "Welcome to getting the demo class of the selected kid with enq id",
      req.params
    );
    const { enqId } = req.params;

    // Find kids data by enquiry ID
    const kidsData = await OperationDept.findOne(
      { _id: enqId },
      { kidFirstName: 1, kidId: 1, programs: 1 } // Project only the required fields
    );

    if (!kidsData) {
      return res.status(404).json({ message: "Kids data not found" });
    }

    console.log("Kids Data", kidsData);

    // Extract program and level from kidsData
    const { programs, kidId } = kidsData;

    // Iterate over each program and level and fetch classes
    const classData = await ClassSchedule.find({
      $and: [
        { isDemoAdded: true }, // Match classType
        { status: "Scheduled" }, // Match status
        { selectedStudents: { $elemMatch: { kidId } } }, // Match kidId in selectedStudents
        {
          $or: programs.map((program) => ({
            program: program.program, // Match program
            level: program.level, // Match level
          })),
        },
      ],
    });

    if (!classData.length) {
      return res.status(404).json({ message: "No demo classes found" });
    }

    console.log("Class Data", classData);

    res.status(200).json({ classData, kidsData });
  } catch (err) {
    console.error("Error in getting the demo class and student data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getDemoClassAndStudentsDataGroup = async (req, res) => {
  try {
    console.log(
      "Welcome to getting the demo class and student data==>",
      req.params
    );
    const { classId } = req.params;

    // Find the class data by ID
    const classData = await ClassSchedule.find({ _id: classId });

    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Find kids data matching the program and level in arrays
    const kidsData = await OperationDept.find(
      {
        enquiryField: "prospects",
        "scheduleDemo.status": "Pending",
        programs: {
          $elemMatch: {
            program: classData[0].program,
            level: classData[0].level,
          },
        },
      },
      { kidFirstName: 1, kidId: 1 } // Project only the required fields
    );

    console.log("Class Data", classData);
    console.log("Kids Data", kidsData);

    res.status(200).json({ classData, kidsData });
  } catch (err) {
    console.error("Error in getting the demo class and student data", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const saveDemoClassData = async (req, res) => {
  try {
    console.log("Welcome to save the demo class", req.body, req.params);

    const { empId } = req.params;
    let { classId, students } = req.body;
    students = Array.isArray(students) ? students : [students];
    console.log(students);

    // Fetch employee data
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    // Fetch kids data
    const kidsData = await OperationDept.find(
      { kidId: { $in: students } },
      { kidFirstName: 1, _id: 1, logs: 1, kidId: 1 }
    );

    console.log("Fetched kids data:", kidsData);
    console.log("Fetched empData:", empData);

    // Fetch the class schedule data
    const classSchedule = await ClassSchedule.findById(classId);

    if (!classSchedule) {
      return res.status(404).json({ message: "Class schedule not found." });
    }

    // Prepare new selected students data
    const updatedSelectedStudents = students.map((studentId) => {
      console.log();
      const kid = kidsData.find((kid) => kid.kidId === studentId);
      return {
        kidId: kid.kidId,
        kidName: kid ? kid.kidFirstName : "Unknown",
      };
    });

    console.log("updatedSelectedStudents", updatedSelectedStudents, kidsData);

    // Update class schedule with the new selected students (using $push to add to existing array)
    await ClassSchedule.findByIdAndUpdate(
      classId,
      {
        $push: {
          selectedStudents: { $each: updatedSelectedStudents },
        },
        $set: {
          "scheduledBy.id": empData._id,
          "scheduledBy.department": empData.department,
          "scheduledBy.name": empData.firstName || "",
        },
      },
      { new: true }
    );

    // Update the scheduleDemo field in the kidsData
    const updatedKidsDataPromises = kidsData.map(async (kid) => {
      if (students.includes(kid.kidId)) {
        kid.scheduleDemo = {
          status: "Scheduled",
          scheduledDay: classSchedule.day,
        };

        await kid.save();
      }
    });

    // Wait for all updates to finish
    await Promise.all(updatedKidsDataPromises);

    // Update logs for each student
    const logUpdatePromises = kidsData.map(async (kid) => {
      if (students.includes(kid.kidId)) {
        // Find the log entry specific to this student
        await enquiryLogs.findByIdAndUpdate(
          kid.logs, // Assuming 'logs' in kidsData contains the ID of the log document
          {
            $push: {
              logs: {
                employeeId: empId,
                employeeName: empData.firstName, // Assuming 'name' contains the employee's full name
                action: ` ${empData.firstName} in the ${empData.department} department scheduled a demo class for the ${classSchedule.program} program at the ${classSchedule.level} level with coach ${classSchedule.coachName}.`,
                createdAt: new Date(),
              },
            },
          },
          { new: true }
        );
      }
    });

    // Wait for all log updates to finish
    await Promise.all(logUpdatePromises);

    // Respond with success
    res.status(200).json({
      message: "Demo class data saved successfully.",
      updatedClassSchedule: classSchedule,
      updatedKidsData: kidsData,
    });
  } catch (err) {
    console.log("Error in saving the demo class", err);
    res
      .status(500)
      .json({ error: "An error occurred while saving the demo class." });
  }
};

// const getConductedDemoClass = async (req, res) => {
//   try {
//     const classSchedule = await ClassSchedule.find({ classType: "Demo" });
//     console.log("classSchedule", classSchedule);
//     const conductedClasses = await ConductedClass.find();
//     console.log("conductedClasses", conductedClasses);
//     const kidsWithPaymentSucess = await OperationDept.find({payment:"Success"},{kidId:1})
//     console.log("kidsWithPaymentSucess",kidsWithPaymentSucess)

//     const conductedDemoClasses = classSchedule.map(schedule => {

//       const conductedDetails = conductedClasses.filter(
//         conducted => conducted.classID.toString() === schedule._id.toString()
//       );

//       return conductedDetails.map(conducted => ({
//         ...schedule.toObject(),
//         conductedDate: conducted.conductedDate,
//         status: conducted.status,
//         students: conducted.students,
//       }));
//     });

//     const flattenedDemoClasses = conductedDemoClasses.flat();

//     console.log("Conducted demo class", flattenedDemoClasses);

//     res.status(200).json(flattenedDemoClasses);
//   } catch (err) {
//     console.log("Error in getting the conducted demo class", err);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

const getConductedDemoClass = async (req, res) => {
  try {
    const classSchedule = await ClassSchedule.find({ classType: "Demo" });
    const conductedClasses = await ConductedClass.find();
    const kidsWithPaymentSucess = await OperationDept.find(
      { payment: "Success" },
      { kidId: 1 }
    );

    const paidKidIds = kidsWithPaymentSucess.map((kid) => kid.kidId.toString());

    const conductedDemoClasses = classSchedule.map((schedule) => {
      const conductedDetails = conductedClasses.filter(
        (conducted) => conducted.classID.toString() === schedule._id.toString()
      );

      return conductedDetails.map((conducted) => {
        // Filter out students who have not made a successful payment
        const studentsWithoutPayment = conducted.students.filter((student) => {
          const studentId = student.studentID
            ? student.studentID.toString()
            : student.toString(); // Handle both cases where student could be a direct ID or an object
          return !paidKidIds.includes(studentId); // Only students who haven't paid
        });
        return {
          ...schedule.toObject(),
          conductedDate: conducted.conductedDate,
          status: conducted.status,
          students: studentsWithoutPayment,
        };
      });
    });

    const flattenedDemoClasses = conductedDemoClasses.flat();

    res.status(200).json(flattenedDemoClasses);
  } catch (err) {
    console.log("Error in getting the conducted demo class", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateEnrollmentStatus = async (req, res) => {
  try {
    const { id, empId } = req.params;
    console.log("Id status", id);
    const empData = await Employee.findOne(
      { _id: empId },
      { firstName: 1, department: 1 }
    );

    const enrollmentData = await kidSchema.findOne(
      { _id: id },
      { enqId: 1, kidsName: 1 }
    );
    const logId = await OperationDept.findOne(
      { _id: enrollmentData.enqId },
      { logs: 1 }
    );
    console.log("logId", logId.logs);
    console.log("enrollmentData", enrollmentData);

    const formattedDateTime = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());

    await enquiryLogs.findByIdAndUpdate(
      logId.logs,
      {
        $push: {
          logs: {
            employeeId: empId,
            employeeName: empData.firstName,
            action: ` ${empData.firstName} in the ${empData.department} department confirmed the payment success for the kid ${enrollmentData.kidsName} . Created on ${formattedDateTime}`,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!enrollmentData) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    console.log("Enrollment Data", enrollmentData);

    const updateEqStatus = await OperationDept.findOneAndUpdate(
      { _id: enrollmentData.enqId, payment: "Pending" },
      { $set: { payment: "Success" } },
      { new: true }
    );

    if (!updateEqStatus) {
      return res
        .status(404)
        .json({ message: "Enrollment with pending payment not found" });
    }

    console.log("Updated Enrollment Status", updateEqStatus);

    return res.status(200).json({
      message: "Payment status updated successfully",
      updatedStatus: updateEqStatus,
    });
  } catch (err) {
    console.error("Error in updating the status", err);
    return res
      .status(500)
      .json({ message: "Server error while updating the status" });
  }
};

const getDropDownData = async (req, res) => {
  try {
    const kidsData = await kidSchema.find({}, { _id: 1, kidsName: 1 });
    const employeeData = await Employee.find(
      {},
      { _id: 1, firstName: 1, email: 1, department: 1 }
    );

    res.status(200).json({
      success: true,
      message: "Dropdown data fetched successfully.",
      data: {
        kidsData,
        employeeData,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching dropdown data.",
      error: err.message,
    });
  }
};

const specificKidAssignTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Welcome", id);

    // Fetch kid's data
    const kidsData = await OperationDept.findOne(
      { _id: id },
      { _id: 1, kidFirstName: 1, programs: 1, whatsappNumber: 1 }
    );

    // Fetch employee data filtered by specific departments
    const allowedDepartments = [
      "operation",
      "service-delivery",
      "marketing",
      "renewal",
      "coach",
    ];
    const employeeData = await Employee.find(
      { department: { $in: allowedDepartments } },
      { _id: 1, firstName: 1, email: 1, department: 1 }
    );
    console.log("kidsData", kidsData);
    console.log("employeeData", employeeData);

    res.status(200).json({
      success: true,
      message: "Dropdown data fetched successfully.",
      data: {
        kidsData,
        employeeData,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching dropdown data.",
      error: err.message,
    });
  }
};

const fetchAllStatusLogs = async (req, res) => {
  try {
    const { id } = req.params;
    const notesData = await NotesSection.findOne({ enqId: id });

    if (!notesData) {
      return res.status(404).json({
        success: false,
        message: `No notes found for enquiry ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Notes retrieved successfully",
      data: notesData,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching notes",
      error: err.message,
    });
  }
};

const savePaymentData = async (req, res) => {
  try {
    console.log("Welcome to send the payment link", req.body);

    const { enqId } = req.params;
    const { paymentData, link } = req.body;

    // Fetch the kid data
    const enqData = await OperationDept.findOne(
      { _id: enqId },
      { payment: 1, logs: 1 }
    );
    const kidData = await kidSchema.findOne({ enqId: enqId }, { parentId: 1 });
    if (!kidData) {
      return res.status(404).json({ message: "Kid data not found" });
    }
    console.log("Kid data", kidData);

    // Fetch the parent data
    const parentData = await parentSchema.findOne(
      { _id: kidData.parentId },
      { parentMobile: 1, paymentStatus: 1 }
    );
    if (!parentData) {
      return res.status(404).json({ message: "Parent data not found" });
    }

    // Update the parent's payment link
    const updatedParent = await parentSchema.findByIdAndUpdate(
      kidData.parentId,
      { $set: { paymentLink: link } },
      { new: true } // Return the updated document
    );
    console.log("Updated parent data", updatedParent);

    // Update the kid's payment status
    enqData.payment = "Requested";
    enqData.paymentLink = link;
    await enqData.save(); // Make sure you save the kidData after modifying the payment field

    res.status(200).json({ message: "Payment link sent successfully" });
  } catch (err) {
    console.error("Error in sending the payment link", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// const savePaymentData = async (req, res) => {
//   try {
//     console.log("Welcome to send the payment link", req.body);

//     const { enqId } = req.params;
//     const { paymentData,link } = req.body;

//     // Fetch the kid data
//     const enqData = await OperationDept.findOne(
//       { _id: enqId },
//       { payment: 1, logs: 1 }
//     );
//     const kidData = await kidSchema.findOne({ enqId: enqId }, { parentId: 1 });

//     if (!kidData) {
//       return res.status(404).json({ message: "Kid data not found" });
//     }
//     console.log("Kid data", kidData);

//     // Fetch the parent data
//     const parentData = await parentSchema.findOne(
//       { _id: kidData.parentId },
//       { parentMobile: 1, paymentStatus: 1 }
//     );

//     if (!parentData) {
//       return res.status(404).json({ message: "Parent data not found" });
//     }

//     // Extract payment details
//     const {
//       kidId,
//       kidName,
//       whatsappNumber,
//       selectionType,
//       classDetails,
//       kitItem,
//       baseAmount,
//       gstAmount,
//       totalAmount,
//       offlineClasses,
//       onlineClasses,
//       centerName,
//       centerId,
//       selectedClass,
//       selectedPackage,
//       amount,
//       packageId
//     } = paymentData;

//     const paymentRecord = new classPaymentModel({
//       amount: totalAmount,
//       classDetails: {
//         packageId,
//         centerId: centerId || null,
//         centerName: centerName || null,
//         selectedClass,
//         selectedPackage,
//         classType: classDetails?.classType,
//         day: classDetails?.day,
//         numberOfClasses: classDetails?.numberOfClasses,
//         offlineClasses,
//         onlineClasses,
//       },
//       enqId,
//       kidId,
//       kidName,
//       kitItem,
//       selectionType,
//       baseAmount,
//       gstAmount,
//       totalAmount: amount,
//       whatsappNumber,
//       parentId: parentData._id,
//       timestamp: Date.now(),
//     });

//     const savedPayment = await paymentRecord.save();
//     console.log("Payment data saved successfully", savedPayment);

//       const updatedParent = await parentSchema.findByIdAndUpdate(
//       kidData.parentId,
//       { $set: { paymentLink: link } },
//       { new: true } // Return the updated document
//     );
//     console.log("Updated parent data", updatedParent);

//     // Update the kid's payment status
//     enqData.payment = "Requested";
//     enqData.paymentLink = link;
//     await enqData.save(); // Make sure you save the kidData after modifying the payment field

//     res.status(200).json({ message: "Payment link sent successfully" });

//   } catch (err) {
//     console.error("Error in sending the payment link", err);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

const getPackageData = async (req, res) => {
  try {
    const onlinePackageData = await onlineClassPackage.find();
    const offlineClassPackageData = await offlineClassPackage.find();
    const hybridClassPackageData = await hybridClassPackage.find();
    const kitPrice = await kitPackages.find();

    res.status(200).json({
      success: true,
      message: "All package data fetched successfully",
      data: {
        onlinePackageData,
        offlineClassPackageData,
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

const getDiscountVouchers = async (req, res) => {
  try {
    const { enqId } = req.params;
    const enqData = await OperationDept.findOne(
      { _id: enqId },
      { isNewUser: 1 }
    );

    if (!enqData) {
      return res.status(404).json({ message: "Enquiry not found" });
    }

    const physicalCenters = await PhysicalCenters.find({}, { centerName: 1 });
    console.log("physicalCenters", physicalCenters);

    const discountData = await Voucher.find();
    const today = new Date();
    console.log("discountData", discountData);

    const validVouchers = discountData.filter((voucher) => {
      const isUserValid = voucher.condition === "new user" && enqData.isNewUser;

      const isDateValid =
        today >= new Date(voucher.startDate) &&
        today <= new Date(voucher.expiry);
      const isSlotsAvailable = voucher.usedCount < voucher.slots;

      return isUserValid && isDateValid && isSlotsAvailable;
    });

    if (validVouchers.length === 0) {
      return res.status(200).json({
        message: "No valid vouchers available",
        discount: 0,
        physicalCenters,
      });
    }
    console.log("validVouchers", validVouchers);

    return res.status(200).json({
      message: "Valid vouchers found",
      vouchers: validVouchers[0].value,
      physicalCenters,
    });
  } catch (err) {
    console.error("Error in getting the discount for new enquiry", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const departmentPayNowOption = async (req, res) => {
  try {
    console.log("Welcome to making the department payment option", req.body);
    const { paymentData } = req.body;

    const { enqId, kidId, transactionId } = paymentData;
    console.log(enqId, kidId);

    // Fetch parent data
    const parentData = await kidSchema.findOne({ _id: kidId }, { parentId: 1 });

    if (!parentData) {
      return res.status(400).json({ message: "Invalid kidId" });
    }

    // Update statuses
    await Promise.all([
      parentSchema.findByIdAndUpdate(parentData.parentId, {
        $set: { status: "Active" },
      }),
      kidSchema.findByIdAndUpdate(kidId, { $set: { status: "Active" } }),
      OperationDept.findByIdAndUpdate(enqId, {
        $set: { status: "Active", payment: "Success", isNewUser: false },
      }),
    ]);

    // Destructure paymentData
    const {
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

    // Create and save payment record
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
        classMode: classDetails.classMode,
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
      parentId: parentData.parentId,
      raz_transaction_id: transactionId,
      paymentStatus: "Success",
      timestamp: Date.now(),
    });

    const savedPayment = await paymentRecord.save();
    console.log("Payment data saved successfully", savedPayment);

    // Update enquiry status
    await OperationDept.updateOne(
      { _id: enqId },
      { $set: { "scheduleDemo.status": "Completed" } }
    );

    res.status(201).json({
      message: "Payment data saved successfully",
      data: savedPayment,
    });
  } catch (err) {
    console.error("Error in making the department payments", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getThePhysicalCenterName = async (req, res) => {
  try {
    console.log("Welcome to the physical center");

    const centerData = await PhysicalCenters.find(
      {},
      { centerId: 1, centerName: 1 }
    );

    if (!centerData || centerData.length === 0) {
      return res.status(404).json({ message: "No physical centers found" });
    }

    console.log("CenterData", centerData);

    res.status(200).json({
      message: "Physical centers retrieved successfully",
      centerData,
    });
  } catch (err) {
    console.error("Error in getting the physical center name", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const updatePaymentData = async (req, res) => {
  try {
    console.log("Welcome to update the payments", req.body);
    const { data } = req.body;
    const { originalData } = data;

    if (!originalData) {
      return res.status(400).json({ message: "Invalid payment data" });
    }

    const { enqId, kidId, transactionId } = originalData;
    console.log(enqId, kidId);

    // Fetch parent data
    const parentData = await kidSchema.findOne({ _id: kidId }, { parentId: 1 });

    if (!parentData) {
      return res.status(400).json({ message: "Invalid kidId" });
    }

    // Update statuses
    await Promise.all([
      parentSchema.findByIdAndUpdate(parentData.parentId, {
        $set: { status: "Active" },
      }),
      kidSchema.findByIdAndUpdate(kidId, { $set: { status: "Active" } }),
      OperationDept.findByIdAndUpdate(enqId, {
        $set: { status: "Active", payment: "Success", isNewUser: false },
      }),
    ]);

    // Destructure required fields
    const {
      packageId,
      selectedPackage,
      onlineClasses,
      offlineClasses,
      classMode,
      centerId,
      centerName,
      baseAmount,
      discountAmount,
      gstAmount,
      totalAmount,
      kidName,
      whatsappNumber,
      customAmount,
      kitItems,
      programs,
    } = originalData;

    // Create and save payment record
    const paymentRecord = new classPaymentModel({
      amount: totalAmount,
      classDetails: {
        packageId,
        centerId,
        centerName,
        selectedPackage,
        classType: originalData.classType || "", // Ensure field exists
        day: originalData.day || "",
        numberOfClasses: onlineClasses + offlineClasses,
        offlineClasses,
        onlineClasses,
      },
      enqId,
      kidId,
      kidName,
      kitItem: kitItems.length > 0 ? kitItems.join(", ") : "",
      kitItems,
      classMode,
      selectionType: data.selectionType,
      baseAmount,
      gstAmount,
      totalAmount,
      discountAmount,
      customAmount,
      whatsappNumber,
      parentId: parentData.parentId,
      raz_transaction_id: transactionId || "N/A", // Handle null transactionId
      paymentStatus: "Success",
      paymentMode: data.paymentMode || "online",
      programs,
      timestamp: Date.now(),
    });

    const savedPayment = await paymentRecord.save();
    console.log("Payment data saved successfully", savedPayment);

    // Update enquiry status
    await OperationDept.updateOne(
      { _id: enqId },
      { $set: { "scheduleDemo.status": "Completed" } }
    );

    res.status(201).json({
      message: "Payment data saved successfully",
      data: savedPayment,
    });
  } catch (err) {
    console.error("Error in updating payment data:", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const makeaCallToParent = async (req, res) => {
  try {
    const { mobile } = req.body;

    const response = await fetch(`${CALLING_API}=${mobile}`, {
      method: "POST",
    });

    const data = await response.json();
    res.json(data);
    // res.status(200).json()
  } catch (error) {
    console.error("Error calling external API:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const getEmployeeData = async (req, res) => {
  try {
    const { empId } = req.params;
    const employeeData = await Employee.findOne({ _id: empId });

    if (!employeeData) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json(employeeData);
  } catch (err) {
    console.error("Error in getting the employee data in the sidebar", err);
    res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const isAttendanceMarked = async (req, res) => {
  try {
    const { empId } = req.params;

    const now = new Date();
    const startOfTodayUTC = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
    );
    const startOfTomorrowUTC = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    );

    const todayAttendance = await attendance.findOne({
      empId: empId,
      date: { $gte: startOfTodayUTC, $lt: startOfTomorrowUTC },
    });

    console.log("Today's Attendance:", todayAttendance);

    if (!todayAttendance) {
      return res.status(200).json({ nextAction: "login" });
    }

    const { isLoginMarked, isLogoutMarked } = todayAttendance;

    if (!isLoginMarked && !isLogoutMarked) {
      return res.status(200).json({ nextAction: "login" });
    } else if (isLoginMarked && !isLogoutMarked) {
      return res.status(200).json({ nextAction: "logout" });
    } else {
      return res.status(200).json({ nextAction: "attendance marked" });
    }
  } catch (err) {
    console.error("Error in checking attendance:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// const getMyAttendanceData = async (req, res) => {
//   try {
//     const { empId } = req.params;

//     const now = new Date();
//     const year = now.getFullYear();
//     const month = now.getMonth();

//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const startOfMonth = new Date(year, month, 1);
//     const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

//     const attendanceRecords = await attendance.find({
//       empId,
//       date: {
//         $gte: startOfMonth,
//         $lte: endOfMonth,
//       },
//     });

//     const attendanceMap = {};
//     attendanceRecords.forEach(record => {
//       const dateStr = new Date(record.date).toISOString().split("T")[0];
//       attendanceMap[dateStr] = {
//         status: record.status,
//         loginTime: record.loginTime,
//         logoutTime: record.logoutTime || null,
//       };
//     });

//     let presentCount = 0;
//     let lateCount = 0;
//     let absentCount = 0;
//     let workingDaysCount = 0;

//     const attendanceSummary = [];

//     for (let day = 1; day <= daysInMonth; day++) {
//       const dateObj = new Date(year, month, day);
//       const dateStr = dateObj.toISOString().split("T")[0];

//       const isWeekday = dateObj.getDay() !== 0 && dateObj.getDay() !== 6;
//       if (isWeekday) workingDaysCount++;

//       if (attendanceMap[dateStr]) {
//         const { status } = attendanceMap[dateStr];
//         attendanceSummary.push({
//           date: dateStr,
//           status,
//           loginTime: attendanceMap[dateStr].loginTime,
//           logoutTime: attendanceMap[dateStr].logoutTime,
//         });

//         if (status === "Present") presentCount++;
//         if (status === "Late") lateCount++;
//       } else {
//         attendanceSummary.push({
//           date: dateStr,
//           status: "Absent",
//           loginTime: null,
//           logoutTime: null,
//         });
//         absentCount++;
//       }
//     }

//     console.log("workingDaysCount",workingDaysCount)
//     console.log("present",presentCount)
//     console.log("late",lateCount)
//     console.log("absent",absentCount)

//     res.status(200).json({
//       success: true,
//       message: "Monthly attendance fetched successfully.",
//       data: {
//         attendanceSummary,
//         counts: {
//           totalWorkingDays: workingDaysCount,
//           present: presentCount,
//           late: lateCount,
//           absent: absentCount,
//         },
//       },
//     });

//   } catch (err) {
//     console.log("Error in getting my attendance data", err);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching attendance.",
//     });
//   }
// };

const getMyAttendanceData = async (req, res) => {
  try {
    const { empId } = req.params;

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startOfMonth = new Date(year, month, 1);
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999);

    const attendanceRecords = await attendance.find({
      empId,
      date: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    });

    const attendanceMap = {};
    attendanceRecords.forEach((record) => {
      const dateStr = new Date(record.date).toISOString().split("T")[0];
      attendanceMap[dateStr] = {
        status: record.status,
        loginTime: record.loginTime,
        logoutTime: record.logoutTime || null,
      };
    });

    let presentCount = 0;
    let lateCount = 0;
    let absentCount = 0;

    const attendanceSummary = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateStr = dateObj.toISOString().split("T")[0];

      if (attendanceMap[dateStr]) {
        const { status, loginTime, logoutTime } = attendanceMap[dateStr];
        attendanceSummary.push({
          date: dateStr,
          status,
        });

        if (status === "Present") presentCount++;
        if (status === "Late") lateCount++;
      } else {
        attendanceSummary.push({
          date: dateStr,
          status: "Absent",
        });
        absentCount++;
      }
    }

    console.log("workingDaysCount", daysInMonth);
    console.log("present", presentCount);
    console.log("late", lateCount);
    console.log("absent", absentCount);

    res.status(200).json({
      success: true,
      message: "Monthly attendance summary fetched successfully.",
      attendanceSummary,
      counts: {
        totalWorkingDays: daysInMonth,
        present: presentCount,
        late: lateCount,
        absent: absentCount,
      },
    });
  } catch (err) {
    console.log("Error in getting attendance data", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching attendance.",
    });
  }
};

module.exports = {
  getMyAttendanceData,
  isAttendanceMarked,
  getEmployeeData,
  makeaCallToParent,
  updatePaymentData,
  getThePhysicalCenterName,
  departmentPayNowOption,
  fetchAllStatusLogs,
  getPackageData,
  getDiscountVouchers,
  operationEmailVerification,
  operationPasswordVerification,
  enquiryFormData,
  getAllEnquiries,
  updateEnquiry,
  createAttendance,
  deleteEnquiry,
  updateProspectStatus,
  scheduleDemo,
  addNotes,
  getAllLeaves,
  deleteLeave,
  updateLeave,
  createLeave,
  referToFriend,
  updateEnquiryStatus,
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
  fetchAttendance,
  getMyTasks,
  getAllKidData,
  getAllParentData,
  getAllAttandanceData,
  getProspectsData,
  getProspectsStudentsData,
  scheduleDemoClass,
  getAllSheduleClass,
  updateProspectData,
  registerEmployee,
  fetchAllLogs,
  saveDemoClassData,
  getDemoClassAndStudentsData,
  getConductedDemoClass,
  updateEnrollmentStatus,
  getActivityLogsByTaskId,
  getTaskById,
  updateTaskStatus,
  getMyPendingTasks,
  assignTaskToOthers,
  addNotesToTasks,
  getMyLeaveData,
  getDropDownData,
  getMyIndividualLeave,
  updateEnquiryDetails,
  moveBackToEnquiry,
  getDemoClassAndStudentsDataGroup,
  specificKidAssignTask,
  getSheduledDemoClassDataOfKid,
  cancelDemoClassForKid,
  rescheduleDemoClass,
  savePaymentData,
};
