import React, { useState } from "react";
import axios from "axios";

const AdminCreateClass = () => {
  const [className, setClassName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [links, setLinks] = useState({ coachLink: "", kidLink: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState({ coach: false, kid: false });

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "http://3.104.84.126:3000/api/class/create-class",
        {
          className,
          coachName,
        }
      );
      const { joinCoachUrl, joinKidUrl } = response.data;
      setLinks({ coachLink: joinCoachUrl, kidLink: joinKidUrl });
      setShowSuccess(true);
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    }
    setLoading(false);
  };

  const handleCopy = (type, link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopyStatus({ ...copyStatus, [type]: true });
      setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
    });
  };

  const resetForm = () => {
    setClassName("");
    setCoachName("");
    setLinks({ coachLink: "", kidLink: "" });
    setShowSuccess(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Create a New Class
      </h2>

      {!showSuccess ? (
        <form onSubmit={handleCreateClass} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter class name"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Coach Name
            </label>
            <input
              type="text"
              value={coachName}
              onChange={(e) => setCoachName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter coach name"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 flex justify-center items-center"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              "Create Class"
            )}
          </button>
        </form>
      ) : (
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-md border border-green-200">
            <p className="text-green-700 font-medium mb-1">
              Class created successfully!
            </p>
            <p className="text-sm text-green-600">
              Share these links with coaches and students.
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Coach Link:
              </p>
              <div className="flex items-center">
                <input
                  readOnly
                  value={links.coachLink}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                />
                <button
                  onClick={() => handleCopy("coach", links.coachLink)}
                  className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none"
                >
                  {copyStatus.coach ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Student Link:
              </p>
              <div className="flex items-center">
                <input
                  readOnly
                  value={links.kidLink}
                  className="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm"
                />
                <button
                  onClick={() => handleCopy("kid", links.kidLink)}
                  className="ml-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition focus:outline-none"
                >
                  {copyStatus.kid ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="w-full mt-4 bg-gray-100 text-gray-700 border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-200 transition duration-200"
          >
            Create Another Class
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCreateClass;
