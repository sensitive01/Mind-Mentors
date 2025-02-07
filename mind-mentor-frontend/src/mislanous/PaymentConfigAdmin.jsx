import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Save, X } from "lucide-react";

const PaymentConfigAdmin = () => {
  // State for centers
  const [centers, setCenters] = useState([]);
  const [newCenter, setNewCenter] = useState({
    name: "",
    location: "",
    timing: "",
    capacity: "",
  });

  // State for packages
  const [packages, setPackages] = useState([]);
  const [newPackage, setNewPackage] = useState({
    name: "",
    duration: "",
    numberOfClasses: "",
    price: "",
  });

  // State for class types
  const [classTypes, setClassTypes] = useState([]);
  const [newClassType, setNewClassType] = useState({
    name: "",
    description: "",
    isHybrid: false,
    requiresCenter: false,
    isCustom: false,
    defaultPrice: "",
    pricePerClass: {
      online: 500,
      offline: 800,
    },
  });

  // Editing states
  const [editingCenter, setEditingCenter] = useState(null);
  const [editingPackage, setEditingPackage] = useState(null);
  const [editingClassType, setEditingClassType] = useState(null);

  // Fetch existing data
  useEffect(() => {
    // Fetch centers, packages, and class types
    // This would be replaced with actual API calls
    const fetchData = async () => {
      try {
        const [centersData, packagesData, classTypesData] = await Promise.all([
          fetch("/api/centers").then((res) => res.json()),
          fetch("/api/packages").then((res) => res.json()),
          fetch("/api/class-types").then((res) => res.json()),
        ]);
        setCenters(centersData);
        setPackages(packagesData);
        setClassTypes(classTypesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  // Handler functions
  const handleCenterSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/centers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCenter),
      });
      const data = await response.json();
      setCenters([...centers, data]);
      setNewCenter({ name: "", location: "", timing: "", capacity: "" });
    } catch (error) {
      console.error("Error adding center:", error);
    }
  };

  const handlePackageSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPackage),
      });
      const data = await response.json();
      setPackages([...packages, data]);
      setNewPackage({ name: "", duration: "", numberOfClasses: "", price: "" });
    } catch (error) {
      console.error("Error adding package:", error);
    }
  };

  const handleClassTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/class-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newClassType),
      });
      const data = await response.json();
      setClassTypes([...classTypes, data]);
      setNewClassType({
        name: "",
        description: "",
        isHybrid: false,
        requiresCenter: false,
        isCustom: false,
        defaultPrice: "",
        pricePerClass: { online: 500, offline: 800 },
      });
    } catch (error) {
      console.error("Error adding class type:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">
        Payment Configuration Management
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Centers Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Physical Centers</h2>
          <form onSubmit={handleCenterSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Center Name
              </label>
              <input
                type="text"
                value={newCenter.name}
                onChange={(e) =>
                  setNewCenter({ ...newCenter, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                value={newCenter.location}
                onChange={(e) =>
                  setNewCenter({ ...newCenter, location: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Timing</label>
              <input
                type="text"
                value={newCenter.timing}
                onChange={(e) =>
                  setNewCenter({ ...newCenter, timing: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input
                type="number"
                value={newCenter.capacity}
                onChange={(e) =>
                  setNewCenter({ ...newCenter, capacity: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Center
            </button>
          </form>

          <div className="space-y-2">
            {centers.map((center, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{center.name}</p>
                  <p className="text-sm text-gray-600">{center.timing}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-600 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-600 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Packages Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Packages</h2>
          <form onSubmit={handlePackageSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Package Name
              </label>
              <input
                type="text"
                value={newPackage.name}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Duration (months)
              </label>
              <input
                type="number"
                value={newPackage.duration}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, duration: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Number of Classes
              </label>
              <input
                type="number"
                value={newPackage.numberOfClasses}
                onChange={(e) =>
                  setNewPackage({
                    ...newPackage,
                    numberOfClasses: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <input
                type="number"
                value={newPackage.price}
                onChange={(e) =>
                  setNewPackage({ ...newPackage, price: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Package
            </button>
          </form>

          <div className="space-y-2">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{pkg.name}</p>
                  <p className="text-sm text-gray-600">
                    ₹{pkg.price} - {pkg.numberOfClasses} classes
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-600 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-600 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Class Types Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Class Types</h2>
          <form onSubmit={handleClassTypeSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">
                Class Type Name
              </label>
              <input
                type="text"
                value={newClassType.name}
                onChange={(e) =>
                  setNewClassType({ ...newClassType, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={newClassType.description}
                onChange={(e) =>
                  setNewClassType({
                    ...newClassType,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newClassType.isHybrid}
                  onChange={(e) =>
                    setNewClassType({
                      ...newClassType,
                      isHybrid: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium">Is Hybrid</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newClassType.requiresCenter}
                  onChange={(e) =>
                    setNewClassType({
                      ...newClassType,
                      requiresCenter: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium">Requires Center</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newClassType.isCustom}
                  onChange={(e) =>
                    setNewClassType({
                      ...newClassType,
                      isCustom: e.target.checked,
                    })
                  }
                  className="mr-2"
                />
                <span className="text-sm font-medium">Is Custom</span>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Default Price
              </label>
              <input
                type="number"
                value={newClassType.defaultPrice}
                onChange={(e) =>
                  setNewClassType({
                    ...newClassType,
                    defaultPrice: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border rounded"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 flex items-center justify-center"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Class Type
            </button>
          </form>

          <div className="space-y-2">
            {classTypes.map((type, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="font-medium">{type.name}</p>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button className="p-1 text-gray-600 hover:text-blue-600">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-600 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentConfigAdmin;
