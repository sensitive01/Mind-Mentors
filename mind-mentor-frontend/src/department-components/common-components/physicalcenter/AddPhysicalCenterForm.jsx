import  { useState, useCallback, useEffect } from "react";
import MultipleFileUpload from "../../../components/uploader/MultipleFileUpload";

const AddPhysicalCenterForm = ({  initialData = null }) => {
  const [formData, setFormData] = useState(
    initialData || {
      centerName: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      email: "",
      phoneNumber: "",
      photos: [],
    }
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingPincode, setIsLoadingPincode] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
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
  console.log('Received URLs:', urls);
  setFormData(prev => ({
    ...prev,
    photos: urls
  }));
};
  const validate = () => {
    const newErrors = {};
    if (!formData.centerName.trim())
      newErrors.centerName = "Center name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.pincode.trim()) newErrors.pincode = "Pincode is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required";


    if (formData.photos.length === 0) {
      newErrors.photos = "At least one photo is required";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    console.log(formData)

    try {
      // // In a real implementation, you'd handle file uploads to your server
      // // This is a simplified version
      // const submissionData = {
      //   ...formData
      // };

      // onSubmit(submissionData);

      // Reset form if it's not editing mode
      if (!initialData) {
        setFormData({
          centerName: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          email: "",
          phoneNumber: "",
          photos: [],
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-3">
        {initialData ? "Edit Chess Center" : "Add New Chess Center"}
      </h2>

      <form onSubmit={handleSubmit}>
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

        {/* Address */}
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



        <MultipleFileUpload
          fieldName="Physical Center Photos"
          name="photos"
          onFileUpload={handleFileUpload}

         
        />
        

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-center min-w-[120px]"
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
            {isSubmitting
              ? "Saving..."
              : initialData
              ? "Update Center"
              : "Add Center"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPhysicalCenterForm;
