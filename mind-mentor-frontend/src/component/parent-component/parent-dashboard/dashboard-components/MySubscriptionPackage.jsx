import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMySubscriptionData } from "../../../../api/service/parent/ParentService";

const MySubscriptionPackage = () => {
  const navigate = useNavigate();

  const parentId = localStorage.getItem("parentId");
  const { kidId } = useParams();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getMySubscriptionData(parentId, kidId);
        if (response.status === 200) {
          setSubscriptions(response.data.data);
        } else {
          setError("Failed to fetch subscription data");
        }
      } catch (err) {
        setError("Error fetching subscription data");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (parentId && kidId) {
      fetchData();
    }
  }, [parentId, kidId]);

  const handleChoosePackage = () => {
    navigate(`/parent-package-selection/${kidId}`);
    console.log("Navigate to choose package");
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            My Active Package
          </h1>
        </div>
        <button
          onClick={handleChoosePackage}
          className="bg-primary hover:bg-primary text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Choose Package
        </button>
      </div>

      {/* Subscriptions List */}
      {subscriptions.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.5"
              />
            </svg>
          </div>
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No Active Subscriptions
          </h3>
          <p className="text-gray-500">
            You don't have any active subscription packages yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {subscriptions.map((subscription, index) => (
            <div
              key={subscription._id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
            >
              {/* Package Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {subscription.selectedPackage}
                    </h2>
                    <p className="text-blue-100 mt-1">
                      Student: {subscription.kidName}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">
                      ₹{subscription.totalAmount}
                    </div>
                    {subscription.discount > 0 && (
                      <div className="text-blue-100 text-sm">
                        <span className="line-through">
                          ₹{subscription.baseAmount}
                        </span>
                        <span className="ml-2 bg-green-500 px-2 py-1 rounded text-xs">
                          ₹{subscription.discount} OFF
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Package Details */}
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Class Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">
                      Class Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mode:</span>
                        <span className="capitalize font-medium text-gray-900">
                          {subscription.classMode}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Online Classes:</span>
                        <span className="font-medium text-gray-900">
                          {subscription.onlineClasses}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Offline Classes:</span>
                        <span className="font-medium text-gray-900">
                          {subscription.offlineClasses}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">
                      Payment Details
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment ID:</span>
                        <span className="font-mono text-sm text-gray-900">
                          {subscription.paymentId}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            subscription.paymentStatus === "Success"
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {subscription.paymentStatus}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package ID:</span>
                        <span className="font-mono text-sm text-gray-900">
                          {subscription.packageId}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Subscription Timeline */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 border-b pb-2">
                      Timeline
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created:</span>
                        <span className="text-sm text-gray-900">
                          {formatDate(subscription.createdAt)}
                        </span>
                      </div>
                      
                    </div>
                  </div>
                </div>

                {/* Programs Section */}
                {subscription.programs && subscription.programs.length > 0 && (
                  <div className="mt-6 pt-6 border-t">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Programs Included
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {subscription.programs.map((program, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {program}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MySubscriptionPackage;
