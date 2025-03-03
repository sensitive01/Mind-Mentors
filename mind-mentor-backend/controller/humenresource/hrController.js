const employeeModel = require("../../model/employeeModel");
const PhysicalCenter = require("../../model/physicalcenter/physicalCenterShema");

const createNewEmployee = async (req, res) => {
    try {
        console.log("Welcome to create new employee", req.body);

        const { firstName, email, phoneNumber, address, gender, department, role,centerName,centerId } = req.body.formData;

        const existingEmployee = await employeeModel.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ message: "Employee with this email already exists." });
        }

        const newEmployee = new employeeModel({
            firstName,
            email,
            phoneNumber,
            address,
            gender,
            department,
            role: role || "employee",
            password: "12345678",
            centerName,
            centerId 
        });

        await newEmployee.save();

        res.status(201).json({ message: "Employee created successfully", employee: newEmployee });
    } catch (err) {
        console.error("Error in creating new employee", err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const getAllPhysicalCenters = async (req, res) => {
    try {
        console.log("Welcome to get the physical centers");

        const physicalCenter = await PhysicalCenter.find({}, { centerName: 1 });

        console.log("physicalCenter", physicalCenter);

        res.status(200).json({ success: true, physicalCenter });
    } catch (err) {
        console.error("Error in fetching the physical centers", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};





module.exports = {
    createNewEmployee,
    getAllPhysicalCenters
}