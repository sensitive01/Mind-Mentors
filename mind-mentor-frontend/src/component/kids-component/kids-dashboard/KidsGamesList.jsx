import React, { useEffect, useState } from "react";
import {
  Gamepad2,
  Puzzle,
  Rocket,
  PawPrint,
  Brain,
  Trophy,
  Lock,
  Unlock,
  Calendar,
  MapPin,
  Clock,
} from "lucide-react";
import { fetchAllTournaments } from "../../../api/service/employee/EmployeeService";

const KidsGamesList = () => {
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Uncomment this when you want to use real API
        const response = await fetchAllTournaments();
        console.log(response);
        setTournaments(response);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch tournaments:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRegister = (tournament) => {
    console.log("Registering for tournament:", tournament.tournamentName);
    // Add your registration logic here
    // You can navigate to registration form or show a modal
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/90 to-primary/70 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 animate-bounce drop-shadow-lg">
            🎮 Kids Game Zone 🧩
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow">
            Exciting educational games that make learning fun and challenging!
          </p>
        </div>

        {/* Tournaments Section */}
        {tournaments.length > 0 && (
          <div className="mb-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournaments.map((tournament) => (
                <div
                  key={tournament._id}
                  className="bg-white/95 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold text-orange-800 mb-2">
                      {tournament.tournamentName}
                    </h3>
                    <div className="w-16 h-1 bg-orange-500 mx-auto rounded"></div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-orange-600" />
                      <span className="font-medium">
                        {formatDate(tournament.tournamentDate)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-orange-600" />
                      <span className="font-medium">{tournament.time}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-orange-600" />
                      <span className="font-medium capitalize">
                        {tournament.mode}
                      </span>
                    </div>
                    {tournament.tournamentCentre && (
                      <div className="text-sm text-gray-600 mt-2 pl-8">
                        📍 {tournament.tournamentCentre}
                      </div>
                    )}
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        Registration Fee:
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-bold ${
                          tournament.hasRegistrationFee
                            ? "bg-orange-100 text-orange-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {tournament.hasRegistrationFee
                          ? `₹${tournament.registrationFee}`
                          : "Free"}
                      </span>
                    </div>

                    <button
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:from-orange-600 hover:to-orange-700 transform active:scale-95 transition-all duration-200 shadow-lg"
                      onClick={() => handleRegister(tournament)}
                    >
                      🎯 Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white text-center mb-8 drop-shadow-lg">
              🏆 Loading Tournaments...
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white/95 rounded-2xl p-6 shadow-xl animate-pulse"
                >
                  <div className="h-8 bg-orange-200 rounded mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-orange-100 rounded"></div>
                    <div className="h-4 bg-orange-100 rounded"></div>
                    <div className="h-4 bg-orange-100 rounded"></div>
                  </div>
                  <div className="mt-6 h-12 bg-orange-300 rounded-xl"></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tournaments.length === 0 && !loading && (
          <div className="text-center bg-white/95 rounded-2xl p-12 shadow-xl">
            <h2 className="text-3xl font-bold text-orange-600 mb-4">
              🎯 No Tournaments Available
            </h2>
            <p className="text-gray-600 text-lg">
              Check back soon for exciting tournaments!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KidsGamesList;
