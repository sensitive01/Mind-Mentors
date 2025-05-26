import React, { useState, useEffect } from "react";
import { Users, Activity, Clock, FileText, Download } from "lucide-react";
import { getLearningDashboardAttandanceData } from "../../api/service/employee/EmployeeService";

// Mock API data based on your backend response
const mockApiData = {
  intId: "c0578564c0a85923306ae5074e0d2e718ef4b7f2-1748253349533",
  extId: "class-1nps8qfl",
  name: "Check For Statistic Data",
  downloadSessionDataEnabled: true,
  other: {
    "learning-dashboard-learn-more-link": "",
    "learning-dashboard-feedback-link": "",
  },
  users: {
    "w_kdixpypu3oir-1": {
      userKey: "w_kdixpypu3oir-1",
      extId: "w_kdixpypu3oir",
      intIds: {
        w_kdixpypu3oir: {
          intId: "w_kdixpypu3oir",
          sessions: [
            {
              registeredOn: 1748253355951,
              leftOn: 1748254038352,
            },
          ],
          userLeftFlag: false,
        },
      },
      name: "Aswinraj",
      isModerator: true,
      isDialIn: false,
      answers: {},
      genericData: {},
      talk: {
        totalTime: 0,
        lastTalkStartedOn: 0,
      },
      reactions: [],
      raiseHand: [],
      away: [],
      webcams: [],
      totalOfMessages: 0,
    },
    "w_ybvsheiebbni-1": {
      userKey: "w_ybvsheiebbni-1",
      extId: "w_ybvsheiebbni",
      intIds: {
        w_ybvsheiebbni: {
          intId: "w_ybvsheiebbni",
          sessions: [
            {
              registeredOn: 1748253372822,
              leftOn: 1748254038352,
            },
          ],
          userLeftFlag: false,
        },
      },
      name: "Kid",
      isModerator: false,
      isDialIn: false,
      answers: {},
      genericData: {},
      talk: {
        totalTime: 0,
        lastTalkStartedOn: 0,
      },
      reactions: [],
      raiseHand: [],
      away: [],
      webcams: [],
      totalOfMessages: 0,
    },
  },
  genericDataTitles: [],
  polls: {},
  screenshares: [],
  presentationSlides: [],
  createdOn: 1748253349764,
  endedOn: 1748254038352,
};

const LearningAnalyticsDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const internalId = "389e992c4d06698e9a8d4fbd33381b0285955530-1748258758398";

  useEffect(() => {
    const fetchData = async () => {
      const response = await getLearningDashboardAttandanceData(internalId);
      console.log("response", response);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setData(mockApiData);
      setLoading(false);
    }, 1000);
  }, []);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const calculateDuration = (start, end) => {
    const duration = Math.floor((end - start) / 1000);
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateOnlineTime = (user) => {
    const sessions = Object.values(user.intIds);
    if (sessions.length === 0) return "00:00";

    const session = sessions[0].sessions[0];
    return calculateDuration(session.registeredOn, session.leftOn);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const users = Object.values(data.users);
  const totalUsers = users.length;
  const totalPolls = Object.keys(data.polls).length;
  const sessionDuration = calculateDuration(data.createdOn, data.endedOn);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Learning Analytics Dashboard
            </h1>
            <p className="text-gray-600">{data.name}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">
              {formatTime(data.endedOn)}{" "}
              <span className="text-red-600 font-medium">Ended</span>
            </div>
            <div className="text-sm text-gray-500">
              Duration: {sessionDuration}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border-l-4 border-pink-500 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
                <p className="text-sm text-gray-600">Total Number Of Users</p>
              </div>
              <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border-l-4 border-green-500 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Activity Score</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-2xl font-bold text-gray-900">0</p>
                <p className="text-sm text-gray-600">Timeline</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border-l-4 border-purple-500 p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalPolls}</p>
                <p className="text-sm text-gray-600">Polls</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Overview Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    USER ↑
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ONLINE TIME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    TALK TIME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WEBCAM TIME
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    MESSAGES
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    REACTIONS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    RAISE HANDS
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ACTIVITY SCORE
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    STATUS
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => {
                  const session = Object.values(user.intIds)[0]?.sessions[0];
                  const onlineTime = calculateOnlineTime(user);

                  return (
                    <tr key={user.userKey} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                            <Users className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              📅 {formatTime(session?.registeredOn)}
                            </div>
                            <div className="text-xs text-gray-500">
                              📅 {formatTime(session?.leftOn)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <span className="text-sm text-gray-900 mr-2">
                            🔊 {onlineTime}
                          </span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: "80%" }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">-</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">-</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {user.totalOfMessages}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {user.reactions.length}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-1 mr-2">
                            <div
                              className="bg-gray-400 h-1 rounded-full"
                              style={{ width: "0%" }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-500">0</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500">N/A</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                          Offline
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-6 text-sm text-gray-500">
          <div>Last updated at {formatTime(data.endedOn)}</div>
          {data.downloadSessionDataEnabled && (
            <button className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <Download size={16} />
              Download Session Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearningAnalyticsDashboard;
