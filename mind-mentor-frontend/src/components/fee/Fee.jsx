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
            name: response.data.data[0]?.kidName,
            id: response.data.data[0]?.kidId
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
        {/* Student Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h1 className="text-2xl font-bold text-blue-700 mb-2">{kidInfo?.name}</h1>
            <p className="text-gray-600">Student ID: {kidInfo?.id}</p>
          </div>
          <div className="flex space-x-4">
            <button className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
              <Search className="w-6 h-6 text-blue-600" />
            </button>
            <button className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
              <FileText className="w-6 h-6 text-blue-600" />
            </button>
            <button className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
              <Download className="w-6 h-6 text-blue-600" />
            </button>
          </div>
        </div>

        {/* Fee Details Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50 border-b border-blue-100">
                <tr>
                  {[
                    "Transaction ID", "Amount", "Enquiry ID", 
                    "Selection Type", "Timestamp", "Status", "Action"
                  ].map((header) => (
                    <th 
                      key={header} 
                      className="py-4 px-6 text-left text-sm font-semibold text-blue-800"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {feeData?.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors"
                  >
                    <td className="py-4 px-6 text-gray-700">{row.raz_transaction_id}</td>
                    <td className="py-4 px-6 font-semibold text-blue-700">₹{row.amount}</td>
                    <td className="py-4 px-6 text-gray-700">{row.enqId}</td>
                    <td className="py-4 px-6 text-gray-700 capitalize">{row.selectionType}</td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {new Date(row.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 px-6">
                      {row.status === "Success" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
                          Paid
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-medium">
                          {row.status}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button className="p-2 bg-blue-50 rounded-full hover:bg-blue-100 transition">
                        <Eye className="w-5 h-5 text-blue-600" />
                      </button>
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