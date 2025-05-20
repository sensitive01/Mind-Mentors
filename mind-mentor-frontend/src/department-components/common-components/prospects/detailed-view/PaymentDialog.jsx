import { useState, useEffect } from "react";
import { Send, X } from "lucide-react";
import { formatWhatsAppNumber } from "../../../../utils/formatContacts";
import {
  fetchPackageDetails,
  getDiscountAmount,
  sendPackageSelection,
} from "../../../../api/service/employee/EmployeeService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; // Import navigate hook for React Router

const PackageSelectionDialog = ({ open, onClose, data, enqId }) => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [packageType, setPackageType] = useState("");
  const [packages, setPackages] = useState({
    online: [],
    offline: [],
    hybrid: [],
    kit: [],
  });

  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centersList, setCentersList] = useState([]);

  const [onlineClasses, setOnlineClasses] = useState(0);
  const [offlineClasses, setOfflineClasses] = useState(0);
  const [onlineRate, setOnlineRate] = useState(100);
  const [offlineRate, setOfflineRate] = useState(125);

  const [kitItems, setKitItems] = useState([{ name: "", quantity: 0 }]);
  const [kitItemsList, setKitItemsList] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [paymentId, setPaymentId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packageResponse = await fetchPackageDetails();
        if (packageResponse.status === 200) {
          const packageData = packageResponse.data.data;

          setPackages({
            online: packageData.onlinePackageData || [],
            offline: packageData.offlineClassPackageData || [],
            hybrid: packageData.hybridClassPackageData || [],
            kit: packageData.kitPrice || [],
          });

          if (packageData.kitPrice && packageData.kitPrice.length > 0) {
            setKitItemsList(packageData.kitPrice);
          }
        }

        const discountResponse = await getDiscountAmount(enqId);
        if (discountResponse.status === 200) {
          setDiscount(discountResponse.data.vouchers || 0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load package data");
      }
    };

    fetchData();
  }, [enqId]);

  const handlePackageTypeChange = (type) => {
    setPackageType(type);
    resetSelections();

    if (type === "offline" && packages.offline.length > 0) {
      const centersList = packages.offline[0].centers.map((center) => ({
        centerId: center.centerId,
        centerName: center.centerName,
      }));
      const uniqueCenters = [
        ...new Map(centersList.map((item) => [item.centerId, item])).values(),
      ];
      setCentersList(uniqueCenters);
    } else if (type === "hybrid" && packages.hybrid.length > 0) {
      const centersList = packages.hybrid[0].centers.map((center) => ({
        centerId: center.centerId,
        centerName: center.centerName,
      }));
      const uniqueCenters = [
        ...new Map(centersList.map((item) => [item.centerId, item])).values(),
      ];
      setCentersList(uniqueCenters);
    } else if (type === "online" && packages.online.length > 0) {
      setCentersList(packages.online[0].centers || []);
    } else {
      setCentersList([]);
    }
  };

  const resetSelections = () => {
    setSelectedPackage("");
    setSelectedProgram("");
    setSelectedLevel("");
    setSelectedCenter("");
    setOnlineClasses(0);
    setOfflineClasses(0);
    setKitItems([{ name: "", quantity: 0 }]);
    setBaseAmount(0);
    setTotalAmount(0);
    setPaymentId("");
  };

  const calculateAmounts = () => {
    let base = 0;

    if (packageType === "online" || packageType === "offline") {
      if (selectedPackage) {
        if (packageType === "online") {
          const pkg = packages.online.find((p) => p._id === selectedPackage);
          if (pkg) base = pkg.amount;
        } else {
          const foundPackage = packages.offline[0]?.centers.find(
            (c) => c._id === selectedPackage
          );
          if (foundPackage) base = foundPackage.amount;
        }
      }
    } else if (packageType === "hybrid") {
      if (selectedCenter && packages.hybrid.length > 0) {
        const centerPackages = packages.hybrid[0].centers.filter(
          (c) => c.centerId === selectedCenter
        );

        const onlinePkg = centerPackages.find((c) => c.mode === "online");
        const offlinePkg = centerPackages.find((c) => c.mode === "offline");

        const currentOnlineRate = onlinePkg
          ? onlinePkg.oneClassPrice
          : onlineRate;
        const currentOfflineRate = offlinePkg
          ? offlinePkg.oneClassPrice
          : offlineRate;

        setOnlineRate(currentOnlineRate);
        setOfflineRate(currentOfflineRate);

        base =
          onlineClasses * currentOnlineRate +
          offlineClasses * currentOfflineRate;
      } else {
        base = onlineClasses * onlineRate + offlineClasses * offlineRate;
      }
    } else if (packageType === "kit") {
      base = kitItems.reduce((total, item) => {
        const kitItem = kitItemsList.find((k) => k._id === item.name);
        return total + (kitItem ? kitItem.amount * item.quantity : 0);
      }, 0);
    }

    const discountedTotal = Math.max(base - discount, 0);

    setBaseAmount(base);
    setTotalAmount(discountedTotal);

    return { baseAmount: base, totalAmount: discountedTotal };
  };

  const handlePackageChange = (e) => {
    setSelectedPackage(e.target.value);

    if (packageType === "online") {
      const pkg = packages.online.find((p) => p._id === e.target.value);
      if (pkg) {
        setSelectedProgram(pkg.programName);
        setSelectedLevel(pkg.programLevel);
      }
    } else if (packageType === "offline") {
      const pkg = packages.offline[0]?.centers.find(
        (c) => c._id === e.target.value
      );
      if (pkg) {
        setSelectedProgram(pkg.programName);
        setSelectedLevel(pkg.programLevel);
        setSelectedCenter(pkg.centerId);
      }
    }
  };

  const handleCenterChange = (e) => {
    setSelectedCenter(e.target.value);

    if (packageType === "hybrid" && packages.hybrid.length > 0) {
      const centerPackages = packages.hybrid[0].centers.filter(
        (c) => c.centerId === e.target.value
      );

      const onlinePkg = centerPackages.find((c) => c.mode === "online");
      const offlinePkg = centerPackages.find((c) => c.mode === "offline");

      if (onlinePkg) setOnlineRate(onlinePkg.oneClassPrice);
      if (offlinePkg) setOfflineRate(offlinePkg.oneClassPrice);
    }
  };

  const updateKitItem = (index, field, value) => {
    const newKitItems = [...kitItems];
    newKitItems[index][field] = value;
    setKitItems(newKitItems);
  };

  const addKitItem = () => {
    setKitItems([...kitItems, { name: "", quantity: 0 }]);
  };

  const removeKitItem = (index) => {
    if (kitItems.length > 1) {
      const newKitItems = kitItems.filter((_, i) => i !== index);
      setKitItems(newKitItems);
    }
  };

  const sendPackageDetails = async () => {
    try {
      if (!packageType) {
        toast.error("Please select a package type");
        return;
      }

      if (
        (packageType === "online" || packageType === "offline") &&
        !selectedPackage
      ) {
        toast.error("Please select a package");
        return;
      }

      if (packageType === "hybrid" && onlineClasses + offlineClasses === 0) {
        toast.error("Please enter number of classes");
        return;
      }

      if (
        packageType === "kit" &&
        (!kitItems[0].name || kitItems[0].quantity === 0)
      ) {
        toast.error("Please select at least one kit item");
        return;
      }

      if (
        (packageType === "offline" || packageType === "hybrid") &&
        !selectedCenter
      ) {
        toast.error("Please select a center");
        return;
      }

      const amounts = calculateAmounts();

      let packageData = {
        enqId,
        kidName: data?.kidName,
        kidId: data.kidId,
        whatsappNumber: data?.whatsappNumber,
        programs: data?.programs,
        classMode: packageType,
        discount: discount,
        ...amounts,
      };

      if (packageType === "online" || packageType === "offline") {
        const selectedPkg =
          packageType === "online"
            ? packages.online.find((p) => p._id === selectedPackage)
            : packages.offline[0]?.centers.find(
                (c) => c._id === selectedPackage
              );

        packageData = {
          ...packageData,
          packageId: selectedPackage,
          selectedPackage: selectedPkg?.packageName || "",
          onlineClasses:
            packageType === "online" ? selectedPkg?.classes || 0 : 0,
          offlineClasses:
            packageType === "offline" ? selectedPkg?.classes || 0 : 0,
          centerId: selectedCenter,
          centerName:
            centersList.find((c) => c.centerId === selectedCenter)
              ?.centerName || "",
        };
      } else if (packageType === "hybrid") {
        packageData = {
          ...packageData,
          packageId: "HYBRID-CUSTOM",
          selectedPackage: "Custom Hybrid Package",
          onlineClasses: Number(onlineClasses),
          offlineClasses: Number(offlineClasses),
          centerId: selectedCenter,
          centerName:
            centersList.find((c) => c.centerId === selectedCenter)
              ?.centerName || "",
        };
      } else if (packageType === "kit") {
        packageData = {
          ...packageData,
          packageId: "KIT-ITEMS",
          selectedPackage: "Kit Items",
          kitItems: kitItems.map((item) => ({
            name:
              kitItemsList.find((k) => k._id === item.name)?.packageName || "",
            quantity: item.quantity,
          })),
        };
      }

      const response = await sendPackageSelection(packageData, data._id);

      if (response.status === 201) {
        const receivedPaymentId = response.data.paymentId;
        setPaymentId(receivedPaymentId);
        toast.success("Package selection submitted successfully");

        // Redirect to payment-details page after 1.5 seconds
        setTimeout(() => {
          onClose();
          // Redirect to payment details page with the payment ID
          navigate(`/super-admin/department/payment-details/${receivedPaymentId}`);
        }, 1500);
      } else {
        toast.error("Failed to submit package selection");
      }
    } catch (error) {
      console.error("Error sending package details:", error);
      toast.error(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    calculateAmounts();
  }, [
    packageType,
    selectedPackage,
    onlineClasses,
    offlineClasses,
    kitItems,
    selectedCenter,
  ]);

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full max-w-md transform ${
        open ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out bg-white shadow-lg mt-8`}
    >
      <div className="flex flex-col h-full">
        <div className="flex-none bg-gradient-to-r from-purple-700 to-purple-400 px-6 py-4 flex justify-between items-center">
          <h2 className="text-white text-xl font-semibold">Select Package</h2>
          <button onClick={onClose} className="text-white hover:opacity-80">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-6 space-y-4">
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

            <div className="bg-white p-4 rounded-lg shadow-sm">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Package Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handlePackageTypeChange("online")}
                  className={`flex-1 py-2 px-3 rounded-md ${
                    packageType === "online"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Online
                </button>
                <button
                  onClick={() => handlePackageTypeChange("offline")}
                  className={`flex-1 py-2 px-3 rounded-md ${
                    packageType === "offline"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Offline
                </button>
                <button
                  onClick={() => handlePackageTypeChange("hybrid")}
                  className={`flex-1 py-2 px-3 rounded-md ${
                    packageType === "hybrid"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Hybrid
                </button>
                <button
                  onClick={() => handlePackageTypeChange("kit")}
                  className={`flex-1 py-2 px-3 rounded-md ${
                    packageType === "kit"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Kit
                </button>
              </div>
            </div>

            {packageType === "online" && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Online Package
                </label>
                <select
                  value={selectedPackage}
                  onChange={handlePackageChange}
                  className="block w-full rounded-md border border-gray-300 px-4 py-2 mb-4"
                >
                  <option value="">Select a package</option>
                  {packages.online.map((pkg) => (
                    <option key={pkg._id} value={pkg._id}>
                      {pkg.packageName} - {pkg.classes} Classes - ₹{pkg.amount}
                    </option>
                  ))}
                </select>

                {selectedPackage && (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Program:</span>
                      <span className="font-medium">{selectedProgram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium">{selectedLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Center:</span>
                      <span className="font-medium">
                        {packages.online.find((p) => p._id === selectedPackage)
                          ?.centers?.[0]?.centerName || "Online"}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {packageType === "offline" && (
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Center
                  </label>
                  <select
                    value={selectedCenter}
                    onChange={handleCenterChange}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                  >
                    <option value="">Select a center</option>
                    {centersList.map((center) => (
                      <option key={center.centerId} value={center.centerId}>
                        {center.centerName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCenter && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Package
                    </label>
                    <select
                      value={selectedPackage}
                      onChange={handlePackageChange}
                      className="block w-full rounded-md border border-gray-300 px-4 py-2"
                    >
                      <option value="">Select a package</option>
                      {packages.offline[0]?.centers
                        .filter((center) => center.centerId === selectedCenter)
                        .map((pkg) => (
                          <option key={pkg._id} value={pkg._id}>
                            {pkg.packageName} - {pkg.classes} Classes - ₹
                            {pkg.amount}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                {selectedPackage && (
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Program:</span>
                      <span className="font-medium">{selectedProgram}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Level:</span>
                      <span className="font-medium">{selectedLevel}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {packageType === "hybrid" && (
              <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Center
                  </label>
                  <select
                    value={selectedCenter}
                    onChange={handleCenterChange}
                    className="block w-full rounded-md border border-gray-300 px-4 py-2"
                  >
                    <option value="">Select a center</option>
                    {centersList.map((center) => (
                      <option key={center.centerId} value={center.centerId}>
                        {center.centerName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Online Classes (₹{onlineRate}/class)
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
                    Number of Offline Classes (₹{offlineRate}/class)
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

            {packageType === "kit" && (
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
                        <option key={kit._id} value={kit._id}>
                          {kit.packageName} (₹{kit.amount})
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

            {packageType && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Base Amount (GST Included)
                    </span>
                    <span className="font-bold">₹{baseAmount.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Applied</span>
                      <span>-₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-3">
                    <span className="text-gray-600 font-semibold">
                      Total Amount
                    </span>
                    <span className="font-bold text-purple-600">
                      ₹{totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Display payment ID if available */}
            {paymentId && (
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">Payment ID:</span>
                  <span className="font-bold text-purple-600">{paymentId}</span>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  Redirecting to payment details page...
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex-none border-t border-gray-200 p-4 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={sendPackageDetails}
              disabled={!packageType}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Package Selection
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

export default PackageSelectionDialog;
