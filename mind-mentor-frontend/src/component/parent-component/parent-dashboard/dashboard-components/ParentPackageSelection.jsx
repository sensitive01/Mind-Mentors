import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";

import {
  fetchParentPackageDetails,
  getTheEnqId,
  parentSelectPackageData,
  setProgramAndLevel,
} from "../../../../api/service/parent/ParentService";
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID;
import logo from "../../../../assets/mindmentorz.png";
import {
  getAllProgrameData,
  getPParentDiscountAmount,
} from "../../../../api/service/employee/EmployeeService";

const ParentPackageSelection = () => {
  const { kidId } = useParams();
  const navigate = useNavigate();
  const parentId = localStorage.getItem("parentId");
  const [packageType, setPackageType] = useState("");
  const [packages, setPackages] = useState({
    online: [],
    offline: [],
    hybrid: [],
    kit: [],
  });

  const [selectedCenter, setSelectedCenter] = useState("");
  const [centersList, setCentersList] = useState([]);
  const [enqId, setEnqId] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [selectedCenterAddress, setSelectedCenterAddress] = useState("");
  const [data, setData] = useState({
    kidId: kidId,
    kidName: "",
    whatsappNumber: "",
    programs: [],
  });

  // New state for program selection
  const [allPrograms, setAllPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [showProgramSelection, setShowProgramSelection] = useState(false);

  const getTimeSlotDisplay = (timeSlot) => {
    if (timeSlot === "day") {
      return "10:30 AM - 7:30 PM (Day)";
    } else if (timeSlot === "night") {
      return "7:30 PM - 10:30 AM (Night)";
    }
    return timeSlot;
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getPParentDiscountAmount(parentId, kidId);
      console.log(response);
      if (response.status === 200) {
        setDiscount(response.data.discountAmount);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchPrograms = async () => {
      const response = await getAllProgrameData();
      if (response.status === 200) {
        setAllPrograms(response.data.programs);
      }
    };
    fetchPrograms();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const packageResponse = await fetchParentPackageDetails();
        if (packageResponse.status === 200) {
          const packageData = packageResponse?.data?.data;
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

        const getEnqId = await getTheEnqId(kidId);
        setEnqId(getEnqId?.data?.data?._id);

        if (getEnqId?.data?.data) {
          const kidData = getEnqId.data.data;
          console.log("Kid Data:", kidData);
          setData({
            kidId: kidId,
            kidName: kidData.kidName || kidData.kidFirstName ||"",
            whatsappNumber: kidData.whatsappNumber || "",
            programs: kidData.programs || [],
          });

          // Check if programs are empty
          if (!kidData.programs || kidData.programs.length === 0) {
            setShowProgramSelection(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load package data");
      }
    };

    fetchData();
  }, [kidId]);

  const handleProgramSelection = async () => {
    if (!selectedProgram || !selectedLevel) {
      toast.error("Please select both program and level");
      return;
    }

    // Update the data with selected program
    await setProgramAndLevel(selectedProgram, selectedLevel, kidId);

    const newProgram = {
      program: selectedProgram,
      level: selectedLevel,
      pgmStatus: "Active",
    };

    setData((prev) => ({
      ...prev,
      programs: [...prev.programs, newProgram],
    }));

    setShowProgramSelection(false);
  };

  const handlePackageTypeChange = (type) => {
    setPackageType(type);
    resetSelections();

    if (type === "hybrid") {
      let hybridCenters = [];

      if (packages.offline.length > 0) {
        const offlineCenters = packages.offline[0].centers.map((center) => ({
          centerId: center.centerId,
          centerName: center.centerName,
        }));
        hybridCenters = [...hybridCenters, ...offlineCenters];
      }

      const uniqueCenters = [
        ...new Map(hybridCenters.map((item) => [item.centerId, item])).values(),
      ];

      setCentersList(uniqueCenters);
    } else {
      setCentersList([]);
    }
  };

  const resetSelections = () => {
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
    setSelectedCenterAddress("");
  };

  const handleTimeSlotChange = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedCenter("");
    setSelectedCenterAddress("");
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
          address: center.address || "",
        }));
      }
    }

    const uniqueCenters = [
      ...new Map(centers.map((item) => [item.centerId, item])).values(),
    ];

    setAvailableCenters(uniqueCenters);

    if (packageType === "online" && uniqueCenters.length === 1) {
      setSelectedCenter(uniqueCenters[0].centerId);
      setClassRate(uniqueCenters[0].oneClassPrice);
    }
  };

  const handleCenterSelectionForTimeSlot = (centerId) => {
    setSelectedCenter(centerId);

    const selectedCenterData = availableCenters.find(
      (center) => center.centerId === centerId
    );
    if (selectedCenterData) {
      setClassRate(selectedCenterData.oneClassPrice);
      if (packageType === "offline" && selectedCenterData.address) {
        setSelectedCenterAddress(selectedCenterData.address);
      }
    }
  };

  const calculateAmounts = () => {
    let base = 0;

    if (packageType === "online" || packageType === "offline") {
      if (selectedTimeSlot && selectedCenter && numberOfClasses > 0) {
        base = numberOfClasses * classRate;
      }
    } else if (packageType === "hybrid") {
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

  const handleCenterChange = (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);

    if (packageType === "hybrid" && centerId) {
      let onlinePrice = 100;
      if (packages.online.length > 0) {
        const onlinePackagesForCenter = packages.online.filter((pkg) =>
          pkg.centers?.some((center) => center.centerId === centerId)
        );
        if (onlinePackagesForCenter.length > 0) {
          const dayPackage =
            onlinePackagesForCenter.find((pkg) =>
              pkg.packageName.toLowerCase().includes("day")
            ) || onlinePackagesForCenter[0];
          onlinePrice = dayPackage.oneClassPrice;
        }
      }

      let offlinePrice = 125;
      if (packages.offline.length > 0) {
        const offlineCenter = packages.offline[0].centers.find(
          (c) => c.centerId === centerId
        );
        if (offlineCenter) {
          const dayCenterData = packages.offline[0].centers.find(
            (c) =>
              c.centerId === centerId &&
              c.packageName?.toLowerCase().includes("day")
          );
          offlinePrice = dayCenterData
            ? dayCenterData.oneClassPrice
            : offlineCenter.oneClassPrice;
        }
      }

      setOnlineRate(onlinePrice);
      setOfflineRate(offlinePrice);
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

  const preparePackageData = () => {
    const amounts = calculateAmounts();

    let packageData = {
      enqId,
      kidName: data?.kidName,
      kidId: data?.kidId,
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
          centersList.find((c) => c.centerId === selectedCenter)?.centerName ||
          "",
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

    return packageData;
  };

  const handleRazorpayPayment = async () => {
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

    setIsProcessingPayment(true);

    try {
      const packageData = preparePackageData();

      const options = {
        key: RAZORPAY_KEY,
        amount: totalAmount * 100,
        currency: "INR",
        name: "MindMentorz",
        description: `${packageType} Package for ${data.kidName}`,
        image: logo,
        handler: async (response) => {
          try {
            const finalData = {
              ...packageData,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            };

            const submitResponse = await parentSelectPackageData(
              finalData,
              enqId,
              parentId
            );

            if (submitResponse.status === 201) {
              const receivedPaymentId = submitResponse?.data?.paymentId;
              setPaymentId(receivedPaymentId);
              toast.success(
                "Package selection and payment completed successfully!"
              );

              setTimeout(() => {
                navigate(`/parent/kid/attendance/${data?.kidId}`);
              }, 2000);
            } else {
              toast.error("Package submission failed after payment");
            }
          } catch (error) {
            console.error("Error submitting package after payment:", error);
            toast.error("Error submitting package details after payment");
          }
        },
        prefill: {
          name: "Parent Name",
          email: "parent@example.com",
          contact: data.whatsappNumber || "",
        },
        theme: {
          color: "#6c63ff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
      toast.error("Failed to initialize payment");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  useEffect(() => {
    calculateAmounts();
  }, [
    packageType,
    numberOfClasses,
    classRate,
    onlineClasses,
    offlineClasses,
    kitItems,
    selectedCenter,
    onlineRate,
    offlineRate,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              Choose Package for {data?.kidName}
            </h1>
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4">
        {/* Program Selection Modal */}
        {showProgramSelection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-semibold mb-4">Select Program</h2>

              <div className="space-y-4">
                <div>
                  <label className="block font-medium mb-2">Program</label>
                  <select
                    value={selectedProgram}
                    onChange={(e) => {
                      setSelectedProgram(e.target.value);
                      setSelectedLevel("");
                    }}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select a program</option>
                    {allPrograms.map((program) => (
                      <option key={program._id} value={program.programName}>
                        {program.programName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProgram && (
                  <div>
                    <label className="block font-medium mb-2">Level</label>
                    <select
                      value={selectedLevel}
                      onChange={(e) => setSelectedLevel(e.target.value)}
                      className="w-full p-3 border rounded-lg"
                      disabled={!selectedProgram}
                    >
                      <option value="">Select a level</option>
                      {allPrograms
                        .find((p) => p.programName === selectedProgram)
                        ?.programLevel.map((level) => (
                          <option key={level} value={level}>
                            {level}
                          </option>
                        ))}
                    </select>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => {
                      setShowProgramSelection(false);
                      navigate(-1);
                    }}
                    className="px-4 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleProgramSelection}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Program
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Only show package selection if program is selected or already exists */}
        {!showProgramSelection && (
          <>
            {/* Step 1: Choose Package Type */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h2 className="text-lg font-semibold mb-4">
                1. Choose How You Want to Learn
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "online", label: "Online Class", icon: "💻" },
                  { value: "offline", label: "Center Class", icon: "🏢" },
                  { value: "hybrid", label: "Hybrid Class", icon: "🔄" },
                  { value: "kit", label: "Kit Only", icon: "📦" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handlePackageTypeChange(option.value)}
                    className={`p-4 rounded-lg border-2 text-center ${
                      packageType === option.value
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Configure Package */}
            {packageType && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                  2. Set Up Your Classes
                </h2>

                {/* Display selected program info */}
                {data.programs.length > 0 && (
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-medium mb-2">Selected Program</h3>
                    <div className="flex flex-wrap gap-4">
                      {data.programs.map((program, index) => (
                        <div
                          key={index}
                          className="bg-white p-3 rounded shadow-sm"
                        >
                          <p className="font-medium">{program.program}</p>
                          <p className="text-sm text-gray-600">
                            {program.level}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Online/Offline Config */}
                {(packageType === "online" || packageType === "offline") && (
                  <div className="space-y-6">
                    {/* Time Slot */}
                    <div>
                      <label className="block font-medium mb-3">
                        When do you prefer classes?
                      </label>
                      <div className="grid grid-cols-1 gap-4 max-w-md">
                        {["day", "night"].map((slot) => (
                          <label
                            key={slot}
                            className="flex items-center cursor-pointer p-3 border rounded-lg hover:bg-gray-50"
                          >
                            <input
                              type="radio"
                              name="timeSlot"
                              value={slot}
                              checked={selectedTimeSlot === slot}
                              onChange={(e) =>
                                handleTimeSlotChange(e.target.value)
                              }
                              className="mr-3"
                            />
                            <span>{getTimeSlotDisplay(slot)}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Center Selection */}
                    {selectedTimeSlot && (
                      <div>
                        <label className="block font-medium mb-3">
                          {packageType === "online" &&
                          availableCenters.length === 1
                            ? "Center"
                            : "Choose Center"}
                        </label>
                        {packageType === "online" &&
                        availableCenters.length === 1 ? (
                          <div className="p-3 bg-gray-50 border rounded-lg">
                            <span className="font-medium">
                              {availableCenters[0].centerName}
                            </span>
                            <span className="ml-2 text-gray-600">
                              - ₹{availableCenters[0].oneClassPrice}/class
                            </span>
                          </div>
                        ) : (
                          <select
                            value={selectedCenter}
                            onChange={(e) =>
                              handleCenterSelectionForTimeSlot(e.target.value)
                            }
                            className="w-full max-w-md p-3 border rounded-lg"
                          >
                            <option value="">Select a center</option>
                            {availableCenters.map((center) => (
                              <option
                                key={center.centerId}
                                value={center.centerId}
                              >
                                {center.centerName} - ₹{center.oneClassPrice}
                                /class
                              </option>
                            ))}
                          </select>
                        )}

                        {/* Display address for offline centers */}
                        {packageType === "offline" && selectedCenterAddress && (
                          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-800">
                              <strong>Address:</strong> {selectedCenterAddress}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Number of Classes */}
                    {selectedCenter && classRate > 0 && (
                      <div>
                        <label className="block font-medium mb-3">
                          How many classes? (Minimum 4)
                        </label>
                        <input
                          type="number"
                          value={numberOfClasses}
                          onChange={(e) => setNumberOfClasses(e.target.value)}
                          className="w-32 p-3 border rounded-lg text-center"
                          min="4"
                        />
                        <span className="ml-3 text-gray-600">
                          ₹{classRate} per class
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Hybrid Config */}
                {packageType === "hybrid" && (
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium mb-3">
                        Choose Center
                      </label>
                      <select
                        value={selectedCenter}
                        onChange={handleCenterChange}
                        className="w-full max-w-md p-3 border rounded-lg"
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block font-medium mb-3">
                            Online Classes (Minimum 4)
                          </label>
                          <input
                            type="number"
                            value={onlineClasses}
                            onChange={(e) => setOnlineClasses(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            min="4"
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            ₹{onlineRate} per class
                          </p>
                        </div>

                        <div>
                          <label className="block font-medium mb-3">
                            Center Classes (Minimum 4)
                          </label>
                          <input
                            type="number"
                            value={offlineClasses}
                            onChange={(e) => setOfflineClasses(e.target.value)}
                            className="w-full p-3 border rounded-lg"
                            min="4"
                          />
                          <p className="text-sm text-gray-600 mt-1">
                            ₹{offlineRate} per class
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Kit Config */}
                {packageType === "kit" && (
                  <div className="space-y-4">
                    {kitItems.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block font-medium mb-2">
                              Choose Kit
                            </label>
                            <select
                              value={item.name}
                              onChange={(e) =>
                                updateKitItem(index, "name", e.target.value)
                              }
                              className="w-full p-3 border rounded-lg"
                            >
                              <option value="">Select kit</option>
                              {kitItemsList.map((kit) => (
                                <option key={kit._id} value={kit._id}>
                                  {kit.packageName} - ₹{kit.amount}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block font-medium mb-2">
                              Quantity
                            </label>
                            <div className="flex items-center">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateKitItem(
                                    index,
                                    "quantity",
                                    Math.max(1, parseInt(e.target.value) || 0)
                                  )
                                }
                                className="flex-1 p-3 border rounded-lg text-center"
                                min="1"
                              />
                              {kitItems.length > 1 && (
                                <button
                                  onClick={() => removeKitItem(index)}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <X className="w-5 h-5" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={addKitItem}
                      className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400"
                    >
                      + Add Kit
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Payment */}
            {packageType && totalAmount > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">
                  3. Complete Payment
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3">Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Package:</span>
                        <span className="capitalize">{packageType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Amount (Includes GST):</span>
                        <span>₹{baseAmount.toFixed(2)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-₹{discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg border-t pt-2">
                        <span>Total (Includes GST):</span>
                        <span>₹{totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-end">
                    <button
                      onClick={handleRazorpayPayment}
                      disabled={
                        !packageType || totalAmount <= 0 || isProcessingPayment
                      }
                      className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
                    >
                      {isProcessingPayment
                        ? "Processing..."
                        : `Pay ₹${totalAmount.toFixed(2)}`}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Success */}
            {paymentId && (
              <div className="bg-white rounded-lg shadow p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 mb-4">Payment ID: {paymentId}</p>
              </div>
            )}
          </>
        )}
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default ParentPackageSelection;
