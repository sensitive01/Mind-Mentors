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

module.exports = {
  validateKidChessId,
  validateKidPin,
  getDemoClass,
};
