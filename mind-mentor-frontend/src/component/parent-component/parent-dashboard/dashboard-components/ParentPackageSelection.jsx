import React, { useState, useEffect } from "react";
import {
  Monitor,
  Building,
  ChevronDown,
  CheckCircle,
  Send,
  Layers,
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
              ) : selectedPackage.type === "offline" ? (
                <Building className="w-4 h-4 text-green-500" />
              ) : (
                <Layers className="w-4 h-4 text-purple-500" />
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
              ₹{selectedPackage.pricing.total - discount}
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
  const [packages, setPackages] = useState({
    online: [],
    offline: [],
    hybrid: [],
  });
  const [discount, setDiscount] = useState(0);
  const [packageType, setPackageType] = useState("online");

  useEffect(() => {
    const fetchPackage = async () => {
      const response = await fetchPackageDetails();
      if (response.status === 200) {
        const groupedPackages = {
          online: response.data.data.filter((pkg) => pkg.type === "online"),
          offline: response.data.data.filter((pkg) => pkg.type === "offline"),
          hybrid: response.data.data.filter((pkg) => pkg.type === "hybrid"),
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

  const handlePackageTypeChange = (type) => {
    setPackageType(type);
    setSelectedPackage(null);
  };

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

      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Package Type
        </h2>
        <div className="flex flex-wrap gap-4">
          <label
            className={`flex items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
              packageType === "online"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <input
              type="radio"
              name="packageType"
              className="w-4 h-4 text-purple-600"
              checked={packageType === "online"}
              onChange={() => handlePackageTypeChange("online")}
            />
            <Monitor className="w-5 h-5 text-blue-500" />
            <span className="font-medium">Online</span>
          </label>

          <label
            className={`flex items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
              packageType === "offline"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <input
              type="radio"
              name="packageType"
              className="w-4 h-4 text-purple-600"
              checked={packageType === "offline"}
              onChange={() => handlePackageTypeChange("offline")}
            />
            <Building className="w-5 h-5 text-green-500" />
            <span className="font-medium">Offline</span>
          </label>

          <label
            className={`flex items-center gap-2 p-4 rounded-lg border cursor-pointer transition-all ${
              packageType === "hybrid"
                ? "border-purple-500 bg-purple-50"
                : "border-gray-200 hover:border-purple-300"
            }`}
          >
            <input
              type="radio"
              name="packageType"
              className="w-4 h-4 text-purple-600"
              checked={packageType === "hybrid"}
              onChange={() => handlePackageTypeChange("hybrid")}
            />
            <Layers className="w-5 h-5 text-purple-500" />
            <span className="font-medium">Hybrid</span>
          </label>
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available{" "}
            {packageType.charAt(0).toUpperCase() + packageType.slice(1)}{" "}
            Packages
          </label>
          <select
            className="w-full p-3 bg-white border border-gray-200 rounded-lg shadow-sm appearance-none cursor-pointer hover:border-purple-300 transition-colors"
            onChange={(e) => {
              const selected = packages[packageType].find(
                (p) => p._id === e.target.value
              );
              setSelectedPackage(selected);
            }}
            value={selectedPackage?._id || ""}
          >
            <option value="">Select a package</option>
            {packages[packageType].map((pkg) => (
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
