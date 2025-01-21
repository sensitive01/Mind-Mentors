import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { formatWhatsAppNumber } from "../../../../utils/formatContacts";
import { sendMessage } from "../../../../utils/secretApi";

const PaymentDialog = ({ open, onClose, data }) => {
  const [paymentDetails, setPaymentDetails] = useState({
    amount: "",
    paymentMode: "",
  });
  const [generatedLink, setGeneratedLink] = useState("");

  const paymentModes = [
    { value: "upi", label: "UPI" },
    { value: "netBanking", label: "Net Banking" },
    { value: "card", label: "Card" },
    { value: "cash", label: "Cash" },
  ];

  useEffect(() => {
    if (paymentDetails.amount && paymentDetails.paymentMode) {
      const linkData = {
        kidName: data?.kidName,
        whatsappNumber: data?.whatsappNumber,
        amount: paymentDetails.amount,
        paymentMode: paymentDetails.paymentMode,
        timestamp: new Date().toISOString(),
      };

      const encodedData = btoa(JSON.stringify(linkData));
      const paymentLink = `${window.location.origin}/payment/${encodedData}`;
      setGeneratedLink(paymentLink);
    } else {
      setGeneratedLink("");
    }
  }, [paymentDetails, data]);

  const handleInputChange = (field, value) => {
    setPaymentDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendLink = async () => {
    try {
      const recipient = 7559889322
      const messageData = `Your Minmentors payment link is ${generatedLink}`
      const response = await sendMessage(recipient,messageData)
      console.log(response)
      // await fetch("/api/send-payment-link", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     phoneNumber: data?.whatsappNumber,
      //     paymentLink: generatedLink,
      //   }),
      // });
      onClose();
    } catch (error) {
      console.error("Failed to send payment link:", error);
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full max-w-sm transform ${
        open ? "translate-x-0" : "translate-x-full"
      } 
      transition-transform duration-300 ease-in-out bg-white shadow-lg flex`}
    >
      <div className="flex flex-col w-full h-screen">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-[#642b8f] to-[#aa88be] px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">
            Send Payment Link
          </h2>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content with fixed heights */}
        <div className="flex-1 bg-[#f8f9fa] p-6">
          <div className="h-full flex flex-col gap-4">
            {/* User info section */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    Kid Name
                  </label>
                  <p className="font-medium text-gray-900">
                    {data?.kidName || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    WhatsApp Number
                  </label>
                  <p className="font-medium text-gray-900">
                    {formatWhatsAppNumber(data?.whatsappNumber )|| "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment details section */}
            <div className="bg-white p-4 rounded-lg shadow-sm space-y-4 flex-none">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount
                </label>
                <input
                  type="number"
                  value={paymentDetails.amount}
                  onChange={(e) => handleInputChange("amount", e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Mode
                </label>
                <select
                  value={paymentDetails.paymentMode}
                  onChange={(e) =>
                    handleInputChange("paymentMode", e.target.value)
                  }
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 focus:border-purple-500 focus:ring-purple-500"
                >
                  <option value="">Select payment mode</option>
                  {paymentModes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Generated Link Display */}
            {generatedLink && (
              <div className="bg-white p-4 rounded-lg shadow-sm flex-none">
                <label className="text-sm text-gray-600 block mb-2">
                  Generated Payment Link
                </label>
                <div className="p-3 bg-purple-50 rounded-md break-all font-mono text-sm border border-purple-100">
                  {generatedLink}
                </div>
              </div>
            )}

            {/* Spacer */}
            <div className="flex-1" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSendLink}
              disabled={!generatedLink}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              Send Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDialog;
