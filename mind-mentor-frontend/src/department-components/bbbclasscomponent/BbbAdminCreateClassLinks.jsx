import React, { useState, useRef } from "react";
import axios from "axios";
import { Copy, CheckCircle } from "lucide-react";

const AdminCreateClass = () => {
  const [className, setClassName] = useState("");
  const [coachName, setCoachName] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState({
    coach: false,
    kid: false
  });

  const handleCreateClass = async () => {
    if (!className || !coachName) {
      return alert("Please fill in all fields");
    }

    try {
      setLoading(true);
      const res = await axios.post("http://3.104.84.126:3000/api/class/create-class", {
        className,
        coachName,
      });

      setResult(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert("Failed to create class");
      console.error(err);
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied({ ...copied, [type]: true });
      setTimeout(() => {
        setCopied({ ...copied, [type]: false });
      }, 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-8 mt-10 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create New Class</h2>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="block font-medium text-gray-700">Class Name</label>
          <input
            type="text"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Math - 5th Grade"
          />
        </div>

        <div className="space-y-2">
          <label className="block font-medium text-gray-700">Coach Name</label>
          <input
            type="text"
            value={coachName}
            onChange={(e) => setCoachName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            placeholder="Mr. Aswinraj"
          />
        </div>

        <button
          onClick={handleCreateClass}
          disabled={loading}
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 font-medium transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Class"}
        </button>
      </div>

      {result && (
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Class Created Successfully</h3>
          
          <div className="space-y-4">
            <div className="pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Class ID</p>
              <p className="font-medium">{result.classId}</p>
            </div>

            <div className="pb-3 border-b border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Coach Link</p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={result.joinCoachUrl}
                  className="flex-1 p-2 bg-white border border-gray-300 rounded-l-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(result.joinCoachUrl, "coach")}
                  className="bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg p-2 flex items-center justify-center w-10 h-10 transition"
                >
                  {copied.coach ? <CheckCircle size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-600" />}
                </button>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-1">Kid Link</p>
              <div className="flex items-center">
                <input
                  type="text"
                  readOnly
                  value={result.joinKidUrl}
                  className="flex-1 p-2 bg-white border border-gray-300 rounded-l-lg text-sm"
                />
                <button
                  onClick={() => copyToClipboard(result.joinKidUrl, "kid")}
                  className="bg-gray-100 hover:bg-gray-200 border border-l-0 border-gray-300 rounded-r-lg p-2 flex items-center justify-center w-10 h-10 transition"
                >
                  {copied.kid ? <CheckCircle size={18} className="text-green-600" /> : <Copy size={18} className="text-gray-600" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCreateClass;