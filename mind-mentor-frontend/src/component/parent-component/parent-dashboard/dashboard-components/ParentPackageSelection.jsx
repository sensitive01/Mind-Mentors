import React, { useState, useEffect } from "react";
import {
  Monitor,
  Building,
  ChevronDown,
  CheckCircle,
  Send,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  fetchPackageDetails,
  getDiscountAmount,
  sendPaymentDetailsLink,
} from "../../../../api/service/employee/EmployeeService";
import { useParams } from "react-router-dom";
import { getParentKidData } from "../../../../api/service/parent/ParentService";

const PackageDetails = ({ selectedPackage, discount = 0 }) => {
  if (!selectedPackage) return null;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-sm border border-purple-100 overflow-hidden transition-all duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              {selectedPackage.packageName}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              {selectedPackage.type === "online" ? (
                <Monitor className="w-4 h-4 text-blue-500" />
              ) : (
                <Building className="w-4 h-4 text-green-500" />
              )}
              <span className="text-sm capitalize text-gray-600">
                {selectedPackage.type} Package
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-purple-600">
              ₹{selectedPackage.pricing.amount}
            </p>
            <p className="text-sm text-gray-500">+GST</p>
          </div>
        </div>

        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <h5 className="font-semibold text-gray-900">Package Details</h5>
          <div className="space-y-3">
            {selectedPackage.onlineClasses > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <Monitor className="w-4 h-4 text-blue-500" />
                <span>{selectedPackage.onlineClasses} Online Classes</span>
              </div>
            )}
            {selectedPackage.physicalClasses > 0 && (
              <div className="flex items-center gap-2 text-gray-700">
                <Building className="w-4 h-4 text-green-500" />
                <span>{selectedPackage.physicalClasses} Physical Classes</span>
              </div>
            )}
            {selectedPackage.centerName && (
              <div className="text-sm text-gray-600">
                Center: {selectedPackage.centerName}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Base Amount</span>
            <span>₹{selectedPackage.pricing.amount}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-₹{discount}</span>
            </div>
          )}
          <div className="flex justify-between text-gray-600">
            <span>GST (18%)</span>
            <span>₹{selectedPackage.pricing.tax}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-3">
            <span>Total Amount</span>
            <span className="text-purple-600">
              ₹{selectedPackage.pricing.total}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 font-medium transition-colors flex items-center justify-center gap-2">
          Proceed to Payment
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ParentPackageSelection = ({ data, enqId }) => {
  const { kidId } = useParams();
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [packages, setPackages] = useState({ online: [], offline: [] });
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const fetchPackage = async () => {
      const response = await fetchPackageDetails();
      if (response.status === 200) {
        const groupedPackages = {
          online: response.data.data.filter((pkg) => pkg.type === "online"),
          offline: response.data.data.filter((pkg) => pkg.type === "offline"),
        };
        setPackages(groupedPackages);
      }
    };
    fetchPackage();
  }, []);

  useEffect(() => {
    const fetchDiscount = async () => {
      const response = await getDiscountAmount(enqId);
      if (response.status === 200) {
        setDiscount(response.data.vouchers);
      }
    };
    fetchDiscount();
  }, [enqId]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Choose Your Package
        </h1>
        <p className="text-gray-600">
          Select the perfect learning package for {data?.kidName}'s chess
          journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Online Packages
          </label>
          <select
            className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-purple-300 transition-colors"
            onChange={(e) =>
              setSelectedPackage(
                packages.online.find((p) => p._id === e.target.value)
              )
            }
          >
            <option value="">Select Online Package</option>
            {packages.online.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.packageName} - ₹{pkg.pricing.amount}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-[38px]" />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Offline Packages
          </label>
          <select
            className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-purple-300 transition-colors"
            onChange={(e) =>
              setSelectedPackage(
                packages.offline.find((p) => p._id === e.target.value)
              )
            }
          >
            <option value="">Select Offline Package</option>
            {packages.offline.map((pkg) => (
              <option key={pkg._id} value={pkg._id}>
                {pkg.packageName} - ₹{pkg.pricing.amount}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-[38px]" />
        </div>
      </div>

      <PackageDetails selectedPackage={selectedPackage} discount={discount} />
      <ToastContainer />
    </div>
  );
};

export default ParentPackageSelection;
