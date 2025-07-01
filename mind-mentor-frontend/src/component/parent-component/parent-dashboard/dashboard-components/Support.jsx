import { useEffect, useState, useRef } from "react";
import {
  Search,
  Send,
  Filter,
  Plus,
  Clock,
  X,
  ChevronDown,
} from "lucide-react";
import avatar from "../../../../images/accountInage.webp";
import {
  createTiketForParent,
  getKidBelongsToData,
  getTicketsofParents,
  updateTicketChats,
} from "../../../../api/service/parent/ParentService";

const Support = () => {
  const parentId = localStorage.getItem("parentId");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [newTicketTopic, setNewTicketTopic] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");

  // Real data states
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Kid selection states
  const [kidsData, setKidsData] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [showKidDropdown, setShowKidDropdown] = useState(false);

  // Ref for auto-scrolling to latest message
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-scroll when selectedTicket changes or when new messages are added
  useEffect(() => {
    if (selectedTicket) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  }, [selectedTicket, selectedTicket?.messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getKidBelongsToData(parentId);
        setKidsData(response.data || []);

        // Auto-select if only one kid
        if (response && response.data.length === 1) {
          setSelectedKid(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching kid data:", error);
        setKidsData([]);
      }
    };

    if (parentId) {
      fetchData();
    }
  }, [parentId]);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setLoading(true);
        const response = await getTicketsofParents(parentId);
        if (response.status === 200) {
          setTickets(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchTickets();
    }
  }, [parentId]);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    // If it's already formatted (like "12:36 pm"), return as is
    if (
      typeof timeString === "string" &&
      (timeString.includes("pm") || timeString.includes("am"))
    ) {
      return timeString;
    }

    // Otherwise, format the date
    const date = new Date(timeString);
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  // Helper function to check if message is from current parent
  const isCurrentUser = (senderId) => {
    return senderId === parentId;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && ticket.status === activeFilter;
  });

  const handleNewTicketSubmit = async () => {
    if (
      !newTicketTopic.trim() ||
      !newTicketDescription.trim() ||
      !selectedKid
    ) {
      alert("Please fill all fields and select a kid");
      return;
    }

    // Prepare data to send to backend
    const ticketData = {
      topic: newTicketTopic.trim(),
      description: newTicketDescription.trim(),
      kidId: selectedKid.kidId,
      kidName: selectedKid.kidName,
      parentId: parentId,
      status: "open",
      priority: "medium",
      createdAt: new Date().toISOString(),
    };

    try {
      console.log("Sending ticket data to backend:", ticketData);

      await createTiketForParent(ticketData);

      // Refresh tickets after creating new one
      const response = await getTicketsofParents(parentId);
      if (response.status===200) {
        setTickets(response.data.data || []);
      }

      // Reset form
      setNewTicketTopic("");
      setNewTicketDescription("");
      setIsNewTicketModalOpen(false);

      alert("Ticket created successfully!");
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  };

  const resetModalForm = () => {
    setNewTicketTopic("");
    setNewTicketDescription("");
    if (kidsData.length > 1) {
      setSelectedKid(null);
    }
    setShowKidDropdown(false);
  };

  const handleModalClose = () => {
    setIsNewTicketModalOpen(false);
    resetModalForm();
  };

  const handleSendChat = async () => {
    if (!newMessage.trim()) return;

    // Create new message object for instant UI update
    const newMessageObj = {
      senderId: parentId,
      message: newMessage.trim(),
      time: formatTime(new Date()),
      isLocal: true, // Flag to identify locally added messages
    };

    // Store the message to send
    const messageToSend = newMessage.trim();

    // Clear input immediately for better UX
    setNewMessage("");

    // Update UI instantly - add message to selected ticket
    setSelectedTicket((prevTicket) => ({
      ...prevTicket,
      messages: [...(prevTicket.messages || []), newMessageObj],
    }));

    // Also update in the tickets array for consistency
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket._id === selectedTicket._id
          ? { ...ticket, messages: [...(ticket.messages || []), newMessageObj] }
          : ticket
      )
    );

    try {
      // Send to backend
      const response = await updateTicketChats(
        messageToSend,
        selectedTicket._id,
        parentId
      );

      if (response.status===200) {
        // Update the message to remove the local flag and add any server data
        const serverMessageObj = {
          senderId: parentId,
          message: messageToSend,
          time: formatTime(new Date()),
          isLocal: false,
        };

        // Update the selected ticket with server confirmation
        setSelectedTicket((prevTicket) => ({
          ...prevTicket,
          messages: prevTicket.messages.map((msg, index) =>
            index === prevTicket.messages.length - 1 && msg.isLocal
              ? serverMessageObj
              : msg
          ),
        }));

        // Update tickets array with server confirmation
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id
              ? {
                  ...ticket,
                  messages: ticket.messages.map((msg, index) =>
                    index === ticket.messages.length - 1 && msg.isLocal
                      ? serverMessageObj
                      : msg
                  ),
                }
              : ticket
          )
        );
      } else {
        // If server request failed, remove the optimistic message
        setSelectedTicket((prevTicket) => ({
          ...prevTicket,
          messages: prevTicket.messages.filter((msg) => !msg.isLocal),
        }));

        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id
              ? {
                  ...ticket,
                  messages: ticket.messages.filter((msg) => !msg.isLocal),
                }
              : ticket
          )
        );

        // Restore the message to input field
        setNewMessage(messageToSend);
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.log("Error in sending the chats", err);

      // If error occurred, remove the optimistic message
      setSelectedTicket((prevTicket) => ({
        ...prevTicket,
        messages: prevTicket.messages.filter((msg) => !msg.isLocal),
      }));

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === selectedTicket._id
            ? {
                ...ticket,
                messages: ticket.messages.filter((msg) => !msg.isLocal),
              }
            : ticket
        )
      );

      // Restore the message to input field
      setNewMessage(messageToSend);
      alert("Failed to send message. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[600px] bg-gray-50 rounded-xl shadow-xl overflow-hidden items-center justify-center">
        <div className="text-gray-500">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="relative flex h-[600px] bg-gray-50 rounded-xl shadow-xl overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-primary">Support Tickets</h2>
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
                        setActiveFilter("all");
                        setShowFilterOptions(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100"
                    >
                      All
                    </button>
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
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredTickets.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {tickets.length === 0
                ? "No tickets found"
                : "No matching tickets"}
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket._id}
                onClick={() => setSelectedTicket(ticket)}
                className={`p-4 border-b cursor-pointer transition-all duration-200 hover:bg-purple-50
                  ${
                    selectedTicket?._id === ticket._id
                      ? "bg-purple-50 border-l-4 border-l-primary"
                      : ""
                  }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-medium text-gray-900">
                      {ticket.ticketId}
                    </div>
                    <div className="text-sm font-medium text-gray-800">
                      {ticket.topic}
                    </div>
                    {ticket.kidName && (
                      <div className="text-xs text-gray-500 mt-1">
                        Kid: {ticket.kidName}
                      </div>
                    )}
                  </div>
                  <div
                    className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {ticket.status}
                  </div>
                </div>
                <div className="text-sm text-gray-500 line-clamp-2">
                  {ticket.description}
                </div>
                {ticket.messages && ticket.messages.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {ticket.messages[ticket.messages.length - 1].message}
                    </p>
                    <div className="text-xs text-gray-400 mt-1">
                      {ticket.messages[ticket.messages.length - 1].time}
                    </div>
                  </div>
                )}
                <div className="flex items-center mt-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDate(ticket.createdAt)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="absolute top-4 right-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={16} className="rounded-full bg-white text-primary" />
          <span>Raise New Ticket</span>
        </button>

        {selectedTicket ? (
          <div className="flex-1 flex flex-col h-full">
            <div className="p-6 border-b bg-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-primary">
                    {selectedTicket.topic}
                  </h2>
                  <p className="text-sm text-gray-500">
                    Ticket ID: {selectedTicket.ticketId}
                    {selectedTicket.kidName && (
                      <span className="ml-2">
                        • Kid: {selectedTicket.kidName}
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Created: {formatDate(selectedTicket.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-4">
                {/* Initial ticket description */}
                <div className="flex justify-start">
                  <div className="flex items-start max-w-md">
                    <img
                      src={avatar}
                      alt="user"
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="mx-2 p-3 rounded-lg bg-white text-gray-700 shadow-sm border">
                      <p className="text-sm font-medium text-gray-500 mb-1">
                        You
                      </p>
                      <p className="text-sm">{selectedTicket.description}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {formatDate(selectedTicket.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Display messages if any */}
                {selectedTicket.messages &&
                  selectedTicket.messages.length > 0 &&
                  selectedTicket.messages.map((message, idx) => (
                    <div
                      key={idx}
                      className={`flex ${
                        isCurrentUser(message.senderId)
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`flex items-start max-w-md ${
                          isCurrentUser(message.senderId)
                            ? "flex-row-reverse"
                            : "flex-row"
                        }`}
                      >
                        <img
                          src={avatar}
                          alt={
                            isCurrentUser(message.senderId) ? "You" : "Support"
                          }
                          className="w-8 h-8 rounded-full"
                        />
                        <div
                          className={`mx-2 p-3 rounded-lg ${
                            isCurrentUser(message.senderId)
                              ? "bg-primary text-white"
                              : "bg-white text-gray-700 shadow-sm border"
                          } ${message.isLocal ? "opacity-70" : ""}`}
                        >
                          <p
                            className={`text-xs mb-1 ${
                              isCurrentUser(message.senderId)
                                ? "text-blue-200"
                                : "text-gray-500"
                            }`}
                          >
                            {isCurrentUser(message.senderId)
                              ? "You"
                              : "Support"}
                            {message.isLocal && " (sending...)"}
                          </p>
                          <p className="text-sm">{message.message}</p>
                          <p
                            className={`text-xs mt-1 ${
                              isCurrentUser(message.senderId)
                                ? "text-blue-200"
                                : "text-gray-500"
                            }`}
                          >
                            {message.time || formatTime(message.createdAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                {/* Invisible element for auto-scrolling */}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input Area */}
            <div className="p-4 bg-white border-t">
              {selectedTicket.status === "resolved" ? (
                <div className="text-center py-3 bg-gray-50 rounded-lg text-gray-500">
                  This ticket has been resolved and is closed for new messages
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 p-3 h-20 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Type your message..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendChat();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendChat}
                    disabled={!newMessage.trim()}
                    className="p-3 bg-primary text-white rounded-full hover:bg-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a ticket to view the conversation
          </div>
        )}
      </div>

      {/* New Ticket Modal */}
      {isNewTicketModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-primary">
                Create New Ticket
              </h3>
              <button
                onClick={handleModalClose}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Kid Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Kid *
                </label>
                {kidsData.length === 0 ? (
                  <div className="text-sm text-gray-500 p-2 bg-gray-50 rounded-lg">
                    No kids data available
                  </div>
                ) : kidsData.length === 1 ? (
                  <div className="px-3 py-2 bg-gray-50 border rounded-lg text-gray-700">
                    {kidsData[0].kidName}
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowKidDropdown(!showKidDropdown)}
                      className="w-full px-3 py-2 text-left border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent flex justify-between items-center"
                    >
                      <span
                        className={
                          selectedKid ? "text-gray-900" : "text-gray-400"
                        }
                      >
                        {selectedKid ? selectedKid.kidName : "Select a kid"}
                      </span>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>

                    {showKidDropdown && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
                        {kidsData.map((kid) => (
                          <button
                            key={kid.kidId}
                            type="button"
                            onClick={() => {
                              setSelectedKid(kid);
                              setShowKidDropdown(false);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                          >
                            {kid.kidName}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic *
                </label>
                <input
                  type="text"
                  value={newTicketTopic}
                  onChange={(e) => setNewTicketTopic(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter ticket topic"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  value={newTicketDescription}
                  onChange={(e) => setNewTicketDescription(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg h-32 resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe your issue"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t">
              <button
                onClick={handleModalClose}
                className="px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleNewTicketSubmit}
                disabled={
                  !newTicketTopic.trim() ||
                  !newTicketDescription.trim() ||
                  !selectedKid ||
                  kidsData.length === 0
                }
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Ticket
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
