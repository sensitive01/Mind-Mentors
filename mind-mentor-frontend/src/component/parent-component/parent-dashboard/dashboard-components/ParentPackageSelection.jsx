import { useState, useEffect } from "react";
import { CheckCircle, X } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import {
  fetchParentPackageDetails,
  getMyKidData,
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

const HomeKidPackageSelection = () => {
  const navigate = useNavigate();
  const parentId = localStorage.getItem("parentId");
  const [packageType, setPackageType] = useState("");
  const [packages, setPackages] = useState({
    online: [],
    offline: [],
    hybrid: [],
    kit: [],
  });
  const [selectedKid, setSelectedKid] = useState("");
  const [kidsList, setKidsList] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");
  const [centersList, setCentersList] = useState([]);
  const [enqId, setEnqId] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [availableCenters, setAvailableCenters] = useState([]);
  const [classRate, setClassRate] = useState(0);
  const [numberOfClasses, setNumberOfClasses] = useState(8); // Changed from 4 to 8
  const [onlineClasses, setOnlineClasses] = useState(8); // Changed from 4 to 8
  const [offlineClasses, setOfflineClasses] = useState(8); // Changed from 4 to 8
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
    kidId: "",
    kidName: "",
    whatsappNumber: "",
    programs: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  // New state variables for program selection
  const [showProgramSelection, setShowProgramSelection] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [availableLevels, setAvailableLevels] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);
  const [viewOnlyMode, setViewOnlyMode] = useState(false);
  const hasValidProgram =
    selectedProgram || (data.programs && data.programs.length > 0);

  // Helper function to format time display
  const getTimeSlotDisplay = (timeSlot) => {
    if (timeSlot === "day") {
      return "10:30 AM - 7:30 PM (Day)";
    } else if (timeSlot === "night") {
      return "7:30 PM - 10:30 AM (Night)";
    }
    return timeSlot;
  };

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

    // If numberOfClasses is higher than any range, use the highest range pricing
    if (sortedPackages.length > 0) {
      return {
        oneClassPrice: sortedPackages[sortedPackages.length - 1].oneClassPrice,
        packageData: sortedPackages[sortedPackages.length - 1],
      };
    }

    // Fallback
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

    // If numberOfClasses is higher than any range, use the highest range
    if (sortedCenters.length > 0) {
      return {
        oneClassPrice: sortedCenters[sortedCenters.length - 1].oneClassPrice,
        packageData: sortedCenters[sortedCenters.length - 1],
      };
    }

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
    if (numberOfClasses === "" || numberOfClasses < 8) {
      setNumberOfClasses(8);
      if (selectedTimeSlot && selectedCenter) {
        updateClassPricing(8, selectedTimeSlot, selectedCenter);
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
    if (onlineClasses === "" || onlineClasses < 8) {
      setOnlineClasses(8);
      if (selectedCenter) {
        const onlinePricingData = findPackageForClasses(
          packages.online,
          8,
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
    if (offlineClasses === "" || offlineClasses < 8) {
      setOfflineClasses(8);
      if (selectedCenter) {
        const offlinePricingData = findOfflinePackageForClasses(
          packages.offline,
          8,
          "day",
          selectedCenter
        );
        setOfflineRate(offlinePricingData.oneClassPrice);
      }
    }
  };

  // New function that accepts kids data as parameter
  const handleKidSelectWithData = async (kidId, kidsData = kidsList) => {
    setIsLoading(true);
    setSelectedKid(kidId);

    try {
      // Find the selected kid from the provided kids data
      const selectedKidData = kidsData.find((kid) => kid._id === kidId);

      if (selectedKidData) {
        // Check if kid has programs
        const hasPrograms =
          selectedKidData.selectedProgram &&
          selectedKidData.selectedProgram.length > 0;

        // Set basic kid data
        setData({
          kidId: kidId,
          kidName: selectedKidData.kidsName,
          whatsappNumber: "",
          programs: hasPrograms ? selectedKidData.selectedProgram : [],
        });

        // Show program selection if no programs assigned
        setShowProgramSelection(!hasPrograms);
        if (!hasPrograms) {
          setSelectedProgram("");
          setSelectedLevel("");
        }

        // Fetch enrollment ID
        const getEnqId = await getTheEnqId(kidId);
        setEnqId(getEnqId?.data?.data?._id);

        // Fetch discount
        const discountResponse = await getPParentDiscountAmount(
          parentId,
          kidId
        );
        if (discountResponse.status === 200) {
          setDiscount(discountResponse.data.discountAmount);
        }
      }
    } catch (error) {
      console.error("Error fetching kid details:", error);
      toast.error("Failed to load kid details");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle kid selection - updated to use the new function
  const handleKidSelect = async (kidId) => {
    await handleKidSelectWithData(kidId, kidsList);
  };

  // Fetch initial data including kids, packages, and programs
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        // Fetch kids data
        const kidsResponse = await getMyKidData(parentId);
        if (kidsResponse.status === 200) {
          const kidsData = kidsResponse.data.kidData;
          setKidsList(kidsData);
          if (kidsData.length === 0) {
            setViewOnlyMode(kidsData.length === 0);
          }

          // Auto-select if only one kid - FIXED VERSION
          if (kidsData.length === 1) {
            // Pass the kids data directly since state hasn't updated yet
            await handleKidSelectWithData(kidsData[0]._id, kidsData);
          }
        }

        // Fetch package details
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

        // Fetch all programs data
        const programsResponse = await getAllProgrameData();
        if (programsResponse.status === 200) {
          setAllPrograms(programsResponse.data.programs);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load initial data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [parentId]);

  // Handle program selection change
  const handleProgramChange = (e) => {
    const programId = e.target.value;
    setSelectedProgram(programId);

    // Find the selected program to get available levels
    const program = allPrograms.find((p) => p._id === programId);
    if (program) {
      setAvailableLevels(program.programLevel || []);
    }
    setSelectedLevel(""); // Reset level when program changes
  };

  // Handle level selection change
  const handleLevelChange = (e) => {
    setSelectedLevel(e.target.value);
  };

  // Save the selected program and level
  const saveProgramSelection = async () => {
    if (!selectedProgram || !selectedLevel) {
      toast.error("Please select both program and level");
      return;
    }

    const selectedProgramData = allPrograms.find(
      (p) => p._id === selectedProgram
    );
    if (!selectedProgramData) return;

    const newProgramData = {
      program: selectedProgramData.programName,
      level: selectedLevel,
    };

    setData((prev) => ({
      ...prev,
      programs: [newProgramData],
    }));

    try {
      const response = await setProgramAndLevel(
        selectedProgramData.programName,
        selectedLevel,
        data.kidId
      );

      if (response.status === 200) {
        setShowProgramSelection(false);
        toast.success("Program selected successfully");
      } else {
        toast.error("Failed to save program selection");
      }
    } catch (error) {
      console.error("Error saving program selection:", error);
      toast.error("Failed to save program selection");
    }
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
    setNumberOfClasses(8); // Changed from 4 to 8
    setOnlineClasses(8); // Changed from 4 to 8
    setOfflineClasses(8); // Changed from 4 to 8
    setKitItems([{ name: "", quantity: 0 }]);
    setBaseAmount(0);
    setTotalAmount(0);
    setPaymentId("");
    setOnlineRate(100);
    setOfflineRate(125);
    setSelectedCenterAddress("");
  };

  // Updated handleTimeSlotChange function
  const handleTimeSlotChange = (timeSlot) => {
    setSelectedTimeSlot(timeSlot);
    setSelectedCenter("");
    setSelectedCenterAddress("");
    setClassRate(0);
    setNumberOfClasses(8); // Changed from 4 to 8

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
          address: center.address || "",
          packageData: center,
        }));
      }
    }

    const uniqueCenters = [
      ...new Map(centers.map((item) => [item.centerId, item])).values(),
    ];

    setAvailableCenters(uniqueCenters);

    if (packageType === "online" && uniqueCenters.length === 1) {
      setSelectedCenter(uniqueCenters[0].centerId);
      // Calculate initial price for 8 classes using dynamic pricing
      updateClassPricing(8, timeSlot, uniqueCenters[0].centerId);
    }
  };

  // Updated handleCenterSelectionForTimeSlot function
  const handleCenterSelectionForTimeSlot = (centerId) => {
    setSelectedCenter(centerId);

    const selectedCenterData = availableCenters.find(
      (center) => center.centerId === centerId
    );

    if (selectedCenterData) {
      if (packageType === "offline" && selectedCenterData.address) {
        setSelectedCenterAddress(selectedCenterData.address);
      }

      // Update pricing based on current number of classes using dynamic pricing
      updateClassPricing(numberOfClasses, selectedTimeSlot, centerId);
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
    if (!selectedKid) {
      toast.error("Please select a child");
      return;
    }

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
      if (numberOfClasses < 8) {
        toast.error("Minimum 8 classes required");
        return;
      }
    }

    if (packageType === "hybrid") {
      if (!selectedCenter) {
        toast.error("Please select a center for hybrid package");
        return;
      }
      if (onlineClasses < 8 || offlineClasses < 8) {
        toast.error("Minimum 8 classes required for both online and offline");
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
    discount,
  ]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              Choose Package for {data?.kidName || "your child"}
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
        {/* Kid Selection Dropdown - Only show if multiple kids */}
        {viewOnlyMode && (
          <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're in view-only mode. To select packages, please add a
                  child.
                </p>
              </div>
            </div>
          </div>
        )}
        {kidsList.length > 1 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Select Child</h2>
            <select
              value={selectedKid}
              onChange={(e) => handleKidSelect(e.target.value)}
              className="w-full p-3 border rounded-lg"
            >
              <option value="">Select a child</option>
              {kidsList.map((kid) => (
                <option key={kid._id} value={kid._id}>
                  {kid.kidsName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Program Information (shown when kid has programs) */}
        {selectedKid && !showProgramSelection && data.programs.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Program Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Selected Program
                </label>
                <p className="mt-1 text-lg font-medium">
                  {data.programs[0].program}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Selected Level
                </label>
                <p className="mt-1 text-lg font-medium">
                  {data.programs[0].level}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Program Selection (shown when kid has no programs) */}
        {showProgramSelection && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">
              Select Program for {data?.kidName}
            </h2>

            <div className="space-y-4">
              {/* Program Selection */}
              <div>
                <label className="block font-medium mb-2">Select Program</label>
                <select
                  value={selectedProgram}
                  onChange={handleProgramChange}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="">Select a program</option>
                  {allPrograms.map((program) => (
                    <option key={program._id} value={program._id}>
                      {program.programName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Level Selection (only shown when program is selected) */}
              {selectedProgram && (
                <div>
                  <label className="block font-medium mb-2">Select Level</label>
                  <select
                    value={selectedLevel}
                    onChange={handleLevelChange}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="">Select a level</option>
                    {availableLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Save Button */}
              <div className="pt-2">
                <button
                  onClick={saveProgramSelection}
                  disabled={!selectedProgram || !selectedLevel}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  Save Program Selection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Only show package selection if a kid is selected and has programs (not showing program selection) */}
        {selectedKid && !showProgramSelection && hasValidProgram && (
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

                {/* Online/Offline Config */}
                {(packageType === "online" || packageType === "offline") && (
                  <div className="space-y-6">
                    {/* Time Slot */}
                    <div>
                      <label className="block font-medium mb-3">
                        When do you prefer classes?
                      </label>
                      <div className="grid grid-cols-1 gap-4 max-w-md">
                        {(packageType === "offline"
                          ? ["day"]
                          : ["day", "night"]
                        ).map((slot) => (
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
                                {center.centerName}
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
                    {selectedCenter && (
                      <div>
                        <label className="block font-medium mb-3">
                          How many classes? (Minimum 8)
                        </label>
                        <div className="flex items-center space-x-3">
                          <input
                            type="number"
                            value={numberOfClasses}
                            onChange={(e) =>
                              handleNumberOfClassesChange(e.target.value)
                            }
                            onBlur={handleNumberOfClassesBlur}
                            className="w-32 p-3 border rounded-lg text-center"
                            min="8"
                            placeholder="8"
                          />
                          <span className="text-gray-600">
                            ₹{classRate} per class
                          </span>
                        </div>
                        {numberOfClasses !== "" && numberOfClasses < 8 && (
                          <p className="text-red-500 text-sm mt-2">
                            Minimum 8 classes required
                          </p>
                        )}
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
                            Online Classes (Minimum 8)
                          </label>
                          <div className="space-y-2">
                            <input
                              type="number"
                              value={onlineClasses}
                              onChange={(e) =>
                                handleOnlineClassesChange(e.target.value)
                              }
                              onBlur={handleOnlineClassesBlur}
                              className="w-full p-3 border rounded-lg"
                              min="8"
                              placeholder="8"
                            />
                            <p className="text-sm text-gray-600">
                              ₹{onlineRate} per class
                            </p>
                            {onlineClasses !== "" && onlineClasses < 8 && (
                              <p className="text-red-500 text-sm">
                                Minimum 8 classes required
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <label className="block font-medium mb-3">
                            Center Classes (Minimum 8)
                          </label>
                          <div className="space-y-2">
                            <input
                              type="number"
                              value={offlineClasses}
                              onChange={(e) =>
                                handleOfflineClassesChange(e.target.value)
                              }
                              onBlur={handleOfflineClassesBlur}
                              className="w-full p-3 border rounded-lg"
                              min="8"
                              placeholder="8"
                            />
                            <p className="text-sm text-gray-600">
                              ₹{offlineRate} per class
                            </p>
                            {offlineClasses !== "" && offlineClasses < 8 && (
                              <p className="text-red-500 text-sm">
                                Minimum 8 classes required
                              </p>
                            )}
                          </div>
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
                                    Math.max(0, parseInt(e.target.value) || 0)
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
                        <span>Program:</span>
                        <span>{data.programs[0]?.program || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Level:</span>
                        <span>{data.programs[0]?.level || "N/A"}</span>
                      </div>
                      {packageType === "online" || packageType === "offline" ? (
                        <div className="flex justify-between">
                          <span>Classes:</span>
                          <span>{numberOfClasses}</span>
                        </div>
                      ) : packageType === "hybrid" ? (
                        <>
                          <div className="flex justify-between">
                            <span>Online Classes:</span>
                            <span>{onlineClasses}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Offline Classes:</span>
                            <span>{offlineClasses}</span>
                          </div>
                        </>
                      ) : null}
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
                        !packageType ||
                        totalAmount <= 0 ||
                        isProcessingPayment ||
                        viewOnlyMode ||
                        !selectedKid ||
                        !hasValidProgram
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
          </>
        )}

        {/* View Only Mode - Add Kid Button */}
        {viewOnlyMode && (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <h2 className="text-lg font-semibold mb-4">
              No Children Added Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You need to add a child before you can select packages.
            </p>
            <button
              onClick={() => navigate("/parent/add-kid/false")}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium"
            >
              Add Child
            </button>
          </div>
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

export default HomeKidPackageSelection;
