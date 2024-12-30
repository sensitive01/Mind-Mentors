import { useState } from "react";

const TaskModule = () => {
  const [request, setRequest] = useState("");

  const handleRequestChange = (event) => {
    setRequest(event.target.value);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-9xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">MsgKart Status Checker </h2>
          <p className="text-sm opacity-90">
            Please fill in the required information below
          </p>
        </div>

        <form className="p-8">
          <div className="space-y-8">
            {/* Request Textarea */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#642b8f]">
                Message Id
              </label>
              <textarea
              
                value={request}
                onChange={handleRequestChange}
                className="w-full p-3 rounded-lg border-2 border-[#aa88be] focus:border-[#642b8f] focus:outline-none transition-colors resize-none"
                placeholder="Enter your Message/ ticket details here..."
              />
            </div>
          </div>

          {/* Form Buttons */}
          <div className="flex justify-center gap-6 mt-8">
            <button
              type="submit"
              className="px-8 py-3 bg-[#642b8f] text-white rounded-lg font-medium hover:bg-[#aa88be] transition-colors shadow-lg hover:shadow-xl"
            >
              Submit Query
            </button>
            <button
              type="reset"
              className="px-8 py-3 bg-white border-2 border-[#642b8f] text-[#642b8f] rounded-lg font-medium hover:bg-[#efe8f0] transition-colors"
            >
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModule;
