import { useState } from "react";
import { Plus } from "lucide-react";

const ReferralPage = () => {
  const initialReferrals = [
    {
      id: 1,
      name: "John Doe",
      phoneNumber: "123-456-7890",
      mobileNumber: "098-765-4321",
      status: "Active",
      createdAt: "2024-01-15T09:30:00",
    },
    {
      id: 2,
      name: "Jane Smith",
      phoneNumber: "234-567-8901",
      mobileNumber: "987-654-3210",
      status: "Pending",
      createdAt: "2024-01-16T14:20:00",
    },
    {
      id: 3,
      name: "Mike Johnson",
      phoneNumber: "345-678-9012",
      mobileNumber: "876-543-2109",
      status: "Active",
      createdAt: "2024-01-17T11:45:00",
    },
  ];

  const [referrals, setReferrals] = useState(initialReferrals);
  const [showModal, setShowModal] = useState(false);
  const [newReferral, setNewReferral] = useState({
    name: "",
    phoneNumber: "",
    mobileNumber: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReferral((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentDate = new Date();

    const referral = {
      id: referrals.length + 1,
      ...newReferral,
      status: "Active",
      createdAt: currentDate.toISOString(),
    };

    setReferrals((prev) => [...prev, referral]);
    setNewReferral({
      name: "",
      phoneNumber: "",
      mobileNumber: "",
    });
    setShowModal(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Referrals</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2 text-primary rounded-full  bg-white" /> 
          Add New Referral
        </button>
      </div>
      <p className="mb-12">
        <b>
          Refer your friends and get 4 FREE classes on every new referral
          enrollments.
        </b>
      </p>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full shadow-lg">
          <thead className="bg-primary text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Sl No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Mobile
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Time
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {referrals.map((referral, index) => (
              <tr key={referral.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {referral.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {referral.mobileNumber}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      referral.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {referral.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(referral.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatTime(referral.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto  w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between bg-primary p-5 items-center mb-4">
              <h3 className="text-white font-medium">Add New Referral</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 p-5 ">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parents Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={newReferral.parentName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parents Mobile Number
                </label>
                <input
                  type="tel"
                  name="parentMobileNumber"
                  value={newReferral.parentMobileNumber}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary transition-colors"
                >
                  Add Referral
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralPage;
