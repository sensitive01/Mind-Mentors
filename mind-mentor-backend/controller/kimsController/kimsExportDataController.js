
const mongoose = require("mongoose");
const xlsx = require("xlsx");
const path = require("path");
const fs = require("fs");

const Parent = require("../../model/parentModel");
const Kid = require("../../model/kidModel");
const OperationDept = require("../../model/operationDeptModel");
const dbConnect = require("../../config/database/dbConnect");

// Function to normalize phone numbers
function normalizePhoneNumber(phone) {
  if (!phone) return null;

  // Convert to string and handle scientific notation
  let phoneStr = String(phone).trim();

  // If it's in scientific notation (e.g., 9.19E+11), convert it to full number
  if (phoneStr.includes('E+')) {
    phoneStr = Number(phone).toFixed(0);
  }

  // Remove all non-digit characters
  const digits = phoneStr.replace(/\D/g, '');

  // If number is empty after cleaning, return null
  if (!digits) {
    console.warn(`Invalid phone number format: ${phone}`);
    return null;
  }

  // If number is too short, return null
  if (digits.length < 10) {
    console.warn(`Phone number too short: ${digits} (original: ${phone})`);
    return null;
  }

  // Take only the last 10 digits if the number is longer
  const cleanNumber = digits.slice(-10);

  // For Indian numbers, ensure it starts with 91

  console.log(`91${cleanNumber}`);
  return `91${cleanNumber}`;
}

function parseBooleanCell(value) {
  if (value === undefined || value === null) return null;
  const s = String(value).trim();
  if (s === "") return null;

  const trueSet = new Set([
    "true",
    "yes",
    "y",
    "1",
    "active",
    "attended",
    "scheduled",
  ]);
  const falseSet = new Set(["false", "no", "n", "0", "inactive"]);

  const lower = s.toLowerCase();
  if (trueSet.has(lower)) return true;
  if (falseSet.has(lower)) return false;

  if (typeof value === "boolean") return value;

  return null;
}

function parseDateCell(value) {
  if (value === undefined || value === null || value === "") return null;

  if (value instanceof Date && !isNaN(value)) return value;

  if (typeof value === "number") {
    const excelEpoch = new Date(Date.UTC(1899, 11, 30));
    const days = Math.floor(value);
    const ms = days * 24 * 60 * 60 * 1000;
    const date = new Date(excelEpoch.getTime() + ms);
    if (!isNaN(date)) return date;
  }

  const parsed = Date.parse(String(value));
  if (!isNaN(parsed)) return new Date(parsed);

  return null;
}

function readExcelFile(filePath) {
  const workbook = xlsx.readFile(filePath, { cellDates: true });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(worksheet, { defval: null, raw: false });
  return rows;
}

