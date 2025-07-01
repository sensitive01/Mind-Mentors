import React, { useState, useEffect } from "react";
import { Search, FileText, Download, Eye } from "lucide-react";
import { useParams } from "react-router-dom";
import { getPaidClassData } from "../../api/service/parent/ParentService";

const Fee = () => {
  const { kidId } = useParams();
  const [feeData, setFeeData] = useState([]);
  const [kidInfo, setKidInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeesData = async () => {
      try {
        const response = await getPaidClassData(kidId);
        if (response && response.data) {
          setFeeData(response.data.data);
          setKidInfo({
            name: response.data[0]?.kidName,
            id: response.data[0]?.kidId,
          });
        }
      } catch (error) {
        console.error("Error fetching fees data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeesData();
  }, [kidId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Fee Details Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  {["Sl No", "Kid Name", "Payment ID", "Status", "Amount"].map(
                    (header) => (
                      <th
                        key={header}
                        className="py-4 px-6 text-left text-sm font-semibold text-blue-800"
                      >
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {feeData?.map((row, index) => (
                  <tr
                    key={row._id || index}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-700">{index + 1}</td>
                    <td className="py-4 px-6 text-gray-700 font-medium">
                      {row.kidName}
                    </td>
                    <td className="py-4 px-6 text-gray-700">{row.paymentId}</td>
                    <td className="py-4 px-6">
                      {row.paymentStatus === "Success" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          Success
                        </span>
                      ) : row.paymentStatus === "Pending" ? (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                          Pending
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                          {row.paymentStatus}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-blue-700">
                      ₹{row.totalAmount?.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* No Data State */}
            {(!feeData || feeData.length === 0) && (
              <div className="text-center py-10 text-gray-500">
                No payment records found
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Fee;
