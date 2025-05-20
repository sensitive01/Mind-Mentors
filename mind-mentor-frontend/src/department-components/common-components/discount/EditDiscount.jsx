import { useEffect, useState } from "react";
import { TextField, MenuItem } from "@mui/material";
import {
  getVoucherData,
  updateVoucherData,
} from "../../../api/service/employee/EmployeeService";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

const EditDiscount = () => {
  const { voucherId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    voucherId: "",
    code: "",
    mmKidId: "",
    remarks: "",
    type: "amount",
    value: "",
    condition: "new user",
    slots: "",
    startDate: "",
    expiry: "",
    status: "active",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getVoucherData(voucherId);
        console.log("Voucher resposne",response)

        if (response.status===200) {
          const startDate = response.data.startDate
            ? new Date(response.data.startDate).toISOString().split("T")[0]
            : "";
          const expiry = response.data.expiry
            ? new Date(response.data.expiry).toISOString().split("T")[0]
            : "";

          setFormData({
            voucherId: response.data.voucherId || "",
            code: response.data.code || "",
            mmKidId: Array.isArray(response.data.mmKidId)
              ? response.data.mmKidId.join(", ")
              : "",
            remarks: response.data.remarks || "",
            type: response.data.type || "amount",
            value: response.data.value || "",
            condition: response.data.condition || "new user",
            slots: response.data.slots || "",
            startDate: startDate,
            expiry: expiry,
            status: response.data.status || "active",
          });
        }
      } catch (error) {
        console.error("Error fetching voucher data:", error);
        toast.error("Failed to load voucher data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [voucherId]);

  const typeOptions = ["amount", "class"];
  const conditionOptions = ["new user", "existing user"];
  const statusOptions = ["active", "inactive", "expired"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        mmKidId: formData.mmKidId
          .split(",")
          .map((id) => id.trim())
          .filter((id) => id),
      };

      const response = await updateVoucherData(voucherId, submitData);

      if (response.status === 200) {
        toast.success("Voucher updated successfully");
        setTimeout(() => {
          navigate("/super-admin/department/discount-table");
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating voucher:", error);
      toast.error("Failed to update voucher");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading voucher data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-9xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white flex justify-between items-center">
          <div>Edit Voucher</div>
        </div>

        <form className="p-8" onSubmit={handleSubmit}>
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <TextField
                label="Voucher ID"
                name="voucherId"
                value={formData.voucherId}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="MM Kid ID"
                name="mmKidId"
                value={formData.mmKidId}
                onChange={handleChange}
                fullWidth
                helperText="Separate multiple IDs with commas"
              />

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
                label="Value"
                name="value"
                type="number"
                value={formData.value}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                select
                label="Condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                fullWidth
              >
                {conditionOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Slots"
                name="slots"
                type="number"
                value={formData.slots}
                onChange={handleChange}
                fullWidth
              />

              <TextField
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                label="Expiry Date"
                name="expiry"
                type="date"
                value={formData.expiry}
                onChange={handleChange}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                select
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                fullWidth
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                label="Remarks"
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                fullWidth
                multiline
                rows={2}
              />
            </div>
          </div>

          <div className="flex justify-center gap-6 mt-12">
            <button
              type="submit"
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              Update
            </button>
            <button
              type="button"
              onClick={() => navigate("/super-admin/department/discount-table")}
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditDiscount;
