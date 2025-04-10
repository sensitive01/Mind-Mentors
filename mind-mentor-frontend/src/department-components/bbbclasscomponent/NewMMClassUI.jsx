import React, { useState } from "react";
import axios from "axios";

const NewMMClassUI = () => {
  const [className, setClassName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [links, setLinks] = useState({ coachLink: "", kidLink: "" });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [copyStatus, setCopyStatus] = useState({ coach: false, kid: false });
  const [notification, setNotification] = useState({
    show: false,
    message: "",
  });

  const handleCreateClass = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        "https://live.mindmentorz.in/api/class-new/create-class-new",
        {
          className,
          coachName,
        }
      );
      const { joinCoachUrl, joinKidUrl } = response.data;
      setLinks({ coachLink: joinCoachUrl, kidLink: joinKidUrl });
      setShowSuccess(true);
      showNotification("Class created successfully!");
    } catch (error) {
      console.error("Error creating class:", error);
      showNotification("Failed to create class. Please try again.", "error");
    }
    setLoading(false);
  };

  const handleCopy = (type, link) => {
    navigator.clipboard.writeText(link).then(() => {
      setCopyStatus({ ...copyStatus, [type]: true });
      showNotification(
        `${type === "coach" ? "Coach" : "Student"} link copied to clipboard!`
      );
      setTimeout(() => setCopyStatus({ ...copyStatus, [type]: false }), 2000);
    });
  };

  const showNotification = (message, type = "success") => {
    setNotification({
      show: true,
      message,
      type,
    });
    setTimeout(() => setNotification({ show: false, message: "" }), 3000);
  };

  const resetForm = () => {
    setClassName("");
    setCoachName("");
    setLinks({ coachLink: "", kidLink: "" });
    setShowSuccess(false);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 mt-10 relative">
      {notification.show && (
        <div
          className={`absolute top-0 left-0 right-0 -mt-12 p-3 rounded-t-lg text-white text-center transition-all ${
            notification.type === "error" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h2 className="text-2xl font-bold text-center text-blue-700 mb-6">
        Create a New Class
      </h2>

      {!showSuccess ? (
        <form onSubmit={handleCreateClass} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Class Name
            </label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
              placeholder="Enter coach name"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-blue-400 flex justify-center items-center shadow-md"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center mb-1">
              <svg
                className="h-5 w-5 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-green-700 font-medium">
                Class created successfully!
              </p>
            </div>
            <p className="text-sm text-green-600 ml-7">
              Share these links with coaches and students.
            </p>
          </div>

          <div className="space-y-5">
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg
                  className="h-4 w-4 text-blue-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                Coach Link:
              </p>
              <div className="flex items-center">
                <input
                  readOnly
                  value={links.coachLink}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm"
                />
                <button
                  onClick={() => handleCopy("coach", links.coachLink)}
                  className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none shadow-sm flex items-center justify-center"
                  aria-label="Copy coach link"
                  title="Copy coach link"
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

            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
              <p className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg
                  className="h-4 w-4 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path
                    fillRule="evenodd"
                    d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Student Link:
              </p>
              <div className="flex items-center">
                <input
                  readOnly
                  value={links.kidLink}
                  className="w-full bg-white border border-gray-300 rounded-lg py-2 px-3 text-sm shadow-sm"
                />
                <button
                  onClick={() => handleCopy("kid", links.kidLink)}
                  className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition focus:outline-none shadow-sm flex items-center justify-center"
                  aria-label="Copy student link"
                  title="Copy student link"
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
            className="w-full mt-4 bg-gray-100 text-gray-700 border border-gray-300 py-3 px-4 rounded-lg hover:bg-gray-200 transition duration-200 shadow-sm flex items-center justify-center"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Create Another Class
          </button>
        </div>
      )}
    </div>
  );
};

export default NewMMClassUI;
