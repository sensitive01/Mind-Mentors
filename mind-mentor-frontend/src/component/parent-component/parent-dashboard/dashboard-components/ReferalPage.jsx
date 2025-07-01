import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import {
  getMyReferal,
  sendReferealDeatails,
} from "../../../../api/service/parent/ParentService";

const ReferralPage = () => {
  const parentId = localStorage.getItem("parentId");

  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newReferral, setNewReferral] = useState({
    parentName: "",
    parentMobileNumber: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMyReferal(parentId);
        if (response.status===200) {
          setReferrals(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching referrals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (parentId) {
      fetchData();
    }
  }, [parentId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReferral((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const referralData = {
        name: newReferral.parentName,
        phoneNumber: newReferral.parentMobileNumber,
        mobileNumber: newReferral.parentMobileNumber,
        status: "Pending",
      };

      const response = await sendReferealDeatails(referralData, parentId);

      if (response.status===201) {
        const newReferralWithId = {
          ...referralData,
          _id: response.data?._id || Date.now().toString(),
          referrerId: parentId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setReferrals((prev) => [...prev, newReferralWithId]);

        setNewReferral({
          parentName: "",
          parentMobileNumber: "",
        });
        setShowModal(false);
      }
    } catch (error) {
      console.error("Error adding referral:", error);
      // You might want to show an error message to the user here
    } finally {
      setSubmitting(false);
    }
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">Loading referrals...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary">Referrals</h1>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary transition-colors flex items-center"
        >
          <Plus size={16} className="mr-2 text-primary rounded-full bg-white" />
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
            {referrals.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No referrals found. Add your first referral to get started!
                </td>
              </tr>
            ) : (
              referrals.map((referral, index) => (
                <tr key={referral._id || referral.id}>
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto w-96 shadow-lg rounded-md bg-white">
            <div className="flex justify-between bg-primary p-5 items-center mb-4">
              <h3 className="text-white font-medium">Add New Referral</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white hover:text-gray-200"
                disabled={submitting}
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

            <form onSubmit={handleSubmit} className="space-y-4 p-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent's Name
                </label>
                <input
                  type="text"
                  name="parentName"
                  value={newReferral.parentName}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent's Mobile Number
                </label>
                <input
                  type="tel"
                  name="parentMobileNumber"
                  value={newReferral.parentMobileNumber}
                  onChange={handleInputChange}
                  required
                  disabled={submitting}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                />
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={submitting}
                  className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm text-white bg-primary rounded-lg hover:bg-primary transition-colors disabled:opacity-50 flex items-center"
                >
                  {submitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    "Add Referral"
                  )}
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
