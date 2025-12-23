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
import { useNavigate } from "react-router-dom";

const PackageSelectionDialog = ({ open, onClose, data, enqId }) => {
  console.log(data);
  const navigate = useNavigate();
  const department = localStorage.getItem("department");
  const empId = localStorage.getItem("empId");
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

  // New state for day/night selection
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(""); // "day" or "night"
  const [availableCenters, setAvailableCenters] = useState([]);
  const [classRate, setClassRate] = useState(0);
  const [numberOfClasses, setNumberOfClasses] = useState(4);

  const [onlineClasses, setOnlineClasses] = useState(4);
  const [offlineClasses, setOfflineClasses] = useState(4);
  const [onlineRate, setOnlineRate] = useState(100);
  const [offlineRate, setOfflineRate] = useState(125);

  const [kitItems, setKitItems] = useState([{ name: "", quantity: 0 }]);
  const [kitItemsList, setKitItemsList] = useState([]);

  const [discount, setDiscount] = useState(0);
  const [baseAmount, setBaseAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [paymentId, setPaymentId] = useState("");

  // Helper function to find the correct package and pricing based on number of classes
  const findPackageForClasses = (
    packages,
    numberOfClasses,
    timeSlot,
    centerId = null
  ) => {
    // Filter packages by time slot first
    const timeFilteredPackages = packages.filter((pkg) => {
      const packageTimeSlot = pkg.packageName.toLowerCase().includes("night")
        ? "night"
        : "day";
      return packageTimeSlot === timeSlot;
    });

    // Find the package range that the numberOfClasses falls into
    const applicablePackage = timeFilteredPackages.find((pkg) => {
      return (
        numberOfClasses >= pkg.classStartFrom &&
        numberOfClasses <= pkg.classUpTo
      );
    });

    if (applicablePackage) {
      return {
        oneClassPrice: applicablePackage.oneClassPrice,
        packageData: applicablePackage,
      };
    }

    // If no exact range found, use the closest higher range or default logic
    const sortedPackages = timeFilteredPackages.sort(
      (a, b) => a.classStartFrom - b.classStartFrom
    );

    for (let pkg of sortedPackages) {
      if (numberOfClasses <= pkg.classUpTo) {
        return {
          oneClassPrice: pkg.oneClassPrice,
          packageData: pkg,
        };
      }
    }

    // If numberOfClasses is higher than any range, return unavailable
    // The previous logic defaulted to the highest range, which we want to avoid now.
    return {
      oneClassPrice: 0,
      packageData: null,
    };
  };

  // Helper function for offline packages (different structure)
  const findOfflinePackageForClasses = (
    offlinePackages,
    numberOfClasses,
    timeSlot,
    centerId
  ) => {
    if (offlinePackages.length === 0)
      return { oneClassPrice: 0, packageData: null };

    const centers = offlinePackages[0].centers;

    // Filter by center and time slot
    const applicableCenter = centers.find((center) => {
      const centerTimeSlot = center.packageName?.toLowerCase().includes("night")
        ? "night"
        : "day";
      const centerMatches = !centerId || center.centerId === centerId;
      const timeMatches = centerTimeSlot === timeSlot;
      const classRangeMatches =
        numberOfClasses >= center.classStartFrom &&
        numberOfClasses <= center.classUpTo;

      return centerMatches && timeMatches && classRangeMatches;
    });

    if (applicableCenter) {
      return {
        oneClassPrice: applicableCenter.oneClassPrice,
        packageData: applicableCenter,
      };
    }

    // Fallback logic for offline - find closest range
    const matchingCenters = centers.filter((center) => {
      const centerTimeSlot = center.packageName?.toLowerCase().includes("night")
        ? "night"
        : "day";
      const centerMatches = !centerId || center.centerId === centerId;
      return centerMatches && centerTimeSlot === timeSlot;
    });

    // Sort by class range and find the closest
    const sortedCenters = matchingCenters.sort(
      (a, b) => a.classStartFrom - b.classStartFrom
    );

    for (let center of sortedCenters) {
      if (numberOfClasses <= center.classUpTo) {
        return {
          oneClassPrice: center.oneClassPrice,
          packageData: center,
        };
      }
    }

    // If numberOfClasses is higher than any range, return unavailable
    return { oneClassPrice: 0, packageData: null };
  };

  // New function to update class pricing when number of classes changes
  const updateClassPricing = (numberOfClasses, timeSlot, centerId) => {
    let pricePerClass = 0;

    if (packageType === "online") {
      const pricingData = findPackageForClasses(
        packages.online,
        numberOfClasses,
        timeSlot,
        centerId
      );
      pricePerClass = pricingData.oneClassPrice;
    } else if (packageType === "offline") {
      const pricingData = findOfflinePackageForClasses(
        packages.offline,
        numberOfClasses,
        timeSlot,
        centerId
      );
      pricePerClass = pricingData.oneClassPrice;
    }

    setClassRate(pricePerClass);
  };

  // For hybrid packages - calculate pricing for both online and offline
  const updateHybridPricing = (
    centerId,
    onlineClassCount = onlineClasses,
    offlineClassCount = offlineClasses
  ) => {
    if (!centerId) return;

    // Calculate online pricing (assuming day time for hybrid)
    const onlinePricingData = findPackageForClasses(
      packages.online,
      onlineClassCount,
      "day",
      centerId
    );
    setOnlineRate(onlinePricingData.oneClassPrice);

    // Calculate offline pricing
    const offlinePricingData = findOfflinePackageForClasses(
      packages.offline,
      offlineClassCount,
      "day",
      centerId
    );
    setOfflineRate(offlinePricingData.oneClassPrice);
  };

  // Updated number of classes change handler with proper validation
  const handleNumberOfClassesChange = (newNumberOfClasses) => {
    // Allow empty input for user to type
    if (newNumberOfClasses === "" || newNumberOfClasses === null) {
      setNumberOfClasses("");
      return;
    }

    const classCount = parseInt(newNumberOfClasses);

    // Validate input
    if (isNaN(classCount) || classCount < 0) {
      return; // Don't update if invalid
    }

    setNumberOfClasses(classCount);

    if (selectedTimeSlot && selectedCenter && classCount > 0) {
      updateClassPricing(classCount, selectedTimeSlot, selectedCenter);
    }
  };

  // Input blur handler to enforce minimum requirements
  const handleNumberOfClassesBlur = () => {
    if (numberOfClasses === "" || numberOfClasses < 4) {
      setNumberOfClasses(4);
      if (selectedTimeSlot && selectedCenter) {
        updateClassPricing(4, selectedTimeSlot, selectedCenter);
      }
    }
  };

  // Updated handlers for hybrid class count changes
  const handleOnlineClassesChange = (newOnlineClasses) => {
    // Allow empty input for user to type
    if (newOnlineClasses === "" || newOnlineClasses === null) {
      setOnlineClasses("");
      return;
    }

    const classCount = parseInt(newOnlineClasses);

    if (isNaN(classCount) || classCount < 0) {
      return;
    }

    setOnlineClasses(classCount);
    if (selectedCenter && classCount > 0) {
      const onlinePricingData = findPackageForClasses(
        packages.online,
        classCount,
        "day",
        selectedCenter
      );
      setOnlineRate(onlinePricingData.oneClassPrice);
    }
  };

  const handleOnlineClassesBlur = () => {
    if (onlineClasses === "" || onlineClasses < 4) {
      setOnlineClasses(4);
      if (selectedCenter) {
        const onlinePricingData = findPackageForClasses(
          packages.online,
          4,
          "day",
          selectedCenter
        );
        setOnlineRate(onlinePricingData.oneClassPrice);
      }
    }
  };

  const handleOfflineClassesChange = (newOfflineClasses) => {
    // Allow empty input for user to type
    if (newOfflineClasses === "" || newOfflineClasses === null) {
      setOfflineClasses("");
      return;
    }

    const classCount = parseInt(newOfflineClasses);

    if (isNaN(classCount) || classCount < 0) {
      return;
    }

    setOfflineClasses(classCount);
    if (selectedCenter && classCount > 0) {
      const offlinePricingData = findOfflinePackageForClasses(
        packages.offline,
        classCount,
        "day",
        selectedCenter
      );
      setOfflineRate(offlinePricingData.oneClassPrice);
    }
  };

  const handleOfflineClassesBlur = () => {
    if (offlineClasses === "" || offlineClasses < 4) {
      setOfflineClasses(4);
      if (selectedCenter) {
        const offlinePricingData = findOfflinePackageForClasses(
          packages.offline,
          4,
          "day",
          selectedCenter
        );
        setOfflineRate(offlinePricingData.oneClassPrice);
      }
    }
  };

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

    if (type === "hybrid") {
      // For hybrid, we need centers from offline packages (physical centers)
      let hybridCenters = [];

      if (packages.offline.length > 0) {
        const offlineCenters = packages.offline[0].centers.map((center) => ({
          centerId: center.centerId,
          centerName: center.centerName,
        }));
        hybridCenters = [...hybridCenters, ...offlineCenters];
      }

      // Remove duplicates based on centerId
      const uniqueCenters = [
        ...new Map(hybridCenters.map((item) => [item.centerId, item])).values(),
      ];

      setCentersList(uniqueCenters);
    } else {
      setCentersList([]);
    }
  };

  const resetSelections = () => {
    setSelectedPackage("");
    setSelectedProgram("");
    setSelectedLevel("");
    setSelectedCenter("");
    setSelectedTimeSlot("");
    setAvailableCenters([]);
    setClassRate(0);
    setNumberOfClasses(4);
    setOnlineClasses(4);
    setOfflineClasses(4);
    setKitItems([{ name: "", quantity: 0 }]);
    setBaseAmount(0);
    setTotalAmount(0);
    setPaymentId("");
    setOnlineRate(100);
    setOfflineRate(125);
  };

  // Updated handleTimeSlotChange function
  const handleTimeSlotChange = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedCenter("");
    setClassRate(0);
    setNumberOfClasses(4);

    let centers = [];

    if (packageType === "online") {
      const filteredPackages = packages.online.filter((pkg) => {
        const packageTimeSlot = pkg.packageName.toLowerCase().includes("night")
          ? "night"
          : "day";
        return packageTimeSlot === timeSlot;
      });

      if (filteredPackages.length > 0) {
        centers = filteredPackages.flatMap(
          (pkg) =>
            pkg.centers?.map((center) => ({
              centerId: center.centerId,
              centerName: center.centerName,
              oneClassPrice: pkg.oneClassPrice || center.oneClassPrice || 100,
              packageData: pkg, // Store package reference
            })) || []
        );
      }
    } else if (packageType === "offline") {
      if (packages.offline.length > 0) {
        const filteredCenters = packages.offline[0].centers.filter((center) => {
          const centerTimeSlot = center.packageName
            ?.toLowerCase()
            .includes("night")
            ? "night"
            : "day";
          return centerTimeSlot === timeSlot;
        });

        centers = filteredCenters.map((center) => ({
          centerId: center.centerId,
          centerName: center.centerName,
          oneClassPrice: center.oneClassPrice || 125,
          packageData: center,
        }));
      }
    }

    const uniqueCenters = [
      ...new Map(centers.map((item) => [item.centerId, item])).values(),
    ];

    setAvailableCenters(uniqueCenters);

    // Auto-select if only one center available (User requirement for online default)
    if (uniqueCenters.length === 1 && packageType === "online") {
      const autoCenterId = uniqueCenters[0].centerId;
      setSelectedCenter(autoCenterId);
      updateClassPricing(4, timeSlot, autoCenterId);
    }
  };

  // Updated handleCenterSelectionForTimeSlot function
  const handleCenterSelectionForTimeSlot = (centerId) => {
    setSelectedCenter(centerId);

    const selectedCenterData = availableCenters.find(
      (center) => center.centerId === centerId
    );

    if (selectedCenterData) {
      // Update pricing based on current number of classes using dynamic pricing
      updateClassPricing(numberOfClasses, selectedTimeSlot, centerId);
    }
  };

  const calculateAmounts = () => {
    let base = 0;

    if (packageType === "online" || packageType === "offline") {
      // For online/offline with day/night selection, calculate based on number of classes and rate
      if (selectedTimeSlot && selectedCenter && numberOfClasses > 0) {
        base = numberOfClasses * classRate;
      }
    } else if (packageType === "hybrid") {
      // For hybrid, calculate based on selected center rates
      base = onlineClasses * onlineRate + offlineClasses * offlineRate;
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

  // Updated handleCenterChange for hybrid
  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);

    if (packageType === "hybrid" && centerId) {
      updateHybridPricing(centerId);
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

      if (packageType === "online" || packageType === "offline") {
        if (!selectedTimeSlot) {
          toast.error("Please select day or night option");
          return;
        }
        if (!selectedCenter) {
          toast.error("Please select a center");
          return;
        }
        if (numberOfClasses < 4) {
          toast.error("Minimum 4 classes required");
          return;
        }
      }

      if (packageType === "hybrid") {
        if (!selectedCenter) {
          toast.error("Please select a center for hybrid package");
          return;
        }
        if (onlineClasses < 4 || offlineClasses < 4) {
          toast.error("Minimum 4 classes required for both online and offline");
          return;
        }
      }

      if (
        packageType === "kit" &&
        (!kitItems[0].name || kitItems[0].quantity === 0)
      ) {
        toast.error("Please select at least one kit item");
        return;
      }

      const amounts = calculateAmounts();

      let packageData = {
        enqId,
        kidName: data?.kidName || data?.kidFirstName,
        kidId: data.kidId,
        whatsappNumber: data?.whatsappNumber,
        programs: data?.programs,
        classMode: packageType,
        discount: discount,
        ...amounts,
      };

      if (packageType === "online" || packageType === "offline") {
        packageData = {
          ...packageData,
          packageId: `${packageType.toUpperCase()}-${selectedTimeSlot.toUpperCase()}-CUSTOM`,
          selectedPackage: `Custom ${packageType} Package (${selectedTimeSlot})`,
          onlineClasses: packageType === "online" ? numberOfClasses : 0,
          offlineClasses: packageType === "offline" ? numberOfClasses : 0,
          centerId: selectedCenter,
          centerName:
            availableCenters.find((c) => c.centerId === selectedCenter)
              ?.centerName || "",
          timeSlot: selectedTimeSlot,
          classRate: classRate,
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
          onlineRate: onlineRate,
          offlineRate: offlineRate,
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

      const response = await sendPackageSelection(packageData, data._id, empId);

      if (response.status === 201) {
        const receivedPaymentId = response.data.paymentId;
        setPaymentId(receivedPaymentId);
        toast.success("Package selection submitted successfully");

        setTimeout(() => {
          onClose();
          navigate(
            `/${department}/department/payment-details/${receivedPaymentId}`
          );
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
    numberOfClasses,
    classRate,
    onlineClasses,
    offlineClasses,
    kitItems,
    selectedCenter,
    onlineRate,
    offlineRate,
  ]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-4 z-50 overflow-y-auto pt-24"
        style={{ backdropFilter: "blur(2px)" }}
      >
        <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl flex flex-col max-h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10">
            <h2 className="text-xl font-semibold text-gray-800">
              Select Package
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-1 -mr-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-gray-50">
            <div className="p-6 space-y-4">
              {/* Kid Info Card */}
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="flex gap-6">
                  <div className="flex-1">
                    <label className="text-sm text-gray-600 block mb-1">
                      Kid Name
                    </label>
                    <p className="font-medium text-gray-900">
                      {data?.kidName || data?.kidFirstName || "N/A"}
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
                    {formatWhatsAppNumber(
                      data?.whatsappNumber || data?.contactNumber
                    ) || "N/A"}
                  </p>
                </div>
              </div>

              {/* Package Type Selection */}
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
                    Others
                  </button>
                </div>
              </div>

              {/* Online/Offline Package Options */}
              {(packageType === "online" || packageType === "offline") && (
                <div className="bg-white p-3 rounded-lg shadow-sm space-y-4">
                  {/* Day/Night Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Select Time Slot
                    </label>
                    <div className="flex flex-wrap gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="timeSlot"
                          value="day"
                          checked={selectedTimeSlot === "day"}
                          onChange={(e) => handleTimeSlotChange(e.target.value)}
                          className="mr-2 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                          10.30 am - 7.30 pm (Day)
                        </span>
                      </label>
                      {packageType === "online" && (
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="timeSlot"
                            value="night"
                            checked={selectedTimeSlot === "night"}
                            onChange={(e) =>
                              handleTimeSlotChange(e.target.value)
                            }
                            className="mr-2 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                            7.30 pm - 10.30 am (Night)
                          </span>
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Center Selection */}
                  {selectedTimeSlot && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select {packageType} Center
                      </label>
                      <select
                        value={selectedCenter}
                        onChange={(e) =>
                          handleCenterSelectionForTimeSlot(e.target.value)
                        }
                        className="block w-full rounded-md border border-gray-300 px-4 py-2"
                      >
                        <option value="">Select a center</option>
                        {availableCenters.map((center) => (
                          <option key={center.centerId} value={center.centerId}>
                            {center.centerName}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Number of Classes */}
                  {selectedCenter && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Number of Classes (Minimum 4) - ₹{classRate}/class
                      </label>
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={numberOfClasses}
                          onChange={(e) =>
                            handleNumberOfClassesChange(e.target.value)
                          }
                          onBlur={handleNumberOfClassesBlur}
                          className="block w-full rounded-md border border-gray-300 px-4 py-2"
                          min="4"
                          placeholder="4"
                        />
                        {numberOfClasses !== "" && numberOfClasses < 4 && (
                          <p className="text-red-500 text-sm">
                            Minimum 4 classes required
                          </p>
                        )}
                        {/* Show error if class count is valid (>4) but no package found (rate is 0) */}
                        {numberOfClasses >= 4 && classRate === 0 && (
                          <p className="text-red-500 text-sm">
                            Package is currently not available
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Summary */}
                  {selectedCenter && numberOfClasses > 0 && (
                    <div className="mt-3 space-y-2 text-sm bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Package Type:</span>
                        <span className="font-medium capitalize">
                          {packageType}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time Slot:</span>
                        <span className="font-medium capitalize">
                          {selectedTimeSlot}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Center:</span>
                        <span className="font-medium">
                          {
                            availableCenters.find(
                              (c) => c.centerId === selectedCenter
                            )?.centerName
                          }
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Classes:</span>
                        <span className="font-medium">{numberOfClasses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Rate per class:</span>
                        <span className="font-medium">₹{classRate}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Hybrid Package Options */}
              {packageType === "hybrid" && (
                <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Center (Physical Location)
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
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Online Classes (Minimum 4) - ₹{onlineRate}
                          /class
                        </label>
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={onlineClasses}
                            onChange={(e) =>
                              handleOnlineClassesChange(e.target.value)
                            }
                            onBlur={handleOnlineClassesBlur}
                            className="block w-full rounded-md border border-gray-300 px-4 py-2"
                            min="4"
                            placeholder="4"
                          />
                          {onlineClasses !== "" && onlineClasses < 4 && (
                            <p className="text-red-500 text-sm">
                              Minimum 4 classes required
                            </p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Number of Offline Classes (Minimum 4) - ₹{offlineRate}
                          /class
                        </label>
                        <div className="space-y-2">
                          <input
                            type="number"
                            value={offlineClasses}
                            onChange={(e) =>
                              handleOfflineClassesChange(e.target.value)
                            }
                            onBlur={handleOfflineClassesBlur}
                            className="block w-full rounded-md border border-gray-300 px-4 py-2"
                            min="4"
                            placeholder="4"
                          />
                          {offlineClasses !== "" && offlineClasses < 4 && (
                            <p className="text-red-500 text-sm">
                              Minimum 4 classes required
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Kit Package Options */}
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
                          updateKitItem(
                            index,
                            "quantity",
                            Number(e.target.value)
                          )
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

              {/* Pricing Summary */}
              {packageType && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Package Type:</span>
                      <span className="font-medium capitalize">
                        {packageType}
                      </span>
                    </div>
                    {(packageType === "online" || packageType === "offline") &&
                      numberOfClasses > 0 && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Classes:</span>
                          <span className="font-medium">{numberOfClasses}</span>
                        </div>
                      )}
                    {packageType === "hybrid" &&
                      (onlineClasses > 0 || offlineClasses > 0) && (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Online Classes:
                            </span>
                            <span className="font-medium">{onlineClasses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Offline Classes:
                            </span>
                            <span className="font-medium">
                              {offlineClasses}
                            </span>
                          </div>
                        </>
                      )}
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Base Amount (GST Included)
                      </span>
                      <span className="font-bold">
                        ₹{baseAmount.toFixed(2)}
                      </span>
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

              {/* Payment ID Display */}
              {paymentId && (
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">
                      Payment ID:
                    </span>
                    <span className="font-bold text-purple-600">
                      {paymentId}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">
                    Redirecting to payment details page...
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer with action buttons */}
          <div className="sticky bottom-0 border-t border-gray-200 p-4 bg-white">
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={sendPackageDetails}
                disabled={!packageType}
                className="flex items-center px-5 py-2.5 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors shadow-sm"
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Package
              </button>
            </div>
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
    </>
  );
};

export default PackageSelectionDialog;
