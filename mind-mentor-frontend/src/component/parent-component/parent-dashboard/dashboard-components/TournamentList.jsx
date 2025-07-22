import React, { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Trophy,
  Star,
  Gift,
} from "lucide-react";
import { fetchAllTournaments } from "../../../../api/service/employee/EmployeeService";

const TournamentList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllTournaments();
        setTournaments(response);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTotalPrizeAmount = (prizePool) => {
    return prizePool.reduce(
      (total, prize) => total + parseInt(prize.amount),
      0
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-shrink-0 mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Chess Tournaments
        </h1>
        <p className="text-gray-600">
          Join exciting chess competitions and showcase your skills
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-2">
          {tournaments.map((tournament) => (
            <div
              key={tournament._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-blue-200"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-1">
                      {tournament.tournamentName}
                    </h3>
                    <div className="flex items-center gap-2 text-blue-100">
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          tournament.mode === "offline"
                            ? "bg-green-500/20 text-green-100"
                            : "bg-orange-500/20 text-orange-100"
                        }`}
                      >
                        {tournament.mode.charAt(0).toUpperCase() +
                          tournament.mode.slice(1)}
                      </div>
                    </div>
                  </div>
                  <Trophy className="w-8 h-8 text-yellow-300" />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Date and Time */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-3 text-gray-700">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium">
                      {formatDate(tournament.tournamentDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      {formatTime(tournament.time)}
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="mb-4 flex items-start gap-3 text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm leading-relaxed">
                    {tournament.tournamentCentre}
                  </span>
                </div>

                {/* Participants */}
                <div className="mb-4 flex items-center gap-3">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">
                    <span className="font-semibold">
                      {tournament.numberOfParticipants}
                    </span>{" "}
                    participants max
                  </span>
                  <div className="ml-auto">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {tournament.registeredKids?.length || 0}/
                      {tournament.numberOfParticipants}
                    </span>
                  </div>
                </div>

                {/* Registration Fee */}
                <div className="mb-4 flex items-center gap-3">
                  <Gift className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-700">
                    {tournament.hasRegistrationFee ? (
                      <span className="font-semibold">
                        ₹{tournament.registrationFee}
                      </span>
                    ) : (
                      <span className="font-semibold text-green-600">
                        Free Entry
                      </span>
                    )}
                  </span>
                </div>

                {/* Prize Pool */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-yellow-600" />
                    <span className="text-sm font-semibold text-gray-800">
                      Prize Pool
                    </span>
                    <span className="ml-auto text-lg font-bold text-orange-600">
                      ₹
                      {getTotalPrizeAmount(
                        tournament.prizePool
                      ).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {tournament.prizePool.map((prize, index) => (
                      <div key={prize._id} className="text-center">
                        <div
                          className={`w-8 h-8 mx-auto mb-1 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                              ? "bg-gray-400"
                              : "bg-orange-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <div className="text-xs text-gray-600">
                          ₹{parseInt(prize.amount).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Register Now
                </button> */}
              </div>
            </div>
          ))}
        </div>

        {tournaments.length === 0 && !loading && (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Tournaments Available
            </h3>
            <p className="text-gray-500">
              Check back later for upcoming chess tournaments!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TournamentList;
