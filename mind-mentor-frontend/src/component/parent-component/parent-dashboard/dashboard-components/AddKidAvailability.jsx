import React, { useEffect, useState } from "react";
import { Calendar, Edit3, Pause, Play, Plus, Trash2, X } from "lucide-react";
import { useParams } from "react-router-dom";
import {
  addKidAvailabilities,
  deleteKidAvailability,
  fetchAllAvailabileDays,
  pauseKidAvailability,
  updateKidAvailability,
} from "../../../../api/service/parent/ParentService";
import { toast, ToastContainer } from "react-toastify";

const KidsAvailability = () => {
  const { kidId } = useParams();
  const [isAddAvailabilityModalOpen, setIsAddAvailabilityModalOpen] =
    useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState(null);
  const [availabilities, setAvailabilities] = useState([]);
  const [newAvailability, setNewAvailability] = useState({
    day: "Monday",
    availableFrom: "",
    availableTo: "",
  });

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const response = await fetchAllAvailabileDays(kidId);
        if (response.status === 200) {
          setAvailabilities(response.data.KidAvailableData);
        }
      } catch (error) {
        console.error("Error fetching availabilities:", error);
        alert("Failed to fetch availabilities");
      }
    };
    fetchAvailabilities();
  }, [kidId]);

  const handleAddOrEditAvailability = async () => {
    if (!newAvailability.availableFrom || !newAvailability.availableTo) {
      alert("Please select both 'From' and 'To' times");
      return;
    }

    const fromTime = new Date(`2000-01-01T${newAvailability.availableFrom}`);
    const toTime = new Date(`2000-01-01T${newAvailability.availableTo}`);

    if (toTime <= fromTime) {
      alert("'To' time must be after 'From' time");
      return;
    }

    try {
      if (selectedAvailability) {
        const updatedAvailability = {
          ...selectedAvailability,
          day: newAvailability.day,
          availableFrom: newAvailability.availableFrom,
          availableTo: newAvailability.availableTo,
        };

        console.log("Update availability", updatedAvailability);

        const response = await updateKidAvailability(updatedAvailability);
        console.log(response);

        setAvailabilities(
          availabilities.map((avail) =>
            avail._id === selectedAvailability._id ? updatedAvailability : avail
          )
        );
        toast.success(response.data.message)
      } else {
        const newEntry = {
          ...newAvailability,
          status: "Active",
        };

        const response = await addKidAvailabilities(kidId, newEntry);

        setAvailabilities([...availabilities, response.data]);
        toast.success(response.data.message)

      }

      setNewAvailability({ day: "Monday", availableFrom: "", availableTo: "" });
      setIsAddAvailabilityModalOpen(false);
      setSelectedAvailability(null);
    } catch (error) {
      console.error("Error saving availability:", error);
      alert("Failed to save availability. Please try again.");
    }
  };

  const toggleAvailabilityStatus = async (availability) => {
    try {
      const newStatus = availability.status === "Active" ? "Paused" : "Active";

      
      // Update local state
      setAvailabilities(
        availabilities.map((avail) =>
          avail._id === availability._id
        ? { ...avail, status: newStatus }
        : avail
      )
    );
    const response = await pauseKidAvailability(availability._id, newStatus);
    if(response.status===200){
      toast.success(response.data.message)
    }
    } catch (error) {
      console.error("Error toggling availability status:", error);
      alert("Failed to update availability status. Please try again.");
    }
  };

  const deleteAvailability = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this availability?"
    );

    if (confirmDelete) {
      try {
        await deleteKidAvailability(id);

        setAvailabilities(availabilities.filter((avail) => avail._id !== id));
      } catch (error) {
        console.error("Error deleting availability:", error);
        alert("Failed to delete availability. Please try again.");
      }
    }
  };

  const openEditModal = (availability) => {
    setSelectedAvailability(availability);
    setNewAvailability({
      day: availability.day,
      availableFrom: availability.availableFrom,
      availableTo: availability.availableTo,
    });
    setIsAddAvailabilityModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <Calendar className="mr-3 text-primary" size={32} />
              Availability Management
            </h1>
            <p className="text-gray-500 mt-2">
              Manage and track your childs learning schedule
            </p>
          </div>
          <button
            onClick={() => setIsAddAvailabilityModalOpen(true)}
            className="flex items-center bg-primary text-white px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors shadow-lg"
          >
            <Plus className="mr-2" /> Add New Availability
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {availabilities.map((avail) => (
                <tr
                  key={avail.id}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {avail.day}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {avail.availableFrom} - {avail.availableTo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        avail.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {avail.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => toggleAvailabilityStatus(avail)}
                        className={`p-2 rounded-full transition-colors ${
                          avail.status === "Active"
                            ? "hover:bg-yellow-100 text-yellow-600"
                            : "hover:bg-green-100 text-green-600"
                        }`}
                        title={avail.status === "Active" ? "Pause" : "Resume"}
                      >
                        {avail.status === "Active" ? (
                          <Pause size={18} />
                        ) : (
                          <Play size={18} />
                        )}
                      </button>
                      <button
                        onClick={() => openEditModal(avail)}
                        className="p-2 rounded-full hover:bg-blue-100 text-primary"
                        title="Edit"
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        onClick={() => deleteAvailability(avail._id)}
                        className="p-2 rounded-full hover:bg-red-100 text-red-600"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Availability Modal */}
        {isAddAvailabilityModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedAvailability ? "Edit" : "Add"} Availability
                </h3>
                <button
                  onClick={() => {
                    setIsAddAvailabilityModalOpen(false);
                    setSelectedAvailability(null);
                    setNewAvailability({
                      day: "Monday",
                      availableFrom: "",
                      availableTo: "",
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  title="Close"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day
                  </label>
                  <select
                    value={newAvailability.day}
                    onChange={(e) =>
                      setNewAvailability({
                        ...newAvailability,
                        day: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {days.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From
                    </label>
                    <input
                      type="time"
                      value={newAvailability.availableFrom}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          availableFrom: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To
                    </label>
                    <input
                      type="time"
                      value={newAvailability.availableTo}
                      onChange={(e) =>
                        setNewAvailability({
                          ...newAvailability,
                          availableTo: e.target.value,
                        })
                      }
                      className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t flex justify-end space-x-4">
                <button
                  onClick={() => {
                    setIsAddAvailabilityModalOpen(false);
                    setSelectedAvailability(null);
                    setNewAvailability({
                      day: "Monday",
                      availableFrom: "",
                      availableTo: "",
                    });
                  }}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddOrEditAvailability}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  {selectedAvailability ? "Update" : "Add"} Availability
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        className="mt-16"
      />
    </div>
  );
};

export default KidsAvailability;
