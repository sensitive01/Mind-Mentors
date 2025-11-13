const mongoose = require("mongoose");

const relBtwKidParent = require("../../../model/kimsdatabase/relBtwParentKid");
const kimsParentDataBase = require("../../../model/kimsdatabase/basicParentDataKIMS");
const kimsKidsDataBase = require("../../../model/kimsdatabase/basicStudentsDb");
const kidProgramDataBase = require("../../../model/kimsdatabase/kidProgramRelation")
const programDataBase = require("../../../model/kimsdatabase/programDataKims")
const enrollmentCenterKidRelationLink = require("../../../model/kimsdatabase/relBtwAlottedKids")

const getKimsKidData = async (req, res) => {
  try {
    const kimsKidId = "123252000000046108";

    const kidData = await kimsKidsDataBase.findOne({
      ID: kimsKidId,
    });

    const kidParentRelationId = await relBtwKidParent.findOne({
      kidId: kidData._id,
    });

    const parentData = await kimsParentDataBase.findOne({
      _id: kidParentRelationId.parentId,
    });

    const kidprogramLink = await kidProgramDataBase.findOne({KidID:kimsKidId})
    console.log("kidprogramLink",kidprogramLink)
    const programDataKims = await programDataBase.findOne({ID:kidprogramLink.ProgramID},{ID:1,CHOICE:1})

    const enrollmentCenterKidRelation = await enrollmentCenterKidRelationLink.findOne({})

    const enrollmentData = {
      kidData,
      parentData,
      programDataKims
    };

    res.status(200).json(enrollmentData);
  } catch (err) {
    console.log("Error in getting the kids data", err);
    res.status(500).json({ message: "Error fetching data" });
  }
};

module.exports = {
  getKimsKidData,
};
