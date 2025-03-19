import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllPhysicalcenters } from "../../../api/service/employee/hrService";
import { saveNewPackage } from "../../../api/service/employee/EmployeeService";

const PackageForm = () => {
  const navigate = useNavigate();
  const [physicalCenters, setPhysicalCenters] = useState([]);
  const [formData, setFormData] = useState({
    type: "online",
    packageName: "",
    description: "",
    onlineClasses: 0,
    physicalClasses: 0,
    centerName: "",
    centerId: "",
    pricing: {
      amount: "",  // Changed from 0 to empty string to allow placeholder
      tax: "",     // Changed from 0 to empty string for tax percentage
      total: 0,
    },
  });

  useEffect(() => {
    const fetchPhysicalCenterName = async () => {
      try {
        const response = await getAllPhysicalcenters();
        console.log("response", response);
        if (response.status === 200) {
          setPhysicalCenters(response.data.physicalCenter);
        }
      } catch (err) {
        console.log(err);
        toast.error("Failed to fetch physical centers");
      }
    };
    fetchPhysicalCenterName();
  }, []);

  const typeOptions = ["online", "offline", "hybrid", "kit"];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "amount") {
      // When amount changes, recalculate total based on amount and tax percentage
      const amount = parseFloat(value) || 0;
      const taxPercentage = parseFloat(formData.pricing.tax) || 0;
      const taxAmount = (amount * taxPercentage) / 100;
      const total = amount + taxAmount;

      setFormData((prevData) => ({
        ...prevData,
        pricing: {
          ...prevData.pricing,
          amount: value, // Keep as string to allow empty field
          total: total,
        },
      }));
    } else if (name === "tax") {
      // When tax percentage changes, recalculate total
      const amount = parseFloat(formData.pricing.amount) || 0;
      const taxPercentage = parseFloat(value) || 0;
      const taxAmount = (amount * taxPercentage) / 100;
      const total = amount + taxAmount;

      setFormData((prevData) => ({
        ...prevData,
        pricing: {
          ...prevData.pricing,
          tax: value, // Keep as string to allow empty field
          total: total,
        },
      }));
    } else if (name.includes("pricing.")) {
      // For other pricing fields
      const pricingField = name.split(".")[1];
      setFormData((prevData) => ({
        ...prevData,
        pricing: {
          ...prevData.pricing,
          [pricingField]: value,
        },
      }));
    } else if (name === "centerSelection") {
      // Handle center selection
      const selectedCenter = physicalCenters.find(
        (center) => center._id === value
      );
      setFormData((prevData) => ({
        ...prevData,
        centerName: selectedCenter ? selectedCenter.centerName : "",
        centerId: value,
      }));
    } else if (name === "type") {
      // When type changes, reset center-related fields if needed
      const newValue = value;
      const needsPhysicalCenter = ["offline", "hybrid"].includes(newValue);

      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
        // Reset center values if changing to a type that doesn't need a center
        ...(!needsPhysicalCenter
          ? {
              centerName: "",
              centerId: "",
              physicalClasses: 0,
            }
          : {}),
      }));
    } else {
      // For regular fields
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Ensure we send numbers in the final submission
    const submissionData = {
      ...formData,
      pricing: {
        amount: parseFloat(formData.pricing.amount) || 0,
        tax: parseFloat(formData.pricing.tax) || 0,
        total: parseFloat(formData.pricing.total) || 0,
      }
    };
    
    console.log("Form Data:", submissionData);

    try {
      const response = await saveNewPackage(submissionData);
      console.log(response);
      
      if (response.status === 201) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/superadmin/department/package-table");
        }, 1500);
      }
    } catch (error) {
      toast.error("Failed to create package");
      console.error(error);
    }
  };

  // Check if physical center options should be displayed
  const shouldShowPhysicalOptions = ["offline", "hybrid"].includes(
    formData.type
  );

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-9xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>Package Form</div>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextField
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                fullWidth
              >
                {typeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Package Name"
                name="packageName"
                value={formData.packageName}
                onChange={handleChange}
                fullWidth
                multiline
              />

              <TextField
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />

              <TextField
                label="Online Classes"
                name="onlineClasses"
                type="number"
                value={formData.onlineClasses}
                onChange={handleChange}
                fullWidth
                InputProps={{ inputProps: { min: 0 } }}
              />

              {shouldShowPhysicalOptions && (
                <TextField
                  label="Physical Classes"
                  name="physicalClasses"
                  type="number"
                  value={formData.physicalClasses}
                  onChange={handleChange}
                  fullWidth
                  InputProps={{ inputProps: { min: 0 } }}
                />
              )}

              {shouldShowPhysicalOptions && (
                <TextField
                  select
                  label="Select Center"
                  name="centerSelection"
                  value={formData.centerId}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value="">Select a center</MenuItem>
                  {physicalCenters.map((center) => (
                    <MenuItem key={center._id} value={center._id}>
                      {center.centerName}
                    </MenuItem>
                  ))}
                </TextField>
              )}

              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={formData.pricing.amount}
                onChange={handleChange}
                fullWidth
                placeholder="Enter amount"
                InputProps={{ inputProps: { min: 0 } }}
              />

              <TextField
                label="Tax (%)"
                name="tax"
                type="number"
                value={formData.pricing.tax}
                onChange={handleChange}
                fullWidth
                placeholder="Enter tax percentage"
                InputProps={{ inputProps: { min: 0, max: 100 } }}
              />

              <TextField
                label="Total"
                name="pricing.total"
                type="number"
                value={formData.pricing.total}
                fullWidth
                InputProps={{
                  readOnly: true,
                  inputProps: { min: 0 },
                }}
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              Submit
            </button>
            <button
              type="button"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageForm;