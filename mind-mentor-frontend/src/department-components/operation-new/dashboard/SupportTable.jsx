import { Clock, Filter, Plus, Search, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

const Support = () => {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const empId = localStorage.getItem("empId"); // Retrieve empId from local storage
  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "in-progress":
        return "text-purple-600 bg-purple-50 border-purple-200";
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const empId = localStorage.getItem("empId"); // Retrieve empId from localStorage
        if (!empId) {
          console.error("Employee ID is not available in localStorage.");
          return;
        }
        const response = await fetch("http://localhost:3000/superadmin/chats/", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            empId: empId, // Send empId in headers
          },
        });
        const data = await response.json();
        if (response.ok) {
          console.log("API Response: ", data);
          setTickets(data.chats); // Update state with chats
        } else {
          console.error("Error fetching chats:", data.message);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };
    fetchChats();
  }, []);
  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      const matchesSearch = ticket.category?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = activeFilter === "all" || ticket.status?.toLowerCase() === activeFilter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
    setFilteredTickets(filtered);
    console.log("Filtered Tickets: ", filtered); // Log the filtered tickets
  }, [tickets, searchQuery, activeFilter]);
  
  const fetchChatByTicketId = async (ticketId) => {
    console.log("Requesting chat for ticket ID:", ticketId); // Log the ticketId
    try {
      const response = await fetch(`http://localhost:3000/superadmin/chats/${ticketId}`);
      const data = await response.json();
      console.log("Fetched Data:", data); // Log the fetched data
      if (response.ok) {
        setSelectedTicket(data.chat);
      } else {
        console.error("Failed to fetch chat:", data.message);
      }
    } catch (error) {
      console.error("Error fetching chat:", error);
    }
  };
  useEffect(() => {
    if (selectedTicket) {
      console.log("Selected Ticket number is as following:", selectedTicket);
    }
  }, [selectedTicket]);
  
  const sendMessage = async () => {
    const senderId = localStorage.getItem("empId"); // Get empId from localStorage
    console.log("senderId is :---", senderId);
  
    if (!senderId) {
      console.error("Sender ID (empId) is missing in localStorage.");
      return;
    }
  
    if (!newMessage.trim()) return; // Don't send if message is empty
  
    const receiverId = selectedTicket.receiverId; // Assuming you have the receiverId from the selected ticket
  
    try {
      const response = await fetch(`http://localhost:3000/superadmin/chats/ticket/${selectedTicket.ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "empId": senderId, // Sending empId in the header
        },
        body: JSON.stringify({
          message: newMessage,
          receiverId: receiverId,
          status: selectedTicket.status,
          category: selectedTicket.category,
        }),
      });
  
      console.log("Response status:", response.status);
  
      const data = await response.json();
  
      if (response.ok) {
        setSelectedTicket((prevTicket) => ({
          ...prevTicket,
          messages: [
            ...prevTicket.messages,
            data.updatedChat.messages[data.updatedChat.messages.length - 1],
          ],
        }));
        setNewMessage(""); // Clear message input
      } else {
        console.error("Failed to send message:", data.message);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };
  
  
  
  
  return (
    <div className="relative flex h-[600px] bg-gray-50 rounded-xl shadow-xl overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Support Tickets</h2>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={() => setShowFilterOptions(!showFilterOptions)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                >
                  <Filter size={16} className="text-gray-600" />
                </button>
                {showFilterOptions && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                    <button
                      onClick={() => {
                        setActiveFilter("open");
                        setShowFilterOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("in-progress");
                        setShowFilterOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      In-progress
                    </button>
                    <button
                      onClick={() => {
                        setActiveFilter("resolved");
                        setShowFilterOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      Resolved
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredTickets.map((ticket) => (
            <div
              key={ticket._id}
              onClick={() => fetchChatByTicketId(ticket.ticketId)} // Ensure this is ticket.ticketId
              className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-purple-50
      ${selectedTicket?._id === ticket._id ? "bg-purple-50 border-l-4 border-l-purple-600" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-gray-900">{ticket.ticketId}</div>
                  <div className="text-sm font-medium text-gray-800">{ticket.category}</div>
                </div>
                <div className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(ticket.status)}`}>
                  {ticket.status}
                </div>
              </div>
              <div className="text-sm text-gray-500 line-clamp-2">
                {ticket.messages.length > 0 ? ticket.messages[0].message : "No messages"}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {ticket.messages.length > 0 && (
                  <div className="text-xs text-gray-600">
                    Sent by: {ticket.messages[0].sender.firstName} {ticket.messages[0].sender.lastName}
                  </div>
                )}
              </div>
              <div className="flex items-center mt-2 text-xs text-gray-400">
                <Clock className="w-3 h-3 mr-1" />
                {new Date(ticket.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <button
          className="absolute top-4 right-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={16} />
          <Link to="/employee-operation-tasks/support/add">
            <span>New Ticket</span>
          </Link>
        </button>
        {selectedTicket ? (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-6 border-b bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedTicket.category}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ticket ID: {selectedTicket.ticketId}{" "}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {selectedTicket.messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.sender.firstName === "Aadi"
                      ? "justify-end"
                      : "justify-start"
                      }`}
                  >
                    <div
                      className={`flex items-start max-w-md ${message.sender.firstName === "Aadi"
                        ? "bg-purple-100 text-purple-900"
                        : "bg-gray-100 text-gray-900"
                        } rounded-lg p-2`}
                    >
                      <p className="text-sm">{message.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-6 bg-white border-t">
              <textarea
                className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="3"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                onClick={sendMessage}
                className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                <Send size={16} className="mr-2" />
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-xl text-gray-500">Select a ticket to view and reply</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default Support;
