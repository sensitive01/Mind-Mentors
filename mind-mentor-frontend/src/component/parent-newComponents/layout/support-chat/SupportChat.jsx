import { useState } from "react";
import { Send, X } from "lucide-react";

const SupportChat = ({ onClose }) => {
  const [message, setMessage] = useState("");

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col z-50">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
            <img src="/ai-avatar.png" alt="AI Support" className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">AI Support</h3>
            <p className="text-sm text-gray-500">How can I help you today?</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
            <img src="/ai-avatar.png" alt="AI" className="w-5 h-5" />
          </div>
          <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
            <p className="text-gray-800">
              Hello! I'm your AI assistant. What can I help you with?
            </p>
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="p-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupportChat;