async function importExcel(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    process.exit(1);
  }

  // connect DB
  dbConnect();

  const rows = readExcelFile(filePath);
  console.log(`Rows to process: ${rows.length}`);

  let summary = {
    processed: 0,
    parentsCreated: 0,
    parentsLinked: 0,
    kidsCreated: 0,
    opsCreated: 0,
    errors: 0,
    errorRows: [],
  };

  for (const [index, rawRow] of rows.entries()) {
    const rowNum = index + 2;

    try {
      const parentFirstName = rawRow["parentFirstName"] || rawRow["parentFirstName "] || null;

      // Get and normalize whatsapp number
      const whatsappNumber = normalizePhoneNumber(
        rawRow["whatsappNumber"] ||
        rawRow["WhatsApp Number"] ||
        rawRow["whatsapp number"] ||
        rawRow["whatsapp"] ||
        rawRow["contactNumber"] ||
        rawRow["parentMobile"] ||
        null
      );

      // Log if we couldn't find a valid phone number
      if (!whatsappNumber) {
        console.warn(`No valid phone number found for row ${rowNum}`, {
          rawValue: rawRow["whatsappNumber"] || rawRow["WhatsApp Number"] || rawRow["whatsapp number"] || rawRow["whatsapp"] || rawRow["contactNumber"] || rawRow["parentMobile"],
          row: rowNum
        });
        continue; // Skip this row if no valid phone number
      }
      const email = rawRow["email"] || rawRow["parentEmail"] || null;
      const source = rawRow["source"] || rawRow["Lead Source"] || "MindMentorz Online";
      const notes = rawRow["Notes"] || rawRow["Parent Notes"] || null;

      const kidFirstName = rawRow["kidFirstName"] || rawRow["Kid Name"] || null;
      const kidRollNo =
        rawRow["kidRollNo"] || rawRow["kidRollNo "] || rawRow["Kid ID"] || null;
      const kidsGender = rawRow["kidsGender"] || rawRow["Gender"] || null;
      const kidsAge = rawRow["kidsAge"] || rawRow["Age"] || null;
      const city = rawRow["city"] || rawRow["City"] || null;

      const program = rawRow["program"] || rawRow["Program"] || null;
      const level = rawRow["level"] || rawRow["Level"] || null;
      const isProfileActiveCell =
        rawRow["isProfileActive"] ?? rawRow["isProfileActive "] ?? rawRow["isActive"] ?? null;
      const isProfileActive = parseBooleanCell(isProfileActiveCell);

      const scheduleDemoDay =
        rawRow["scheduleDemo.sheduledDay"] ||
        rawRow["Demo Class Date"] ||
        rawRow["scheduleDemo.sheduledDay "] ||
        null;
      const dateOfJoiningCell = rawRow["dateOfJoining"] || rawRow["Date of Joining"] || null;
      const dateOfJoining = parseDateCell(dateOfJoiningCell);

      const centerName =
        rawRow["ProgramSchema.centerName"] ||
        rawRow["ProgramSchema.centerName "] ||
        rawRow["centerName"] ||
        null;
      const centerType =
        rawRow["ProgramSchema.centerType"] ||
        rawRow["ProgramSchema.centerType "] ||
        rawRow["centerType"] ||
        null;

      const totalClassBoth =
        rawRow["totalClassCount.both"] ?? rawRow["totalClassCount.both "] ?? null;
      const remainingClassBoth =
        rawRow["remainingClass.both"] ?? rawRow["remainingClass.both "] ?? null;

      const schoolName = rawRow["schoolName"] || rawRow["School"] || null;
      const intentionOfParentsRaw =
        rawRow["intentionOfParents"] || rawRow["Intention of Parents"] || null;
      const intentionOfParents = intentionOfParentsRaw
        ? String(intentionOfParentsRaw).trim().toLowerCase()
        : undefined;

      const stageTagRaw = rawRow["stageTag"] || rawRow["Stage Tag"] || null;
      const stageTag = stageTagRaw ? String(stageTagRaw).trim() : null;

      const chessId = rawRow["chessId"] || rawRow["ChessKid ID"] || rawRow["kidId"] || null;
      const enquiryTypeRaw = rawRow["enquiryType"] || rawRow["Enquiry Type"] || null;
      const enquiryType = enquiryTypeRaw ? String(enquiryTypeRaw).trim().toLowerCase() : undefined;

      const enquiryFieldRaw = rawRow["enquiryField"] || rawRow["Enquiry Field"] || null;

      const oldLogs = rawRow["oldLogs"] || rawRow["logs"] || rawRow["Logs"] || null;

      const programsEnrolledDate = parseDateCell(
        rawRow["programs.enrolledDate"] ||
        rawRow["programs.enrolledDate "] ||
        rawRow["programs.enrolledDate"] ||
        null
      );

      const totalRenewalCount =
        rawRow["totalRenewalCount"] ??
        rawRow["totalRenewalCount "] ??
        (rawRow["totalRenewalCount"] ? Number(rawRow["totalRenewalCount"]) : 0);

      const isProfilePaused = parseBooleanCell(rawRow["isProfilePaused"]);
      const isChessKidGoldTaken = parseBooleanCell(rawRow["isChessKidGoldTaken"]);
      const chessKidGoldEnabledDate = parseDateCell(rawRow["chessKidGoldEnabledDateAndTime"]);
      const chessKidGoldExpirationDate = parseDateCell(rawRow["chessKidGoldExperationDateAndTime"]);
      const chessKidGoldDeactivationDate = parseDateCell(rawRow["chessKidGoldDeactivationDateAndTime"]);
      const reasonForDeactivation = rawRow["reasonForDeactivation"] || null;
      const lastInteractionTime = parseDateCell(
        rawRow["Last Interaction Time"] || rawRow["lastInteractionTime"] || rawRow["Last Interaction Time "]
      );


      let enquiryFieldValue = enquiryFieldRaw ? String(enquiryFieldRaw).trim() : null;
      if (enquiryFieldValue && enquiryFieldValue.toLowerCase() === "enquiry") {
        enquiryFieldValue = "enquiryList";
      } else {
        enquiryFieldValue = "prospects";
      }


      let computedEnquiryStatus = rawRow["enquiryStatus"] || null;
      if (enquiryFieldValue === "prospects") {
        computedEnquiryStatus = dateOfJoining ? "Active" : "Pending";
      } else {

        computedEnquiryStatus = computedEnquiryStatus || "Pending";
      }

      // ---------- StageTag normalization ----------
      let stageTagValue = null;
      if (stageTag) {
        const s = stageTag.toLowerCase();
        if (s.includes("warm")) stageTagValue = "warm";
        else if (s.includes("cold")) stageTagValue = "cold";
        else if (s.includes("hot")) stageTagValue = "hot";
        else stageTagValue = s; // fallback lowercase text
      }

      // --- Parent lookup by flexible phone number matching ---
      let parentDoc = null;
      if (whatsappNumber) {
        // Try to find parent by exact match or last 10 digits (in case of country code differences)
        parentDoc = await Parent.findOne({
          $or: [
            { parentMobile: whatsappNumber },
            { parentMobile: { $regex: whatsappNumber.slice(-10) + '$' } }
          ]
        }).exec();

        if (!parentDoc) {
          // If no parent found, create a new one
          parentDoc = new Parent({
            parentName: parentFirstName,
            parentMobile: whatsappNumber,
            parentEmail: email,
            source: source,
            notes: notes,
            createdAt: new Date(),
            updatedAt: new Date()
          });
          await parentDoc.save();
          summary.parentsCreated++;
        } else {
          // Update existing parent if needed
          const updates = {};
          if (email && !parentDoc.parentEmail) updates.parentEmail = email;
          if (parentFirstName && !parentDoc.parentName) updates.parentName = parentFirstName;

          if (Object.keys(updates).length > 0) {
            updates.updatedAt = new Date();
            await Parent.updateOne({ _id: parentDoc._id }, { $set: updates });
          }

          summary.parentsLinked++;
        }
      }

      // --- Create Kid ---
      const kidPayload = {
        kidsName: kidFirstName || undefined,
        kidPin: kidRollNo || undefined,
        age: kidsAge ? Number(kidsAge) : undefined,
        gender: kidsGender || undefined,
        parentId: parentDoc ? parentDoc._id : undefined,
        chessId: chessId || undefined,
        joinDateTime: programsEnrolledDate || dateOfJoining || undefined,
        isProfileActive: isProfileActive === null ? undefined : Boolean(isProfileActive),
        isProfilePaused: isProfilePaused === null ? undefined : Boolean(isProfilePaused),
        isChessKidGoldActivated: isChessKidGoldTaken === null ? undefined : Boolean(isChessKidGoldTaken),
        chessKidGoldActivatedDateTime: chessKidGoldEnabledDate || undefined,
        chessKidGoldExpiryDateTime: chessKidGoldExpirationDate || undefined,
        deactivatedDateTime: chessKidGoldDeactivationDate || undefined,
        lastInteractedDateTime: lastInteractionTime || undefined,
        paymentCount: totalRenewalCount ? Number(totalRenewalCount) : 0,
        enrollmentCenter: centerName || undefined,
        enrollmentType: centerType || undefined,
      };

      const kidDoc = new Kid(kidPayload);
      await kidDoc.save();
      summary.kidsCreated += 1;

      if (program) {
        const selectedProg = {
          program: program,
          level: level || undefined,
          chessKidId: chessId || undefined,
          pgmStatus: "Pending",
        };
        kidDoc.selectedProgram = kidDoc.selectedProgram || [];
        kidDoc.selectedProgram.push(selectedProg);
        await kidDoc.save();
      }

      // --- Build OperationDept payload ---
      const opPayload = {
        parentFirstName: parentFirstName || (parentDoc.parentName || undefined),
        parentLastName: null,
        contactNumber: whatsappNumber || undefined,
        whatsappNumber: whatsappNumber || undefined,
        isSameAsContact: true,
        email: email || undefined,
        relationship: null,
        source: source || undefined,
        message: null,
        notes: notes || undefined,
        kidFirstName: kidFirstName || undefined,
        kidLastName: null,
        kidId: kidDoc._id ? String(kidDoc._id) : (kidRollNo || undefined),
        kidRollNo: kidRollNo || undefined,
        kidsGender: kidsGender || undefined,
        kidsAge: kidsAge ? Number(kidsAge) : undefined,
        city: city || undefined,
        state: rawRow["state"] || undefined,
        pincode: rawRow["pincode"] || undefined,
        programs: [],

        totalClassCount: {
          online: rawRow["totalClassCount.online"] ? Number(rawRow["totalClassCount.online"]) : 0,
          offline: rawRow["totalClassCount.offline"] ? Number(rawRow["totalClassCount.offline"]) : 0,
          both: totalClassBoth ? Number(totalClassBoth) : 0,
        },
        attendedClass: { online: 0, offline: 0, both: 0 },
        remainingClass: {
          online: rawRow["remainingClass.online"] ? Number(rawRow["remainingClass.online"]) : 0,
          offline: rawRow["remainingClass.offline"] ? Number(rawRow["remainingClass.offline"]) : 0,
          both: remainingClassBoth ? Number(remainingClassBoth) : 0,
        },
        absentClass: { online: 0, offline: 0, both: 0 },
        pausedClass: { online: 0, offline: 0, both: 0 },
        canceledClass: { online: 0, offline: 0, both: 0 },

        schoolName: schoolName || undefined,
        address: rawRow["address"] || undefined,
        schoolPincode: rawRow["schoolPincode"] || undefined,
        intentionOfParents: intentionOfParents || undefined,
        enquiryType: enquiryType || undefined,
        enquiryStage: rawRow["enquiryStage"] || undefined,
        recomentedLevel: rawRow["recomentedLevel"] || rawRow["recommendedLevel"] || undefined,
        chessKidName: kidFirstName || undefined,
        stageTag: stageTagValue || undefined,
        // enquiryStatus will be computed per rule below
        disposition: rawRow["disposition"] || undefined,
        // enquiryField computed earlier
        scheduleDemo: {
          status: rawRow["scheduleDemo.status"] || "Pending",
          sheduledDay: scheduleDemoDay || undefined,
        },
        dateOfJoining: dateOfJoining || undefined,
        referral: [],
        oldLogs: oldLogs || undefined,
        paymentData: [],

        paymentStatus: rawRow["paymentStatus"] || undefined,
        paymentRenewal: rawRow["paymentRenewal"] || undefined,
        employeeAssisted: rawRow["employeeAssisted"] || undefined,
        perHourRate: rawRow["perHourRate"] ? Number(rawRow["perHourRate"]) : undefined,
        employmentType: rawRow["employmentType"] || undefined,

        chessKidGoldEnabledDateAndTime: chessKidGoldEnabledDate ? chessKidGoldEnabledDate.toISOString() : undefined,
        chessKidGoldExperationDateAndTime: chessKidGoldExpirationDate ? chessKidGoldExpirationDate.toISOString() : undefined,
        chessKidGoldDeactivationDateAndTime: chessKidGoldDeactivationDate ? chessKidGoldDeactivationDate.toISOString() : undefined,
        reasonForDeactivation: reasonForDeactivation || undefined,
        lastInteractionDateandTime: lastInteractionTime ? lastInteractionTime.toISOString() : undefined,

        classAssigned: !!parseBooleanCell(rawRow["classAssigned"]),
        isNewUser: parseBooleanCell(rawRow["isNewUser"]) ?? true,
        isParentNameCompleted: parseBooleanCell(rawRow["isParentNameCompleted"]),
        isLevelPromoteRecomented: parseBooleanCell(rawRow["isLevelPromoteRecomented"]),
        ischessKidIdAssigned: parseBooleanCell(rawRow["ischessKidIdAssigned"]),
        isFirstKidAdded: parseBooleanCell(rawRow["isFirstKidAdded"]),
        isProgramSelected: parseBooleanCell(rawRow["isProgramSelected"]),
        isDemoSheduled: parseBooleanCell(rawRow["isDemoSheduled"]),
        isDemoAttended: parseBooleanCell(rawRow["isDemoAttended"]),
        isPackageSelected: parseBooleanCell(rawRow["isPackageSelected"]),
        isClassAssigned: parseBooleanCell(rawRow["isClassAssigned"]),
        isEnrollmementStepCompleted: parseBooleanCell(rawRow["isEnrollmementStepCompleted"]),
        isProfileActive: isProfileActive === null ? undefined : Boolean(isProfileActive),
        isEnquiryNew: parseBooleanCell(rawRow["isEnquiryNew"]),
        isProfilePaused: isProfilePaused === null ? undefined : Boolean(isProfilePaused),
        isChessKidGoldTaken: isChessKidGoldTaken === null ? undefined : Boolean(isChessKidGoldTaken),

        totalRenewalCount: totalRenewalCount ? Number(totalRenewalCount) : 0,
      };

      // add program object inside operation dept programs array
      if (program) {
        opPayload.programs.push({
          program: program,
          level: level || undefined,
          status: rawRow["ProgramSchema.status"] || undefined,
          demoAttended: parseBooleanCell(rawRow["ProgramSchema.demoAttended"]),
          enrolledDate: programsEnrolledDate || undefined,
          centerName: centerName || undefined,
          centerType: centerType || undefined,
        });
      }

      // set computed enquiryField & enquiryStatus
      opPayload.enquiryField = enquiryFieldValue;
      opPayload.enquiryStatus = computedEnquiryStatus;

      // Also store references to parent and kid
      opPayload.parentId = parentDoc ? parentDoc._id : undefined;
      opPayload.kidRef = kidDoc._id;

      const opDoc = new OperationDept(opPayload);
      await opDoc.save();
      summary.opsCreated += 1;

      kidDoc.enqId = opDoc._id;
      await kidDoc.save();

      summary.processed += 1;
      console.log(`Row ${rowNum} processed successfully (kid: ${kidDoc._id}, parent: ${parentDoc._id})`);
      if (summary.processed % 100 === 0) {
        console.log(`
        Progress Update:
        - Processed: ${summary.processed}/${rows.length} (${Math.round((summary.processed / rows.length) * 100)}%)
        - Parents Created: ${summary.parentsCreated}
        - Parents Linked: ${summary.parentsLinked}
        - Kids Created: ${summary.kidsCreated}
        - Errors: ${summary.errors}
        `);
      }
    } catch (err) {
      summary.errors += 1;
      summary.errorRows.push({ row: index + 1, error: err.message });
      console.error(`Error processing row ${rowNum}:`, err);
    }
  } // end loop

  console.log("Import finished. Summary:", summary);
  await mongoose.disconnect();
  process.exit(0);
}

// CLI invocation
if (require.main === module) {
  // Hard-coded file path
  const filePath = "E:\\SensitiveTechnologies\\MindMenetorsFinal\\kimsdata\\kimsNewData.xlsx";

  console.log("Importing from file:", filePath);

  importExcel(filePath).catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
}

//     console.log("Import finished. Summary:", summary);
//     await mongoose.disconnect();
//     process.exit(0);
// }

// // CLI invocation
// // CLI invocation
// if (require.main === module) {
//     // ✅ Hard-coded file path here
//     const filePath = "E:\\SensitiveTechnologies\\MindMenetorsFinal\\kimsdata\\kimsNewData.xlsx";

//     console.log("Importing from file:", filePath);

//     importExcel(filePath).catch((err) => {
//         console.error("Fatal error:", err);
//         process.exit(1);
//     });
// }




