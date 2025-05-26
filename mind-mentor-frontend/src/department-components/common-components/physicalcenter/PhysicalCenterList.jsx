import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronDown, ChevronUp, Clock, ArrowLeft } from "lucide-react";
import {
  deletePhysicalCenters,
  fetchPhycicalCenterData,
} from "../../../api/service/employee/EmployeeService";

const ImageDisplay = ({ images = [], centerName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative h-56 bg-gray-100 overflow-hidden">
      {images.map((img, idx) => (
        <img
          key={idx}
          src={img}
          alt={`${centerName} - View ${idx + 1}`}
          className={`absolute w-full h-full object-cover transition-opacity duration-1000 ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                idx === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/60 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const BusinessHoursDisplay = ({ businessHours }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (time) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${suffix}`;
  };

  return (
    <div className="border-t pt-4 mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-gray-700 font-medium"
      >
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-gray-500" />
          <span>Business Hours</span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-2 text-sm text-gray-600">
          {businessHours.map((day, idx) => (
            <div key={idx} className="flex justify-between">
              <span className={day.isClosed ? "text-red-500" : ""}>
                {day.day}:
              </span>
              <span>
                {day.isClosed ? (
                  <span className="text-red-500">Closed</span>
                ) : day.is24Hours ? (
                  <span className="text-green-600">Open 24 Hours</span>
                ) : (
                  <span>
                    {day.periods.map((period, pidx) => (
                      <span key={pidx}>
                        {pidx > 0 && ", "}
                        {formatTime(period.openTime)} -{" "}
                        {formatTime(period.closeTime)}
                      </span>
                    ))}
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProgramLevelsDisplay = ({ programLevels }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t pt-4 mt-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left text-gray-700 font-medium"
      >
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span>Program Levels ({programLevels.length})</span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-gray-500" />
        ) : (
          <ChevronDown size={18} className="text-gray-500" />
        )}
      </button>

      {isOpen && (
        <div className="mt-3 space-y-3 text-sm">
          {programLevels.map((program, idx) => (
            <div key={idx} className="border-l-2 border-primary pl-3">
              <div className="font-medium text-gray-700">
                Program:<span className="font-bold"> {program.program}</span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {program.levels.map((level, lidx) => (
                  <span
                    key={lidx}
                    className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full text-xs"
                  >
                    {level}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CenterTypeTag = ({ type }) => {
  const bgColor = type === "online" ? "bg-green-100" : "bg-blue-100";
  const textColor = type === "online" ? "text-green-700" : "text-blue-700";

  return (
    <span
      className={`${bgColor} ${textColor} px-2 py-1 rounded-full text-xs font-medium`}
    >
      {type === "online" ? "Online" : "Offline"}
    </span>
  );
};

// Delete confirmation modal component
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  centerName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{centerName}</span>? This action
          cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ChessCenterCard = ({ center, onDelete }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    navigate(`/super-admin/department/edit-physical-center/${center._id}`, {
      state: { centerData: center },
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await deletePhysicalCenters(center._id);
      setShowDeleteConfirm(false);
      onDelete(center._id);
    } catch (error) {
      console.error("Error deleting center:", error);
      alert("Failed to delete center. Please try again.");
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <ImageDisplay images={center.photos} centerName={center.centerName} />

        <div className="p-5">
          <div className="border-b pb-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold text-primary">
                {center.centerName}
              </h2>
              <CenterTypeTag type={center.centerType} />
            </div>
          </div>

          {center.centerType === "offline" && center.address && (
            <div className="py-4 border-b">
              <div className="flex items-start gap-2 text-gray-600 mb-2">
                <svg
                  className="w-5 h-5 mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p>{center.address}</p>
                  {center.city && center.state && center.pincode && (
                    <p>
                      {center.city}, {center.state} - {center.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <div className="space-y-1">
              {center.email && (
                <a
                  href={`mailto:${center.email}`}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  {center.email}
                </a>
              )}
              {center.phoneNumber && (
                <a
                  href={`tel:${center.phoneNumber}`}
                  className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  {center.phoneNumber}
                </a>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleEdit}
                className="p-2 text-primary hover:bg-blue-50 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
              <button
                onClick={handleDeleteClick}
                className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </div>

          {center.businessHours && center.businessHours.length > 0 && (
            <BusinessHoursDisplay businessHours={center.businessHours} />
          )}

          {center.programLevels && center.programLevels.length > 0 && (
            <ProgramLevelsDisplay programLevels={center.programLevels} />
          )}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        centerName={center.centerName}
      />
    </>
  );
};

const ChessCentersList = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [physicalCenters, setPhysicalCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [centerTypeFilter, setCenterTypeFilter] = useState("all");

  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await fetchPhycicalCenterData();
      if (response.status === 200) {
        setPhysicalCenters(response.data.physicalCenters);
      } else {
        setError(response.message || "Failed to fetch centers");
      }
    } catch (err) {
      setError("Error fetching centers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (centerId) => {
    setPhysicalCenters((centers) =>
      centers.filter((center) => center._id !== centerId)
    );
  };

  const filteredCenters = physicalCenters.filter((center) => {
    const matchesSearch = center.centerName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      centerTypeFilter === "all" || center.centerType === centerTypeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-gray-600">Loading centers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6 flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">
            Chess Training Centers
          </h1>
        </div>
        <div className="flex gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <input
              type="text"
              placeholder="Search centers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={centerTypeFilter}
            onChange={(e) => setCenterTypeFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <option value="all">All Types</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>

          <button
            onClick={() =>
              navigate("/super-admin/department/add-physical-center")
            }
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors"
          >
            <Plus size={20} />
            <span>Add Center</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.length > 0 ? (
          filteredCenters.map((center) => (
            <ChessCenterCard
              key={center._id}
              center={center}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <div className="col-span-3 py-8 text-center text-gray-500">
            No centers found matching your search criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default ChessCentersList;
