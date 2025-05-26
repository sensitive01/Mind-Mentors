import React, { useState } from "react";
import { Trash2, Plus, Video, Copy, Check } from "lucide-react";
import { getClassRecodingsLink } from "../../api/service/employee/EmployeeService";

const BbbGetRecordings = () => {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIds, setMeetingIds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recordings, setRecordings] = useState(null);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState(null);

  const addMeetingId = () => {
    if (meetingId.trim() && !meetingIds.includes(meetingId.trim())) {
      setMeetingIds([...meetingIds, meetingId.trim()]);
      setMeetingId("");
      setError("");
    } else if (meetingIds.includes(meetingId.trim())) {
      setError("Meeting ID already added");
    } else {
      setError("Please enter a valid meeting ID");
    }
  };

  const removeMeetingId = (idToRemove) => {
    setMeetingIds(meetingIds.filter((id) => id !== idToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addMeetingId();
    }
  };

  const getRecordings = async () => {
    if (meetingIds.length === 0) {
      setError("Please add at least one meeting ID");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await getClassRecodingsLink(meetingIds);
      console.log("Response", response);
      setRecordings(response.data);
    } catch (err) {
      setError("Error fetching recordings: " + err.message);
      console.error("API Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text, index) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow border mb-6">
          <div className="bg-primary px-6 py-4 rounded-t-lg">
            <div className="flex items-center gap-3">
              <Video className="text-white" size={24} />
              <h1 className="text-xl font-semibold text-white">
                BBB Recording Manager
              </h1>
            </div>
          </div>

          {/* Input Section */}
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Meeting IDs
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={meetingId}
                  onChange={(e) => setMeetingId(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter meeting ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <button
                  onClick={addMeetingId}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex items-center gap-2"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>

              {error && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded-md border border-red-200">
                  {error}
                </div>
              )}
            </div>

            {/* Meeting IDs List */}
            {meetingIds.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meeting IDs ({meetingIds.length})
                </label>
                <div className="space-y-2">
                  {meetingIds.map((id, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-md"
                    >
                      <span className="font-mono text-sm text-blue-900">
                        {id}
                      </span>
                      <button
                        onClick={() => removeMeetingId(id)}
                        className="text-primary hover:text-blue-800 p-1 rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Get Recordings Button */}
            <button
              onClick={getRecordings}
              disabled={isLoading || meetingIds.length === 0}
              className="w-full px-4 py-2 bg-primary text-white font-medium rounded-md hover:bg-primary disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Fetching...
                </>
              ) : (
                <>
                  <Video size={16} />
                  Get Recordings
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {recordings && (
          <div className="bg-white rounded-lg shadow border">
            <div className="px-6 py-4 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Recording Links ({recordings.links?.length || 0})
              </h2>
            </div>

            <div className="p-6">
              {recordings.links && recordings.links.length > 0 ? (
                <div className="space-y-3">
                  {recordings.links.map((link, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="text-sm font-medium text-blue-900 mb-1">
                          Recording {index + 1}
                        </div>
                        <div className="text-xs text-primary font-mono bg-white px-2 py-1 rounded border break-all">
                          {link}
                        </div>
                      </div>
                      <button
                        onClick={() => copyToClipboard(link, index)}
                        className="px-3 py-2 bg-primary text-white rounded-md hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary transition-colors flex items-center gap-2 text-sm"
                        title="Copy link"
                      >
                        {copiedIndex === index ? (
                          <>
                            <Check size={14} />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} />
                            Copy
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Video className="mx-auto mb-2" size={32} />
                  <p>No recording links found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BbbGetRecordings;
