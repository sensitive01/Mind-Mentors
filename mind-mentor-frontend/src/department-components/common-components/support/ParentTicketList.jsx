import React, { useEffect, useState, useRef } from "react";
import { Filter, Search, Send, ChevronDown } from "lucide-react";
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
  }, [selectedTicket?.messages]);

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

    socket.emit("joinRoom", { userId: empId });
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typingStatus", handleTypingStatus);
    socket.on("seenStatus", handleSeenStatus);
    socket.on("priorityUpdated", handlePriorityUpdate);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typingStatus", handleTypingStatus);
      socket.off("seenStatus", handleSeenStatus);
      socket.off("priorityUpdated", handlePriorityUpdate);
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
      userName: "Employeee",
      userId: empId,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        ticketId: selectedTicket._id,
        isTyping: false,
        userName: "Emploeee",
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

    // setSelectedTicket((prev) => ({
    //   ...prev,
    //   messages: [...prev.messages, tempMessage],
    // }));

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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex h-[calc(100vh-2rem)]">
          <div className="w-80 border-r border-gray-200 flex flex-col bg-white">
            <div className="p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900 mb-4">
                Parent Support Tickets
              </h1>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="relative">
                    <button
                      onClick={() => setShowFilterOptions(!showFilterOptions)}
                      className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Filter size={14} />
                      <span className="text-sm">Filter</span>
                    </button>
                    {showFilterOptions && (
                      <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10 border border-gray-200">
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
                            className="w-full px-4 py-2 text-left hover:bg-gray-50 capitalize text-sm transition-colors"
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

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
                    className={`px-3 py-2 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all
                  ${
                    selectedTicket?._id === ticket._id
                      ? "bg-blue-50 border-l-4 border-l-blue-600"
                      : ""
                  }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 text-xs mb-0.5">
                          {ticket.ticketId}
                        </h3>
                        <p className="text-xs text-gray-800 mb-0.5 truncate font-medium">
                          {ticket.topic}
                        </p>
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {ticket.description}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-0.5 ml-2">
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded text-xs ${getStatusColor(
                            ticket.status
                          )}`}
                        >
                          {ticket.status}
                        </span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded text-xs ${getBadgeColor(
                            ticket.priority
                          )}`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                    </div>

                    {ticket.messages.length > 0 && (
                      <div className="mt-1 pt-1 border-t border-gray-100">
                        <p className="text-xs text-gray-600 line-clamp-1 mb-0.5">
                          {ticket.messages[ticket.messages.length - 1].message}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>{formatDate(ticket.createdAt)}</span>
                          <span>
                            {formatTime(
                              ticket.messages[ticket.messages.length - 1]
                                .createdAt
                            )}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedTicket ? (
              <>
                <div className="p-6 bg-white border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h2 className="text-xl font-bold text-gray-900 mb-2">
                        {selectedTicket.topic}
                      </h2>
                      <p className="text-sm text-gray-600 mb-4">
                        {selectedTicket.description}
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 font-medium">
                          #{selectedTicket.ticketId}
                        </span>
                        <span
                          className={`text-xs px-3 py-1 rounded-full ${getStatusColor(
                            selectedTicket.status
                          )}`}
                        >
                          {selectedTicket.status}
                        </span>
                        <div className="relative" ref={priorityDropdownRef}>
                          <button
                            onClick={() => {
                              if (
                                !isTicketResolved(selectedTicket) &&
                                !isUpdatingPriority
                              ) {
                                setShowPriorityDropdown(!showPriorityDropdown);
                              }
                            }}
                            disabled={
                              isTicketResolved(selectedTicket) ||
                              isUpdatingPriority
                            }
                            className={`text-xs px-3 py-1 rounded-full flex items-center transition-all ${getBadgeColor(
                              selectedTicket.priority
                            )} ${
                              isTicketResolved(selectedTicket)
                                ? "opacity-50 cursor-not-allowed"
                                : "cursor-pointer hover:shadow-md"
                            } ${isUpdatingPriority ? "opacity-70" : ""}`}
                          >
                            {isUpdatingPriority ? (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-1"></div>
                            ) : null}
                            {selectedTicket.priority}
                            {!isTicketResolved(selectedTicket) &&
                              !isUpdatingPriority && (
                                <ChevronDown className="ml-1 w-3 h-3" />
                              )}
                          </button>
                          {showPriorityDropdown &&
                            !isTicketResolved(selectedTicket) && (
                              <div className="absolute z-10 mt-1 w-32 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                {["High", "Medium", "Low"].map((priority) => (
                                  <button
                                    key={priority}
                                    onClick={() => updatePriority(priority)}
                                    disabled={isUpdatingPriority}
                                    className={`w-full text-left px-4 py-2 text-xs hover:bg-gray-50 flex items-center transition-colors ${
                                      selectedTicket.priority === priority
                                        ? "bg-blue-50 text-blue-600"
                                        : ""
                                    } ${
                                      isUpdatingPriority
                                        ? "opacity-50 cursor-not-allowed"
                                        : "cursor-pointer"
                                    }`}
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full mr-2 ${
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
                        {isTicketResolved(selectedTicket) && (
                          <span className="text-xs text-gray-500 italic">
                            (Resolved - No changes allowed)
                          </span>
                        )}
                        {lastSeen && (
                          <span className="text-xs text-gray-500">
                            Seen: {formatTime(lastSeen)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-3">
                    <div className="flex justify-start">
                      <div className="max-w-[75%] rounded-lg p-3 bg-white shadow-sm border border-gray-200">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 mb-1 font-medium">
                            Parent
                          </span>
                          <p className="text-sm text-gray-800 whitespace-pre-wrap">
                            {selectedTicket.description}
                          </p>
                          <span className="text-xs text-gray-400 mt-2">
                            {formatTime(selectedTicket.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedTicket.messages.map((message, idx) => (
                      <div
                        key={message._id || idx}
                        className={`flex ${
                          isCurrentUser(message.senderId)
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-lg p-3 ${
                            isCurrentUser(message.senderId)
                              ? "bg-blue-600 text-white"
                              : "bg-white shadow-sm border border-gray-200"
                          } ${message.isLocal ? "opacity-70" : ""}`}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`text-xs ${
                                isCurrentUser(message.senderId)
                                  ? "text-blue-200"
                                  : "text-gray-500"
                              } mb-1 font-medium`}
                            >
                              {isCurrentUser(message.senderId)
                                ? "You"
                                : "Parent"}
                            </span>
                            <p
                              className={`text-sm whitespace-pre-wrap ${
                                isCurrentUser(message.senderId)
                                  ? "text-white"
                                  : "text-gray-800"
                              }`}
                            >
                              {message.message}
                            </p>
                            <span
                              className={`text-xs ${
                                isCurrentUser(message.senderId)
                                  ? "text-blue-200"
                                  : "text-gray-400"
                              } mt-2 flex items-center justify-end`}
                            >
                              {message.time || formatTime(message.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {typingStatus && (
                      <div className="flex justify-start">
                        <div className="max-w-[75%] rounded-lg p-3 bg-white shadow-sm border border-gray-200">
                          <p className="text-xs italic text-gray-500">
                            {typingStatus}
                          </p>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="flex items-end space-x-3">
                    <div className="flex-1">
                      <textarea
                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm"
                        rows="2"
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
                      <div className="text-xs text-gray-500 mt-1">
                        {isTicketResolved(selectedTicket)
                          ? "Ticket is resolved - messaging disabled"
                          : "Press Enter to send, Shift + Enter for new line"}
                      </div>
                    </div>
                    <button
                      onClick={sendMessage}
                      disabled={
                        !newMessage.trim() ||
                        isSending ||
                        isTicketResolved(selectedTicket)
                      }
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Send size={28} className="text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  No Ticket Selected
                </h3>
                <p className="text-gray-500 text-lg">
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
