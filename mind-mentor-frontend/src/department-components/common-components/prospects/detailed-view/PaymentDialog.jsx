import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { formatWhatsAppNumber } from "../../../../utils/formatContacts";
import {
  fetchPackageDetails,
  getDiscountAmount,
  sendPaymentDetailsLink,
} from "../../../../api/service/employee/EmployeeService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PaymentDialog = ({ open, onClose, data, enqId }) => {
  const [selectedPackage, setSelectedPackage] = useState("");
  const [onlineClasses, setOnlineClasses] = useState(0);
  const [offlineClasses, setOfflineClasses] = useState(0);
  const [customAmount, setCustomAmount] = useState(0);
  const [kitItems, setKitItems] = useState([{ name: "", quantity: 0 }]);
  const [packages, setPackages] = useState([]);
  const [kitItemsList, setKitItemsList] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [physicalCenters, setPhysicalCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");

  const GST_RATE = 0.18;
  const DEFAULT_ONLINE_RATE = 400;
  const DEFAULT_OFFLINE_RATE = 600;

  useEffect(() => {
    const fetchPackage = async () => {
      const response = await fetchPackageDetails();
      if (response.status === 200) {
        const hybridPricing = {
          online:
            response.data.data.find(
              (pkg) => pkg.type === "hybrid" && pkg.onlineClasses === 1
            )?.pricing?.amount || DEFAULT_ONLINE_RATE,
          offline:
            response.data.data.find(
              (pkg) => pkg.type === "hybrid" && pkg.physicalClasses === 1
            )?.pricing?.amount || DEFAULT_OFFLINE_RATE,
        };

        // Filter out duplicate hybrid packages and keep only unique packages
        const uniquePackages = response.data.data.reduce((acc, curr) => {
          if (
            curr.type === "hybrid" &&
            curr.packageName === "Hybrid day classes"
          ) {
            const existingPackage = acc.find(
              (p) => p.packageName === curr.packageName
            );
            if (!existingPackage) {
              return [
                ...acc,
                {
                  ...curr,
                  hybridPricing,
                },
              ];
            }
            return acc;
          }
          return [...acc, curr];
        }, []);

        const kitItems = response.data.data.filter((pkg) => pkg.type === "kit");
        setKitItemsList(kitItems);

        const updatedPackages = [
          ...uniquePackages,
          {
            _id: "CUSTOM",
            type: "custom",
            packageName: "Custom Package",
            onlineClasses: 0,
            physicalClasses: 0,
            hybridPricing,
          },
          {
            _id: "KIT",
            type: "kit",
            packageName: "Kit/Items",
          },
        ];
        setPackages(updatedPackages);
      }
    };
    fetchPackage();
  }, []);

  useEffect(() => {
    const fetchDiscount = async () => {
      const response = await getDiscountAmount(enqId);
      console.log(response);
      if (response.status === 200) {
        setDiscount(response.data.vouchers);
        // If physicalCenter data is available in the response
        if (
          response.data.physicalCenter &&
          response.data.physicalCenter.length > 0
        ) {
          setPhysicalCenters(response.data.physicalCenter);
        }
      }
    };
    fetchDiscount();
  }, []);

  // Effect to reset center selection when offline classes change to 0
  useEffect(() => {
    if (offlineClasses === 0) {
      setSelectedCenter("");
    }
  }, [offlineClasses]);

  // Effect to check if the package is offline type and set center if needed
  useEffect(() => {
    const selected = packages.find((pkg) => pkg._id === selectedPackage);
    if (
      selected &&
      (selected.type === "offline" ||
        (selected.type === "hybrid" && offlineClasses > 0) ||
        (selected.type === "custom" && offlineClasses > 0))
    ) {
      if (physicalCenters.length > 0 && !selectedCenter) {
        setSelectedCenter(physicalCenters[0].centerId);
      }
    }
  }, [selectedPackage, offlineClasses, physicalCenters]);

  const calculateTotalAmount = () => {
    const selected = packages.find((pkg) => pkg._id === selectedPackage);
    if (!selected)
      return { baseAmount: 0, gstAmount: 0, discountAmount: 0, totalAmount: 0 };

    let baseAmount = 0;
    if (selected.type === "hybrid" || selected.type === "custom") {
      const onlineRate = selected.hybridPricing?.online || DEFAULT_ONLINE_RATE;
      const offlineRate =
        selected.hybridPricing?.offline || DEFAULT_OFFLINE_RATE;
      const classesAmount =
        onlineClasses * onlineRate + offlineClasses * offlineRate;

      if (selected.type === "custom") {
        baseAmount = classesAmount + customAmount;
      } else {
        baseAmount = classesAmount;
      }
    } else if (selected.type === "kit") {
      baseAmount = kitItems.reduce((total, item) => {
        const kitPackage = kitItemsList.find(
          (kit) => kit.packageName === item.name
        );
        return total + item.quantity * (kitPackage?.pricing?.amount || 0);
      }, 0);
    } else {
      baseAmount = selected.pricing.amount;
    }

    const discountAmount = discount || 0;
    const discountedBaseAmount = Math.max(baseAmount - discountAmount, 0);
    const gstAmount = discountedBaseAmount * GST_RATE;
    const totalAmount = discountedBaseAmount + gstAmount;

    return {
      baseAmount,
      discountAmount,
      gstAmount,
      totalAmount,
    };
  };

  const generatePaymentLink = async () => {
    const selected = packages.find((pkg) => pkg._id === selectedPackage);
    if (!selected) return;

    // Check if a center is selected when it should be
    const needsCenter =
      selected.type === "offline" ||
      (selected.type === "hybrid" && offlineClasses > 0) ||
      (selected.type === "custom" && offlineClasses > 0);

    if (needsCenter && !selectedCenter && physicalCenters.length > 0) {
      toast.error("Please select a physical center for offline classes");
      return;
    }

    // Find selected center details
    const centerDetails = physicalCenters.find(
      (center) => center.centerId === selectedCenter
    );

    const paymentData = {
      enqId,
      selectedPackage: selected.packageName,
      onlineClasses: Number(onlineClasses),
      offlineClasses: Number(offlineClasses),
      kidName: data?.kidName,
      kidId: data.kidId,
      whatsappNumber: data?.whatsappNumber,
      programs: data?.programs,
      customAmount: selected.type === "custom" ? customAmount : 0,
      kitItems: selected.type === "kit" ? kitItems : [],
      discount: discount,
      centerId: selectedCenter || "",
      centerName: centerDetails?.centerName || "",
      ...calculateTotalAmount(),
    };

    const encodedData = btoa(JSON.stringify(paymentData));
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/payment-details/${encodedData}`;
    const parentLink = `/payment-details/${encodedData}`;

    try {
      const response = await sendPaymentDetailsLink(parentLink, data._id);
      if (response.status === 200) {
        toast.success("Payment request submitted successfully");
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        toast.error("Failed to submit payment request");
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message);
    }
  };

  const selectedPackageDetails = packages.find(
    (pkg) => pkg._id === selectedPackage
  );

  const addKitItem = () => {
    setKitItems([...kitItems, { name: "", quantity: 0 }]);
  };

  const updateKitItem = (index, field, value) => {
    const newKitItems = [...kitItems];
    newKitItems[index][field] = value;
    setKitItems(newKitItems);
  };

  const removeKitItem = (index) => {
    const newKitItems = kitItems.filter((_, i) => i !== index);
    setKitItems(newKitItems);
  };

  // Check if physical center selection should be displayed
  const shouldShowCenterSelection =
    selectedPackageDetails?.type === "offline" ||
    (selectedPackageDetails?.type === "hybrid" && offlineClasses > 0) ||
    (selectedPackageDetails?.type === "custom" && offlineClasses > 0);

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full max-w-sm transform ${
        open ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out bg-white shadow-lg`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex-none bg-gradient-to-r from-[#642b8f] to-[#aa88be] px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Pay</h2>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-[#f8f9fa]">
          <div className="p-6 space-y-4">
            {/* Kid Details Section */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="flex gap-6">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    Kid Name
                  </label>
                  <p className="font-medium text-gray-900">
                    {data?.kidName || "N/A"}
                  </p>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">
                    Program
                  </label>
                  {data?.programs?.map((item, index) => (
                    <div key={index} className="mb-1">
                      <p className="font-medium text-gray-900">
                        {item.program || "N/A"}
                      </p>
                      <p className="text-sm text-gray-600">
                        Level: {item.level || "N/A"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-2">
                <label className="text-sm text-gray-600 block mb-1">
                  Mobile
                </label>
                <p className="font-medium text-gray-900">
                  {formatWhatsAppNumber(data?.whatsappNumber) || "N/A"}
                </p>
              </div>
            </div>

            {/* Package Selection */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Package
              </label>
              <select
                value={selectedPackage}
                onChange={(e) => {
                  setSelectedPackage(e.target.value);
                  const selected = packages.find(
                    (pkg) => pkg._id === e.target.value
                  );
                  // Reset all input states
                  setOnlineClasses(0);
                  setOfflineClasses(0);
                  setCustomAmount(0);
                  setKitItems([{ name: "", quantity: 0 }]);
                }}
                className="block w-full rounded-md border border-gray-300 px-4 py-2"
              >
                <option value="">Select package</option>
                {packages.map((pkg) => (
                  <option key={pkg._id} value={pkg._id}>
                    {pkg.packageName}
                  </option>
                ))}
              </select>
            </div>

            {/* Hybrid Package Class Inputs */}
            {(selectedPackageDetails?.type === "hybrid" ||
              selectedPackageDetails?.type === "custom") && (
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Online Classes (₹
                    {selectedPackageDetails.hybridPricing?.online ||
                      DEFAULT_ONLINE_RATE}
                    /class)
                  </label>
                  <input
                    type="number"
                    value={onlineClasses}
                    onChange={(e) => setOnlineClasses(Number(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Offline Classes (₹
                    {selectedPackageDetails.hybridPricing?.offline ||
                      DEFAULT_OFFLINE_RATE}
                    /class)
                  </label>
                  <input
                    type="number"
                    value={offlineClasses}
                    onChange={(e) => setOfflineClasses(Number(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Physical Center Selection */}
            {shouldShowCenterSelection && physicalCenters.length > 0 && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Physical Center
                </label>
                <select
                  value={selectedCenter}
                  onChange={(e) => setSelectedCenter(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2"
                >
                  <option value="">Select a center</option>
                  {physicalCenters.map((center) => (
                    <option key={center.centerId} value={center.centerId}>
                      {center.centerName}
                    </option>
                  ))}
                </select>
                {selectedCenter && (
                  <p className="mt-2 text-sm text-gray-600">
                    Selected center:{" "}
                    {
                      physicalCenters.find(
                        (center) => center.centerId === selectedCenter
                      )?.centerName
                    }
                  </p>
                )}
              </div>
            )}

            {/* Custom Package Input */}
            {selectedPackageDetails?.type === "custom" && (
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Custom Amount
                  </label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                    min="0"
                  />
                </div>
              </div>
            )}

            {/* Kit/Items Input */}
            {selectedPackageDetails?.type === "kit" && (
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                {kitItems.map((item, index) => (
                  <div key={index} className="flex space-x-2 items-center">
                    <select
                      value={item.name}
                      onChange={(e) =>
                        updateKitItem(index, "name", e.target.value)
                      }
                      className="flex-1 rounded-md border border-gray-300 px-2 py-1"
                    >
                      <option value="">Select Item</option>
                      {kitItemsList.map((kit) => (
                        <option key={kit._id} value={kit.packageName}>
                          {kit.packageName} (₹{kit.pricing.amount})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        updateKitItem(index, "quantity", Number(e.target.value))
                      }
                      className="w-24 rounded-md border border-gray-300 px-2 py-1"
                      min="0"
                    />
                    {kitItems.length > 1 && (
                      <button
                        onClick={() => removeKitItem(index)}
                        className="text-red-500 hover:bg-red-50 rounded-md p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={addKitItem}
                  className="w-full bg-purple-50 text-purple-600 py-2 rounded-md hover:bg-purple-100"
                >
                  Add Item
                </button>
              </div>
            )}

            {/* Financial Calculations */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Amount</span>
                  <span className="font-bold">
                    ₹{calculateTotalAmount().baseAmount.toFixed(2)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount Applied</span>
                    <span>
                      -₹{calculateTotalAmount().discountAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">GST (18%)</span>
                  <span>₹{calculateTotalAmount().gstAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-gray-600 font-semibold">
                    Total Amount
                  </span>
                  <span className="font-bold text-purple-600">
                    ₹{calculateTotalAmount().totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex-none border-t border-gray-200 p-4 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={generatePaymentLink}
              disabled={
                !selectedPackage ||
                (shouldShowCenterSelection &&
                  physicalCenters.length > 0 &&
                  !selectedCenter)
              }
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit
            </button>
          </div>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        pauseOnFocusLoss
        style={{ marginTop: "60px" }}
      />
    </div>
  );
};

export default PaymentDialog;
