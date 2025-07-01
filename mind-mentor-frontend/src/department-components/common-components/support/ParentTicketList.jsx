import React, { useEffect, useState, useRef } from "react";
import { Clock, Filter, Plus, Search, Send, Paperclip, X } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchParentTikets, reponseToTickets } from "../../../api/service/employee/EmployeeService";

const ParentTicketList = () => {
    const empId = localStorage.getItem("empId")
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

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

  useEffect(() => {
    const fetchChats = async () => {
      setIsLoading(true);
      try {
        if (!empId) {
          console.error("Employee ID not found");
          return;
        }
        const response = await fetchParentTikets();
    

        if (response.status===200) {
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
  };

  const formatTime = (timeString) => {
    // Handle null, undefined, or non-string values
    if (!timeString) {
      return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      }).format(new Date());
    }

    // If it's already a formatted string with am/pm, return as is
    if (typeof timeString === "string" && (timeString.includes("pm") || timeString.includes("am"))) {
      return timeString;
    }

    // Convert to Date object and format
    const date = new Date(timeString);
    
    // Check if date is valid
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
    
    // Create the new message object
    const newMessageObj = {
      senderId: empId,
      message: newMessage.trim(),
      time: formatTime(new Date()),
    };

    // Clear the input immediately for better UX
    const messageToSend = newMessage.trim();
    setNewMessage("");

    try {
      const response = await reponseToTickets(messageToSend, selectedTicket._id, empId);
      
      if (response.status === 200) {
        // Update the selected ticket with the new message
        setSelectedTicket((prevTicket) => ({
          ...prevTicket,
          messages: [...prevTicket.messages, newMessageObj],
        }));

        // Also update the ticket in the main tickets array
        setTickets((prevTickets) =>
          prevTickets.map((ticket) =>
            ticket._id === selectedTicket._id
              ? { ...ticket, messages: [...ticket.messages, newMessageObj] }
              : ticket
          )
        );
      } else {
        // If the API call fails, restore the message in the input
        setNewMessage(messageToSend);
        console.error("Failed to send message");
      }
    } catch (error) {
      // If there's an error, restore the message in the input
      setNewMessage(messageToSend);
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-[1600px] mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="flex h-[calc(100vh-2rem)]">
          {/* Sidebar */}
          <div className="w-96 border-r flex flex-col bg-white">
            {/* Header */}
            <div className="p-4 border-b">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Parent Support Tickets
              </h1>

              {/* Search and Filter */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterOptions(!showFilterOptions)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                    >
                      <Filter size={16} />
                      <span>Filter</span>
                    </button>
                    {showFilterOptions && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border">
                        {[
                          "all",
                          "open",
                          "in-progress",
                          "resolved",
                          "pending",
                        ].map((filter) => (
                          <button
                            key={filter}
                            onClick={() => {
                              setActiveFilter(filter);
                              setShowFilterOptions(false);
                            }}
                            className="w-full px-4 py-2 text-left hover:bg-gray-100 capitalize"
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/operation/department/support/add"
                    className="flex items-center space-x-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    <Plus size={16} />
                    <span>New Ticket</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Ticket List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              ) : (
                filteredTickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    onClick={() => handleTicketClick(ticket)}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer transition-all
                      ${
                        selectedTicket?._id === ticket._id
                          ? "bg-purple-50 border-l-4 border-l-purple-600"
                          : ""
                      }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 text-sm">
                          {ticket.ticketId}
                        </h3>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          {ticket.topic}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span
                          className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    {ticket.messages.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {ticket.messages[ticket.messages.length - 1].message}
                        </p>
                        <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                          <span>{formatDate(ticket.createdAt)}</span>
                          <span>
                            {ticket.messages[ticket.messages.length - 1].time}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedTicket ? (
              <>
                {/* Chat Header */}
                <div className="p-6 bg-white border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 mb-1">
                        {selectedTicket.topic}
                      </h2>
                      <p className="text-sm text-gray-600 mb-2">
                        {selectedTicket.description}
                      </p>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm text-gray-500">
                          #{selectedTicket.ticketId}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                            selectedTicket.status
                          )}`}
                        >
                          {selectedTicket.status}
                        </span>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getBadgeColor(
                            selectedTicket.priority
                          )}`}
                        >
                          {selectedTicket.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    {selectedTicket.messages.map((message, idx) => (
                      <div
                        key={idx}
                        className={`flex ${
                          isCurrentUser(message.senderId)
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-md rounded-lg p-4 ${
                            isCurrentUser(message.senderId)
                              ? "bg-purple-600 text-white"
                              : "bg-white shadow-sm border"
                          }`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`text-xs ${
                                isCurrentUser(message.senderId)
                                  ? "text-purple-200"
                                  : "text-gray-500"
                              } mb-1`}
                            >
                              {isCurrentUser(message.senderId)
                                ? "You"
                                : "Parent"}
                            </span>
                            <p className="text-sm whitespace-pre-wrap">
                              {message.message}
                            </p>
                            <span
                              className={`text-xs ${
                                isCurrentUser(message.senderId)
                                  ? "text-purple-200"
                                  : "text-gray-500"
                              } mt-2`}
                            >
                              {message.time}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t">
                  <div className="flex items-end space-x-2">
                    <div className="flex-1">
                      <textarea
                        className="w-full p-3 bg-gray-50 border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        rows="3"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        disabled={isSending}
                      />
                      <div className="text-xs text-gray-500 mt-1">
                        Press Enter to send, Shift + Enter for new line
                      </div>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className="px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Send size={24} className="text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Ticket Selected
                </h3>
                <p className="text-gray-500">
                  Choose a ticket from the sidebar to start messaging
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