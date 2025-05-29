import React from "react";

const PauseModel = ({
  pauseDate,
  setPauseDate,
  pauseEndDate,
  setPauseEndDate,
  pauseRemarks,
  setPauseRemarks,
  setShowPauseModal,
  handlePauseConfirm,
}) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Validation: end date should be after start date
  const isEndDateValid =
    !pauseEndDate ||
    !pauseDate ||
    new Date(pauseEndDate) >= new Date(pauseDate);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-16">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Pause Classes</h2>

        <div className="mb-4">
          
          {/* From Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={pauseDate}
              onChange={(e) => setPauseDate(e.target.value)}
              min={today}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* To Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date <span className="text-gray-400">(Optional)</span>
            </label>
            <input
              type="date"
              value={pauseEndDate || ""}
              onChange={(e) => setPauseEndDate(e.target.value)}
              min={pauseDate || today}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                isEndDateValid
                  ? "border-gray-300 focus:ring-blue-500"
                  : "border-red-300 focus:ring-red-500"
              }`}
            />
            {!isEndDateValid && (
              <p className="text-red-500 text-xs mt-1">
                To Date must be on or after From Date
              </p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Leave empty to pause all classes from the From Date onwards
            </p>
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              value={pauseRemarks}
              onChange={(e) => setPauseRemarks(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter your remarks here..."
              style={{ resize: "none" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => setShowPauseModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handlePauseConfirm}
            disabled={!pauseDate || !isEndDateValid}
            className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Confirm Pause
          </button>
        </div>

        {/* Information Note */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong>
            {pauseEndDate
              ? ` Classes from ${pauseDate} to ${pauseEndDate} will be paused. `
              : ` All classes from ${pauseDate} onwards will be paused. `}
            On Resume, class rescheduling with remaining number of classes are
            mandatory.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PauseModel;
