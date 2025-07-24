import React, { useEffect, useState, useRef } from "react";
import { Filter, Search, Send, ChevronDown, Star, MessageCircle, User, Clock, AlertCircle } from "lucide-react";
import {
  fetchParentTikets,
  reponseToTickets,
  updateTicketPriority,
} from "../../../api/service/employee/EmployeeService";
import io from "socket.io-client";

const socket = io("https://live.mindmentorz.in", {
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const ParentTicketList = () => {
  const empId = localStorage.getItem("empId");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [typingStatus, setTypingStatus] = useState("");
  const [lastSeen, setLastSeen] = useState(null);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [isUpdatingPriority, setIsUpdatingPriority] = useState(false);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const priorityDropdownRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages, selectedTicket?.chatRating]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        priorityDropdownRef.current &&
        !priorityDropdownRef.current.contains(event.target)
      ) {
        setShowPriorityDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!empId) return;

    const handleReceiveMessage = (data) => {
      if (selectedTicket && data.ticketId === selectedTicket._id) {
        setSelectedTicket((prev) => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              ...data,
              senderId: data.userId,
              time: formatTime(new Date()),
            },
          ],
        }));
        socket.emit("markAsSeen", {
          ticketId: selectedTicket._id,
          empId,
        });
      }

      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === data.ticketId
            ? {
                ...ticket,
                messages: [
                  ...ticket.messages,
                  {
                    ...data,
                    senderId: data.userId,
                    time: formatTime(new Date()),
                  },
                ],
                updatedAt: new Date().toISOString(),
              }
            : ticket
        )
      );
    };

    const handleTypingStatus = ({ ticketId, isTyping, userName }) => {
      if (selectedTicket && ticketId === selectedTicket._id) {
        if (isTyping && !isCurrentUser(userName)) {
          setTypingStatus(`${userName} is typing...`);
        } else {
          setTypingStatus("");
        }
      }
    };

    const handleSeenStatus = ({ ticketId, seenAt }) => {
      if (selectedTicket && ticketId === selectedTicket._id) {
        setLastSeen(seenAt);
      }
    };

    const handlePriorityUpdate = ({ ticketId, priority }) => {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId ? { ...ticket, priority } : ticket
        )
      );

      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket((prev) => ({
          ...prev,
          priority,
          updatedAt: new Date().toISOString(),
        }));
      }
    };

    const handleRatingUpdate = ({ ticketId, rating, remarks }) => {
      setTickets((prevTickets) =>
        prevTickets.map((ticket) =>
          ticket._id === ticketId
            ? { ...ticket, chatRating: rating, chatRemarks: remarks }
            : ticket
        )
      );

      if (selectedTicket && selectedTicket._id === ticketId) {
        setSelectedTicket((prev) => ({
          ...prev,
          chatRating: rating,
          chatRemarks: remarks,
        }));
      }
    };

    socket.emit("joinRoom", { userId: empId });
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typingStatus", handleTypingStatus);
    socket.on("seenStatus", handleSeenStatus);
    socket.on("priorityUpdated", handlePriorityUpdate);
    socket.on("ratingUpdated", handleRatingUpdate);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typingStatus", handleTypingStatus);
      socket.off("seenStatus", handleSeenStatus);
      socket.off("priorityUpdated", handlePriorityUpdate);
      socket.off("ratingUpdated", handleRatingUpdate);
    };
  }, [empId, selectedTicket]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "in-progress":
        return "text-blue-600 bg-blue-50 border-blue-200";
      case "resolved":
        return "text-green-600 bg-green-50 border-green-200";
      case "pending":
        return "text-orange-600 bg-orange-50 border-orange-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getBadgeColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isCurrentUser = (senderId) => {
    return senderId === empId;
  };

  const isTicketResolved = (ticket) => {
    return ticket?.status?.toLowerCase() === "resolved";
  };

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        if (!empId) return;
        const response = await fetchParentTikets(empId);
        if (response.status === 200) {
          setTickets(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChats();
  }, [empId]);

  useEffect(() => {
    const filtered = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.topic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticketId?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        activeFilter === "all" ||
        ticket.status?.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
    setFilteredTickets(filtered);
  }, [tickets, searchQuery, activeFilter]);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowPriorityDropdown(false);
    socket.emit("joinTicketRoom", { ticketId: ticket._id, userId: empId });
    socket.emit("markAsSeen", {
      ticketId: ticket._id,
      userId: empId,
    });
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!selectedTicket) return;

    socket.emit("typing", {
      ticketId: selectedTicket._id,
      isTyping: true,
      userName: "Employee",
      userId: empId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        ticketId: selectedTicket._id,
        isTyping: false,
        userName: "Employee",
        userId: empId,
      });
    }, 1500);
  };

  const formatTime = (timeString) => {
    if (!timeString) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date());
    }

    if (
      typeof timeString === "string" &&
      (timeString.includes("pm") || timeString.includes("am"))
    ) {
      return timeString;
    }

    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date());
    }

    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const sendMessage = async () => {
    if (!empId || !newMessage.trim() || !selectedTicket || isSending) return;

    setIsSending(true);
    const messageToSend = newMessage.trim();
    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      senderId: empId,
      message: messageToSend,
      time: formatTime(new Date()),
      isLocal: true,
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await reponseToTickets(
        messageToSend,
        selectedTicket._id,
        empId
      );

      if (response.status === 200) {
        const serverMessage = response.data.data;

        setSelectedTicket((prev) => ({
          ...prev,
          messages: prev.messages.map((msg) =>
            msg._id === tempId
              ? {
                  ...serverMessage,
                  senderId: empId,
                  time: formatTime(serverMessage.createdAt || new Date()),
                  message: messageToSend,
                  isLocal: false,
                }
              : msg
          ),
        }));

        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id
              ? {
                  ...ticket,
                  messages: ticket.messages.map((msg) =>
                    msg._id === tempId
                      ? {
                          ...serverMessage,
                          senderId: empId,
                          time: formatTime(
                            serverMessage.createdAt || new Date()
                          ),
                          message: messageToSend,
                          isLocal: false,
                        }
                      : msg
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : ticket
          )
        );

        socket.emit("sendMessage", {
          ...serverMessage,
          message: messageToSend,
          userId: empId,
          ticketId: selectedTicket._id,
          senderId: empId,
          time: formatTime(new Date()),
        });
        setNewMessage("");
      } else {
        setSelectedTicket((prev) => ({
          ...prev,
          messages: prev.messages.filter((msg) => msg._id !== tempId),
        }));
        setNewMessage(messageToSend);
        console.error("Failed to send message");
      }
    } catch (error) {
      setSelectedTicket((prev) => ({
        ...prev,
        messages: prev.messages.filter((msg) => msg._id !== tempId),
      }));
      setNewMessage(messageToSend);
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const updatePriority = async (priority) => {
    if (
      !selectedTicket ||
      isUpdatingPriority ||
      isTicketResolved(selectedTicket)
    )
      return;

    setIsUpdatingPriority(true);
    try {
      const response = await updateTicketPriority(selectedTicket._id, priority);
      if (response.status === 200) {
        setSelectedTicket((prev) => ({
          ...prev,
          priority,
          updatedAt: new Date().toISOString(),
        }));

        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id ? { ...ticket, priority } : ticket
          )
        );

        socket.emit("updatePriority", {
          ticketId: selectedTicket._id,
          priority,
          userId: empId,
        });

        console.log("Priority updated successfully to:", priority);
      } else {
        console.error("Failed to update priority:", response);
      }
    } catch (error) {
      console.error("Error updating priority:", error);
    } finally {
      setIsUpdatingPriority(false);
      setShowPriorityDropdown(false);
    }
  };

  const renderRatingStars = (rating) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
   <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        <div className="flex h-[calc(100vh-3rem)]">
          {/* Sidebar */}
          <div className="w-96 border-r border-slate-200 flex flex-col bg-gradient-to-b from-white to-slate-50">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-white">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-slate-900">
                  Support Tickets
                </h1>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {filteredTickets.length} tickets
                </div>
              </div>

              <div className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-sm font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Filter */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                    className="flex items-center space-x-2 px-4 py-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-all border border-slate-200 font-medium text-slate-700"
                  >
                    <Filter size={16} />
                    <span className="text-sm">Filter by status</span>
                    <ChevronDown size={14} className="ml-auto" />
                  </button>
                  {showFilterOptions && (
                    <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-lg py-2 z-10 border border-slate-200">
                      {[
                        { value: "all", label: "All Tickets" },
                        { value: "open", label: "Open" },
                        { value: "in-progress", label: "In Progress" },
                        { value: "resolved", label: "Resolved" },
                        { value: "pending", label: "Pending" },
                      ].map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => {
                            setActiveFilter(filter.value);
                            setShowFilterOptions(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left hover:bg-slate-50 text-sm font-medium transition-colors ${
                            activeFilter === filter.value ? "bg-blue-50 text-blue-700" : "text-slate-700"
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    onClick={() => handleTicketClick(ticket)}
                    className={`mx-4 my-2 p-4 rounded-xl cursor-pointer transition-all border hover:shadow-md ${
                      selectedTicket?._id === ticket._id
                        ? "bg-blue-50 border-blue-200 shadow-md"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {/* Ticket Header */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-1 rounded">
                            {ticket.ticketId}
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(ticket.status)}`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <h3 className="font-semibold text-slate-900 text-sm mb-1 line-clamp-1">
                          {ticket.topic}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1 ml-3">
                        <span
                          className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeColor(ticket.priority)}`}
                        >
                          {ticket.priority}
                        </span>
                        {ticket.chatRating && (
                          <div className="flex items-center">
                            {renderRatingStars(ticket.chatRating)}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Last Message Preview */}
                    {ticket.messages.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-sm text-slate-600 line-clamp-2 mb-2 leading-relaxed">
                          {ticket.messages[ticket.messages.length - 1].message}
                        </p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <div className="flex items-center space-x-1">
                            <Clock size={12} />
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                          <span>
                            {formatTime(ticket.messages[ticket.messages.length - 1].createdAt)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-slate-50">
            {selectedTicket ? (
              <>
                {/* Ticket Header */}
                <div className="p-6 bg-white border-b border-slate-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-sm font-mono text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                          #{selectedTicket.ticketId}
                        </span>
                        <span
                          className={`text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(selectedTicket.status)}`}
                        >
                          {selectedTicket.status}
                        </span>
                        <div className="relative" ref={priorityDropdownRef}>
                          <button
                            onClick={() => {
                              if (!isTicketResolved(selectedTicket) && !isUpdatingPriority) {
                                setShowPriorityDropdown(!showPriorityDropdown);
                              }
                            }}
                            disabled={isTicketResolved(selectedTicket) || isUpdatingPriority}
                            className={`text-sm px-3 py-1 rounded-full flex items-center transition-all font-medium ${getBadgeColor(selectedTicket.priority)} ${
                              isTicketResolved(selectedTicket)
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:shadow-md"
                            } ${isUpdatingPriority ? "opacity-70" : ""}`}
                          >
                            {isUpdatingPriority && (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                            )}
                            {selectedTicket.priority}
                            {!isTicketResolved(selectedTicket) && !isUpdatingPriority && (
                              <ChevronDown className="ml-1 w-3 h-3" />
                            )}
                          </button>
                          {showPriorityDropdown && !isTicketResolved(selectedTicket) && (
                            <div className="absolute z-10 mt-2 w-36 bg-white rounded-xl shadow-lg py-2 border border-slate-200">
                              {["High", "Medium", "Low"].map((priority) => (
                                <button
                                  key={priority}
                                  onClick={() => updatePriority(priority)}
                                  disabled={isUpdatingPriority}
                                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-slate-50 flex items-center transition-colors font-medium ${
                                    selectedTicket.priority === priority
                                      ? "bg-blue-50 text-blue-700"
                                      : "text-slate-700"
                                  } ${isUpdatingPriority ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                >
                                  <span
                                    className={`w-2.5 h-2.5 rounded-full mr-3 ${
                                      priority === "High"
                                        ? "bg-red-500"
                                        : priority === "Medium"
                                        ? "bg-yellow-500"
                                        : "bg-green-500"
                                    }`}
                                  ></span>
                                  {priority}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        {lastSeen && (
                          <span className="text-sm text-slate-500 flex items-center">
                            <Clock size={14} className="mr-1" />
                            Seen: {formatTime(lastSeen)}
                          </span>
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {selectedTicket.topic}
                      </h2>
                      <p className="text-slate-600 leading-relaxed">
                        {selectedTicket.description}
                      </p>
                      {isTicketResolved(selectedTicket) && (
                        <div className="mt-3 flex items-center text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
                          <AlertCircle size={16} className="mr-2" />
                          <span className="font-medium">This ticket is resolved - No changes allowed</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-4">
                    {/* Initial Ticket Message */}
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-2xl p-4 bg-white shadow-sm border border-slate-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <User size={16} className="text-slate-500" />
                          <span className="text-sm font-semibold text-slate-700">Parent</span>
                          <span className="text-xs text-slate-400">
                            {formatTime(selectedTicket.createdAt)}
                          </span>
                        </div>
                        <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                          {selectedTicket.description}
                        </p>
                      </div>
                    </div>

                    {/* Message Thread */}
                    {selectedTicket.messages.map((message, idx) => (
                      <div
                        key={message._id || idx}
                        className={`flex ${
                          isCurrentUser(message.senderId) ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl p-4 ${
                            isCurrentUser(message.senderId)
                              ? "bg-blue-600 text-white shadow-lg"
                              : "bg-white shadow-sm border border-slate-200"
                          } ${message.isLocal ? "opacity-70" : ""}`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {isCurrentUser(message.senderId) ? (
                              <MessageCircle size={16} className="text-blue-200" />
                            ) : (
                              <User size={16} className="text-slate-500" />
                            )}
                            <span
                              className={`text-sm font-semibold ${
                                isCurrentUser(message.senderId) ? "text-blue-200" : "text-slate-700"
                              }`}
                            >
                              {isCurrentUser(message.senderId) ? "You" : "Parent"}
                            </span>
                            <span
                              className={`text-xs ${
                                isCurrentUser(message.senderId) ? "text-blue-200" : "text-slate-400"
                              }`}
                            >
                              {message.time || formatTime(message.createdAt)}
                            </span>
                          </div>
                          <p
                            className={`whitespace-pre-wrap leading-relaxed ${
                              isCurrentUser(message.senderId) ? "text-white" : "text-slate-800"
                            }`}
                          >
                            {message.message}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Rating and Feedback */}
                    {isTicketResolved(selectedTicket) && selectedTicket.chatRating && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                          <div className="flex items-center space-x-2 mb-3">
                            <Star size={16} className="text-green-600" />
                            <span className="text-sm font-semibold text-green-700">Parent Feedback</span>
                          </div>
                          <div className="flex items-center mb-3">
                            <span className="text-sm text-slate-700 mr-3 font-medium">Rating:</span>
                            {renderRatingStars(selectedTicket.chatRating)}
                          </div>
                          {selectedTicket.chatRemarks && (
                            <>
                              <span className="text-sm text-slate-700 font-medium block mb-2">Comments:</span>
                              <p className="text-slate-800 whitespace-pre-wrap leading-relaxed">
                                {selectedTicket.chatRemarks}
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Typing Indicator */}
                    {typingStatus && (
                      <div className="flex justify-start">
                        <div className="max-w-[80%] rounded-2xl p-4 bg-slate-100 border border-slate-200">
                          <p className="text-sm italic text-slate-500 flex items-center">
                            <div className="flex space-x-1 mr-2">
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                            {typingStatus}
                          </p>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-6 bg-white border-t border-slate-200">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <textarea
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all font-medium"
                        rows="3"
                        placeholder={
                          isTicketResolved(selectedTicket)
                            ? "This ticket is resolved. No messages can be sent."
                            : "Type your message..."
                        }
                        value={newMessage}
                        onChange={handleTyping}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={isSending || isTicketResolved(selectedTicket)}
                      />
                      <div className="text-xs text-slate-500 mt-2 px-1">
                        {isTicketResolved(selectedTicket)
                          ? "Ticket is resolved - messaging disabled"
                          : "Press Enter to send, Shift + Enter for new line"}
                      </div>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending || isTicketResolved(selectedTicket)}
                      className="px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-lg hover:shadow-xl font-medium"
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <MessageCircle size={32} className="text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  No Ticket Selected
                </h3>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                  Choose a ticket from the sidebar to start viewing and responding to parent messages
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentTicketList;