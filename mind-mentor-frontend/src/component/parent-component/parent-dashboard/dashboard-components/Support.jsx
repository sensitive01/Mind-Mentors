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
import axios from "axios";
import io from "socket.io-client";
import { DataArrayOutlined } from "@mui/icons-material";

const socket = io("https://live.mindmentorz.in", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Support = () => {
  const parentId = localStorage.getItem("parentId");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [newTicketTopic, setNewTicketTopic] = useState("");
  const [newTicketDescription, setNewTicketDescription] = useState("");
  const [tickets, setTickets] = useState([]);
  const [typingStatus, setTypingStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [kidsData, setKidsData] = useState([]);
  const [selectedKid, setSelectedKid] = useState(null);
  const [showKidDropdown, setShowKidDropdown] = useState(false);
  const [lastSeen, setLastSeen] = useState(null);

  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!parentId) return;

    socket.emit("joinRoom", { userId: parentId });

    const handleReceiveMessage = (data) => {
      // if (selectedTicket && data.ticketId === selectedTicket._id) {
      //   setMessages((prev) => [...prev, data]);
      //   socket.emit("markAsSeen", {
      //     ticketId: selectedTicket._id,
      //     parentId,
      //   });
      // }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === data.ticketId
            ? {
                ...ticket,
                messages: [...(ticket.messages || []), data],
                updatedAt: new Date().toISOString(),
              }
            : ticket
        )
      );
    };

    const handleTypingStatus = ({ ticketId, isTyping, userName }) => {
      if (selectedTicket && ticketId === selectedTicket._id && !isTyping) {
        setTypingStatus("");
      } else if (
        selectedTicket &&
        ticketId === selectedTicket._id &&
        isTyping
      ) {
        setTypingStatus(`${userName} is typing...`);
      }
    };

    const handleSeenStatus = ({ ticketId, seenAt }) => {
      if (selectedTicket && ticketId === selectedTicket._id) {
        setLastSeen(seenAt);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typingStatus", handleTypingStatus);
    socket.on("seenStatus", handleSeenStatus);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typingStatus", handleTypingStatus);
      socket.off("seenStatus", handleSeenStatus);
    };
  }, [parentId, selectedTicket]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getKidBelongsToData(parentId);
        setKidsData(response.data || []);
        if (response?.data?.length === 1) {
          setSelectedKid(response.data[0]);
        }
      } catch (error) {
        console.error("Error fetching kid data:", error);
        setKidsData([]);
      }
    };

    if (parentId) fetchData();
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

    if (parentId) fetchTickets();
  }, [parentId]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!selectedTicket) return;

    socket.emit("typing", {
      ticketId: selectedTicket._id,
      isTyping: true,
      userName: "You",
      parentId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        ticketId: selectedTicket._id,
        isTyping: false,
        userName: "You",
        userId: parentId,
      });
    }, 1500);
  };

  const handleSelectTicket = async (ticket) => {
    try {
      setSelectedTicket(ticket);
      setMessages(ticket.messages || []);

      socket.emit("joinTicketRoom", { ticketId: ticket._id, userId: parentId });
      socket.emit("markAsSeen", {
        ticketId: ticket._id,
        userId: parentId,
      });
    } catch (error) {
      console.error("Error fetching ticket messages:", error);
    }
  };

  const handleSendChat = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    const messageToSend = newMessage.trim();
    const tempId = Date.now().toString();
    const time = new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create temporary message with pending status
    const tempMessage = {
      _id: tempId,
      senderId: parentId,
      message: messageToSend,
      time,
      status: "pending", // Add status field
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setNewMessage("");

    try {
      const response = await updateTicketChats(
        messageToSend,
        selectedTicket._id,
        parentId
      );

      if (response.status === 200) {
        // Replace the temporary message with the confirmed one from server
        const serverMessage = {
          ...tempMessage,
          _id: response.data.messageId || tempId, // Use server ID if available
          status: "delivered", // Update status to delivered
        };

        setMessages((prev) =>
          prev.map((msg) => (msg._id === tempId ? serverMessage : msg))
        );

        socket.emit("sendMessage", {
          ...serverMessage,
          userId: parentId,
          messages: messageToSend,
          ticketId: selectedTicket._id,
        });

        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id
              ? {
                  ...ticket,
                  messages: [...(ticket.messages || []), serverMessage],
                  updatedAt: new Date().toISOString(),
                }
              : ticket
          )
        );
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Update the message status to failed
      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId ? { ...msg, status: "failed" } : msg
        )
      );
      setNewMessage(messageToSend);
    }
  };

  const handleNewTicketSubmit = async () => {
    if (
      !newTicketTopic.trim() ||
      !newTicketDescription.trim() ||
      !selectedKid
    ) {
      alert("Please fill all fields and select a kid");
      return;
    }

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
      const response = await createTiketForParent(ticketData);
      if (response.status === 201) {
        const ticketsResponse = await getTicketsofParents(parentId);
        if (ticketsResponse.status === 200) {
          setTickets(ticketsResponse.data.data || []);
        }

        setNewTicketTopic("");
        setNewTicketDescription("");
        setIsNewTicketModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating ticket:", error);
      alert("Failed to create ticket. Please try again.");
    }
  };

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
    if (!timeString) return "";
    if (
      typeof timeString === "string" &&
      (timeString.includes("pm") || timeString.includes("am"))
    ) {
      return timeString;
    }
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const isCurrentUser = (senderId) => {
    return senderId === parentId;
  };

  const getMessageStatus = (message) => {
    if (!message.status) return "delivered"; // Default for older messages
    return message.status;
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.ticketId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "all") return matchesSearch;
    return matchesSearch && ticket.status === activeFilter;
  });

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
        {/* Header Section */}
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

          {/* Search Input */}
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

        {/* Tickets List */}
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
                onClick={() => handleSelectTicket(ticket)}
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
        {/* New Ticket Button */}
        <button
          onClick={() => setIsNewTicketModalOpen(true)}
          className="absolute top-4 right-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors duration-200 flex items-center space-x-2"
        >
          <Plus size={16} className="rounded-full bg-white text-primary" />
          <span>Raise New Ticket</span>
        </button>

        {selectedTicket ? (
          <div className="flex-1 flex flex-col h-full">
            {/* Ticket Header */}
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
                    {lastSeen && (
                      <span className="ml-2">
                        • Seen: {formatTime(lastSeen)}
                      </span>
                    )}
                  </p>
                </div>
                <div
                  className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                    selectedTicket.status
                  )}`}
                >
                  {selectedTicket.status}
                </div>
              </div>
            </div>

            {/* Chat Messages */}
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

                {/* Messages */}
                {messages.map((message, idx) => (
                  <div
                    key={message._id || idx}
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
                        } ${
                          getMessageStatus(message) === "pending"
                            ? "opacity-70"
                            : ""
                        }`}
                      >
                        <p
                          className={`text-xs mb-1 ${
                            isCurrentUser(message.senderId)
                              ? "text-blue-200"
                              : "text-gray-500"
                          }`}
                        >
                          {isCurrentUser(message.senderId) ? "You" : "Support"}
                          {getMessageStatus(message) === "pending" &&
                            " (sending...)"}
                          {getMessageStatus(message) === "failed" &&
                            " (failed)"}
                        </p>
                        <p className="text-sm">{message.message}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p
                            className={`text-xs ${
                              isCurrentUser(message.senderId)
                                ? "text-blue-200"
                                : "text-gray-500"
                            }`}
                          >
                            {message.time || formatTime(message.createdAt)}
                          </p>
                          {/* {isCurrentUser(message.senderId) && (
                            <span className="text-xs ml-2">
                              {getMessageStatus(message) === "delivered" &&
                                "✓✓"}
                              {getMessageStatus(message) === "pending" && "..."}
                              {getMessageStatus(message) === "failed" && "✗"}
                            </span>
                          )} */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {typingStatus && (
                  <div className="flex justify-start">
                    <div className="flex items-start max-w-md">
                      <img
                        src={avatar}
                        alt="Support"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="mx-2 p-3 rounded-lg bg-white text-gray-700 shadow-sm border">
                        <p className="text-xs italic text-gray-500">
                          {typingStatus}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

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
                    onChange={handleTyping}
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
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-semibold text-primary">
                Create New Ticket
              </h3>
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
                className="text-gray-400 hover:text-gray-500 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
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

              {/* Topic Input */}
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

              {/* Description Input */}
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

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 bg-gray-50 border-t">
              <button
                onClick={() => setIsNewTicketModalOpen(false)}
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
