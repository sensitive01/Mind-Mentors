const operationDeptModel = require("../../../model/operationDeptModel");

const operationEmailVerification = async (req, res) => {
  try {
    console.log("Welcome to operation employee verification", req.body);

    const operationEmail = "operationdept@gmail.com";
    const { email } = req.body;

    if (operationEmail === email) {
      console.log("Email exists");
      return res.status(200).json({
        success: true,
        message: "Email verification successful. Employee exists.",
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

const operationPasswordVerification = async (req, res) => {
  try {
    console.log("Welcome to verify operation dept password", req.body);

    const orgPassword = "operationdept@123";
    const { email, password } = req.body;

    if (password == orgPassword) {
      return res.status(200).json({
        success: true,
        message: "Password verification successful.",
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
      email
    });
  }
};

const enquiryFormData = async(req,res)=>{
    try{
        console.log("Welcome to save the enquiry form data",req.body)

    }catch(err){
        console.log("Error in saving the wnquiry form data",err)
    }
}




module.exports = {
  operationEmailVerification,
  operationPasswordVerification,
  enquiryFormData
};
