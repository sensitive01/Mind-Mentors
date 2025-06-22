import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { parentAddNewKid } from "../../api/service/parent/ParentService";
import { useNavigate } from "react-router-dom";

const EnrolmentKid = () => {
  const navigate = useNavigate();
  const parentId = localStorage.getItem("parentId");
  const [formData, setFormData] = useState({
    kidsName: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form data:", formData);
      const response = await parentAddNewKid(formData, parentId);
      console.log("response", response);

      if (response.status === 201) {
        console.log("Success:", response.data.message);

        setTimeout(() => {
          navigate("/parent/kid");
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleBack = () => {
    console.log("Navigate back");
    navigate(-1)
  };

  return (
    <div className="flex flex-col flex-grow justify-center items-center">
      <div className="flex items-center space-x-2">
        <ArrowLeft
          className="text-xl text-primary cursor-pointer"
          onClick={handleBack}
        />
        <h2 className="text-2xl font-bold text-primary">Add new champions</h2>
      </div>

      <div className="w-full p-4">
        <div className="bg-white rounded-lg border border-primary shadow-sm p-4 transition-all duration-300 hover:shadow-md">
          <div className="bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kids Name
                </label>
                <input
                  type="text"
                  name="kidsName"
                  value={formData.kidsName}
                  onChange={handleChange}
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="Kids Name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Enter age"
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  min={1}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-300"
            >
              Submit →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnrolmentKid;
