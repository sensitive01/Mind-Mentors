import React, { useEffect, useState } from "react";
import { Trash, Plus } from "lucide-react";
import { addNewTournamentData } from "../../../api/service/employee/EmployeeService";
import { useNavigate } from "react-router-dom";
import { getAllPhysicalcenters } from "../../../api/service/employee/hrService";

const TournamentForm = () => {
  const navigate = useNavigate();
  const [physicalCenters, setPhysicalCenters] = useState([]);
  const [tournament, setTournament] = useState({
    tournamentName: "",
    mode: "online", // 'online' or 'offline'
    centreName: "",
    centerId: "",
    date: "",
    time: "",
    hasRegistrationFee: false,
    registrationFeeAmount: "",
    instructions: "",
    numberOfParticipants: "",
    prizePool: [
      { position: "1st", amount: "" },
      { position: "2nd", amount: "" },
      { position: "3rd", amount: "" },
    ],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllPhysicalcenters();
        if (response.status === 200) {
          setPhysicalCenters(response.data.physicalCenter);
        }
      } catch (error) {
        console.error("Error fetching physical centers:", error);
      }
    };
    fetchData();
  }, []);

  const handleTournamentChange = (field, value) => {
    setTournament((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // Clear centre name and id if switching to online
      if (field === "mode" && value === "online") {
        updated.centreName = "";
        updated.centerId = "";
      }

      // Clear registration fee amount if unchecking fee checkbox
      if (field === "hasRegistrationFee" && !value) {
        updated.registrationFeeAmount = "";
      }

      return updated;
    });
  };

  const handlePrizePoolChange = (prizeIndex, field, value) => {
    setTournament((prev) => ({
      ...prev,
      prizePool: prev.prizePool.map((prize, index) =>
        index === prizeIndex ? { ...prize, [field]: value } : prize
      ),
    }));
  };

  const addPrizePosition = () => {
    setTournament((prev) => ({
      ...prev,
      prizePool: [...prev.prizePool, { position: "", amount: "" }],
    }));
  };

  const removePrizePosition = (prizeIndex) => {
    setTournament((prev) => ({
      ...prev,
      prizePool: prev.prizePool.filter((_, index) => index !== prizeIndex),
    }));
  };

  const handleCenterChange = (centerId) => {
    const selectedCenter = physicalCenters.find(
      (center) => center._id === centerId
    );

    setTournament((prev) => ({
      ...prev,
      centerId: centerId,
      centreName: selectedCenter ? selectedCenter.centerName : "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Submitting tournament:", tournament);
      // Since you're submitting only one tournament, wrap it in an array if the API expects an array
      const response = await addNewTournamentData([tournament]);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert("Tournament submitted successfully!");
    } catch (error) {
      console.error("Error submitting tournament:", error);
      alert("Error submitting tournament");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTournament({
      tournamentName: "",
      mode: "online",
      centreName: "",
      centerId: "",
      date: "",
      time: "",
      hasRegistrationFee: false,
      registrationFeeAmount: "",
      instructions: "",
      numberOfParticipants: "",
      prizePool: [
        { position: "1st", amount: "" },
        { position: "2nd", amount: "" },
        { position: "3rd", amount: "" },
      ],
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold mb-2">Chess Tournament Form</h2>
              <p className="text-sm opacity-90">
                Create and manage your chess tournament
              </p>
            </div>
            <button
              className="bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-colors"
              onClick={() => navigate("/super-admin/department/tournaments")}
            >
              View Tournaments
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="text-purple-700 font-semibold text-lg pb-2 border-b-2 border-purple-700">
                Tournament Details
              </h3>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-medium text-purple-700">
                  Tournament Information
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tournament Name */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tournament Name *
                  </label>
                  <input
                    type="text"
                    value={tournament.tournamentName}
                    onChange={(e) =>
                      handleTournamentChange("tournamentName", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter tournament name"
                    required
                  />
                </div>

                {/* Mode Selection - Radio Buttons */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Tournament Mode *
                  </label>
                  <div className="flex space-x-6">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mode"
                        value="online"
                        checked={tournament.mode === "online"}
                        onChange={(e) =>
                          handleTournamentChange("mode", e.target.value)
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Online</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="mode"
                        value="offline"
                        checked={tournament.mode === "offline"}
                        onChange={(e) =>
                          handleTournamentChange("mode", e.target.value)
                        }
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Offline
                      </span>
                    </label>
                  </div>
                </div>

                {/* Physical Center Selection - Only show if offline */}
                {tournament.mode === "offline" && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Physical Center *
                    </label>
                    <select
                      value={tournament.centerId}
                      onChange={(e) => handleCenterChange(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      required={tournament.mode === "offline"}
                    >
                      <option value="">Select a physical center</option>
                      {physicalCenters
                        .filter((center) => center.centerType === "offline")
                        .map((center) => (
                          <option key={center._id} value={center._id}>
                            {center.centerName}
                          </option>
                        ))}
                    </select>
                    {tournament.centreName && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {tournament.centreName}
                      </p>
                    )}
                  </div>
                )}

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    value={tournament.date}
                    onChange={(e) =>
                      handleTournamentChange("date", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time *
                  </label>
                  <input
                    type="time"
                    value={tournament.time}
                    onChange={(e) =>
                      handleTournamentChange("time", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>

                {/* Number of Participants */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Participants *
                  </label>
                  <input
                    type="number"
                    value={tournament.numberOfParticipants}
                    onChange={(e) =>
                      handleTournamentChange(
                        "numberOfParticipants",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter number of participants"
                    min="1"
                    required
                  />
                </div>

                {/* Registration Fee Checkbox */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={tournament.hasRegistrationFee}
                      onChange={(e) =>
                        handleTournamentChange(
                          "hasRegistrationFee",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Has Registration Fee
                    </span>
                  </label>
                </div>

                {/* Registration Fee Amount - Only show if checkbox is checked */}
                {tournament.hasRegistrationFee && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Fee Amount *
                    </label>
                    <input
                      type="number"
                      value={tournament.registrationFeeAmount}
                      onChange={(e) =>
                        handleTournamentChange(
                          "registrationFeeAmount",
                          e.target.value
                        )
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="Enter amount"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                )}

                {/* Prize Pool Section */}
                <div className="md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Prize Pool
                    </label>
                    <button
                      type="button"
                      onClick={addPrizePosition}
                      className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 text-sm"
                    >
                      <Plus className="h-4 w-4" />
                      <span>Add Position</span>
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tournament.prizePool.map((prize, prizeIndex) => (
                      <div
                        key={prizeIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-1">
                          <input
                            type="text"
                            value={prize.position}
                            onChange={(e) =>
                              handlePrizePoolChange(
                                prizeIndex,
                                "position",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Position (e.g., 1st, 2nd)"
                          />
                        </div>
                        <div className="flex-1">
                          <input
                            type="number"
                            value={prize.amount}
                            onChange={(e) =>
                              handlePrizePoolChange(
                                prizeIndex,
                                "amount",
                                e.target.value
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Prize amount"
                            min="0"
                            step="0.01"
                          />
                        </div>
                        {tournament.prizePool.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePrizePosition(prizeIndex)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instructions
                  </label>
                  <textarea
                    value={tournament.instructions}
                    onChange={(e) =>
                      handleTournamentChange("instructions", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter tournament instructions (optional)"
                    rows="3"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 mt-12 pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
            >
              {loading ? "Submitting..." : "Submit Tournament"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-8 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors shadow-lg hover:shadow-xl"
            >
              Clear Form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TournamentForm;
