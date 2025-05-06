import { useState, useCallback, useEffect } from "react";
import MultipleFileUpload from "../../../components/uploader/MultipleFileUpload";
import {
  getIndividualPhysicalCenterData,
  updatePhysicalCenterData,
} from "../../../api/service/employee/EmployeeService";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import BusinessHoursSelector from "./BusinessHoursSelector";
import ProgramLevelSelector from "./ProgramLevelSelector";
import { ArrowLeft } from "lucide-react";

const EditPhysicalCenters = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    centerType: "offline", // Default to offline
    centerName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    email: "",
    phoneNumber: "",
    programLevels: [], // Added program levels array
    businessHours: [], // Added business hours array
    photos: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getIndividualPhysicalCenterData(id);
        console.log(response);
        if (response.status === 200) {
          const centerData = response.data.data;
          setFormData({
            centerType: centerData.centerType || "offline",
            centerName: centerData.centerName || "",
            address: centerData.address || "",
            city: centerData.city || "",
            state: centerData.state || "",
            pincode: centerData.pincode || "",
            email: centerData.email || "",
            phoneNumber: centerData.phoneNumber || "",
            programLevels: centerData.programLevels || [],
            businessHours: centerData.businessHours || [],
            photos: centerData.photos || [],
          });
        }
      } catch (error) {
        console.error("Error fetching center data:", error);
        toast.error("Failed to load center data");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Handle program levels change
  const handleProgramLevelsChange = (updatedProgramLevels) => {
    setFormData((prev) => ({
      ...prev,
      programLevels: updatedProgramLevels,
    }));

    if (errors.programLevels) {
      setErrors((prev) => ({ ...prev, programLevels: null }));
    }
  };

  // Handle business hours change
  const handleBusinessHoursChange = (updatedHours) => {
    setFormData((prev) => ({
      ...prev,
      businessHours: updatedHours,
    }));

    if (errors.businessHours) {
      setErrors((prev) => ({ ...prev, businessHours: null }));
    }
  };

  const fetchLocationByPincode = useCallback(async (pincode) => {
    if (pincode.length !== 6) return;

    setIsLoadingPincode(true);
    try {
      const response = await fetch(
        `https://api.postalpincode.in/pincode/${pincode}`
      );
      const data = await response.json();

      if (
        data &&
        data[0]?.Status === "Success" &&
        data[0]?.PostOffice?.length > 0
      ) {
        const postOffice = data[0].PostOffice[0];
        setFormData((prev) => ({
          ...prev,
          city: postOffice.District || "",
          state: postOffice.State || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching pincode data:", error);
    } finally {
      setIsLoadingPincode(false);
    }
  }, []);

  useEffect(() => {
    const pincode = formData.pincode;
    if (pincode && pincode.length === 6) {
      fetchLocationByPincode(pincode);
    }
  }, [formData.pincode, fetchLocationByPincode]);

  const handleFileUpload = (urls) => {
    setFormData((prev) => ({
      ...prev,
      photos: urls,
    }));
  };

  // Update this validate function in your EditPhysicalCenters component
  const validate = () => {
    const newErrors = {};

    if (!formData.centerType) newErrors.centerType = "Center type is required";
    if (!formData.centerName.trim())
      newErrors.centerName = "Center name is required";

    // Only validate address, city, state, pincode for offline centers
    if (formData.centerType === "offline") {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    }

    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";

    // Validate all program-level pairs
    if (!formData.programLevels || formData.programLevels.length === 0) {
      newErrors.programLevels =
        "At least one program and level must be selected";
    } else {
      // Check if any program doesn't have a program ID or has empty levels array
      const invalidProgramLevels = formData.programLevels.some(
        (item) => !item.program || !item.levels || item.levels.length === 0
      );

      if (invalidProgramLevels) {
        newErrors.programLevels = "All programs and levels must be selected";
      }
    }

    if (!formData.businessHours || formData.businessHours.length === 0) {
      newErrors.businessHours = "Business hours must be set";
    }

    if (formData.photos.length === 0) {
      newErrors.photos = "At least one photo is required";
    }

    return newErrors;
  };

  // Updated handleSubmit function with better error handling and console logs
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      console.log("Form validation failed:", newErrors);
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      // Update existing center
      const response = await updatePhysicalCenterData(id, formData);
      console.log("API Response:", response);

      if (response.status === 200) {
        toast.success("Center updated successfully");
        setTimeout(() => {
          navigate("/super-admin/department/physical-centerlist");
        }, 1500);
      } else {
        // Handle unsuccessful response
        toast.error(response.message || "Update failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        error.response?.data?.message || "An error occurred during submission"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-7">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Edit Chess Center</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Center Type - Radio Button */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Center Type*
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="centerType"
                value="offline"
                checked={formData.centerType === "offline"}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-primary"
              />
              <span className="ml-2 text-gray-700">Offline</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="centerType"
                value="online"
                checked={formData.centerType === "online"}
                onChange={handleChange}
                className="form-radio h-5 w-5 text-primary"
              />
              <span className="ml-2 text-gray-700">Online</span>
            </label>
          </div>
          {errors.centerType && (
            <p className="text-red-500 text-sm mt-1">{errors.centerType}</p>
          )}
        </div>

        {/* Center Name */}
        <div className="mb-6">
          <label
            className="block text-gray-700 font-medium mb-2"
            htmlFor="centerName"
          >
            Center Name*
          </label>
          <input
            type="text"
            id="centerName"
            name="centerName"
            value={formData.centerName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              errors.centerName
                ? "border-red-500 focus:ring-red-300"
                : "border-gray-300 focus:ring-primary"
            }`}
            placeholder="MindMentorz"
          />
          {errors.centerName && (
            <p className="text-red-500 text-sm mt-1">{errors.centerName}</p>
          )}
        </div>

        {/* Address - Only show for offline centers */}
        {formData.centerType === "offline" && (
          <>
            <div className="mb-6">
              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="address"
              >
                Address*
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 transition-colors ${
                  errors.address
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-primary"
                }`}
                placeholder="Enter complete address"
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address}</p>
              )}
            </div>

            {/* Pincode, City, State in same line */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Pincode with auto-fetch */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="pincode"
                >
                  Pincode*
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength={6}
                    className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                      errors.pincode
                        ? "border-red-500 focus:ring-red-300"
                        : "border-gray-300 focus:ring-primary"
                    } ${isLoadingPincode ? "pr-10" : ""}`}
                    placeholder="560034"
                  />
                  {isLoadingPincode && (
                    <div className="absolute right-3 top-3">
                      <svg
                        className="animate-spin h-5 w-5 text-gray-500"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    </div>
                  )}
                </div>
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>
                )}
              </div>

              {/* City - Auto-populated */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="city"
                >
                  City*
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.city
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  placeholder="City"
                  readOnly={isLoadingPincode}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                )}
              </div>

              {/* State - Auto-populated */}
              <div>
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="state"
                >
                  State*
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                    errors.state
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-primary"
                  }`}
                  placeholder="State"
                  readOnly={isLoadingPincode}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1">{errors.state}</p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Email and Phone in same line */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Email */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="email"
            >
              Email*
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.email
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-primary"
              }`}
              placeholder="center@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="phoneNumber"
            >
              Phone Number*
            </label>
            <input
              type="text"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                errors.phoneNumber
                  ? "border-red-500 focus:ring-red-300"
                  : "border-gray-300 focus:ring-primary"
              }`}
              placeholder="+91 98943 86276"
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>
        </div>

        {/* Program Levels Component */}
        <ProgramLevelSelector
          onChange={handleProgramLevelsChange}
          initialData={formData.programLevels}
        />

        {errors.programLevels && (
          <p className="text-red-500 text-sm mt-1 mb-4">
            {errors.programLevels}
          </p>
        )}

        {/* Business Hours Component */}
        <BusinessHoursSelector
          onChange={handleBusinessHoursChange}
          initialData={formData.businessHours}
        />

        {errors.businessHours && (
          <p className="text-red-500 text-sm mt-1 mb-4">
            {errors.businessHours}
          </p>
        )}

        {/* Photos Upload */}
        <div className="mb-6">
          <MultipleFileUpload
            fieldName="Physical Center Photos"
            name="photos"
            onFileUpload={handleFileUpload}
            initialFiles={formData.photos}
          />
          {errors.photos && (
            <p className="text-red-500 text-sm mt-1">{errors.photos}</p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/super-admin/department/physical-centerlist")
            }
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center min-w-[120px]"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {isSubmitting ? "Saving..." : "Update Center"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default EditPhysicalCenters;
