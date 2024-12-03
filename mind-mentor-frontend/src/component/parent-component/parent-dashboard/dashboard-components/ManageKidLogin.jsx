import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  changeChildPin,
  ParentManageChildLogin,
} from "../../../../api/service/parent/ParentService";
import { toast, ToastContainer } from "react-toastify";
import { Lock } from "lucide-react";
import "./float.css";

const ManageChildLogin = () => {
  const { id } = useParams();
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pinValues, setPinValues] = useState(["", "", "", ""]);
  const inputRefs = [useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const response = await ParentManageChildLogin(id);
        if (response && response.data) {
          setChild(response.data);
          if (response.data.kidPin) {
            const pinString = String(response.data.kidPin).padStart(4, "0");
            setPinValues(pinString.split(""));
          }
        }
      } catch (error) {
        console.error("Error fetching child data:", error);
        toast.error("Failed to load child data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChildData();
  }, [id]);

  const handlePinChange = (index, value) => {
    const newValue = value.replace(/\D/g, "");
    if (newValue.length <= 1) {
      const newPinValues = [...pinValues];
      newPinValues[index] = newValue;
      setPinValues(newPinValues);

      if (newValue.length === 1 && index < 3) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !pinValues[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSavePin = async () => {
    const combinedPin = pinValues.join("");
    if (combinedPin.length !== 4) {
      toast.error("PIN must be 4 digits");
      return;
    }

    if (combinedPin !== String(child.kidPin)) {
      try {
        const response = await changeChildPin(id, combinedPin);
        console.log(response.data.message);
        if (response.status === 200) {
          setChild((prev) => ({ ...prev, kidPin: combinedPin }));
          toast.success(response.data.message);
        }
      } catch (error) {
        console.error("Error updating PIN:", error);
        toast.error("Failed to update PIN");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!child) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">No child data found</div>
      </div>
    );
  }

  return (
    <div className=" bg-gray-50 flex items-center justify-center mt-7">
      {" "}
     
      <div
        className="w-full max-w-md bg-primary rounded-xl shadow-lg 
                 transition-all duration-300 ease-in-out
                 hover:shadow-2xl hover:-translate-y-1
                 animate-float"
      >
        <div className="p-8 text-center border-b border-gray-100">
          <div
            className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center mb-6
                      transition-transform duration-300 hover:scale-110"
          >
            <Lock className="w-8 h-8 text-primary transition-transform duration-300 hover:rotate-12" />
          </div>
          <h1 className="text-2xl font-semibold text-white mb-2">
            Manage Child Login
          </h1>
          <p className="text-white text-sm">
            Update your childs PIN for secure account access
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Child Name
              </label>
              <input
                type="text"
                value={child.kidsName || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700
                       transition-all duration-200 hover:bg-gray-100"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Chess ID
              </label>
              <input
                type="text"
                value={child.chessId || ""}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700
                       transition-all duration-200 hover:bg-gray-100"
                disabled
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-white">
              PIN Code
            </label>

            <div className="space-y-4">
              <div className="flex justify-center gap-6">
                {pinValues.map((value, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    value={value}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-mono border border-gray-300 rounded-lg
                             transition-all duration-200
                             focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                             hover:border-primary"
                    maxLength={1}
                  />
                ))}
              </div>

              <button
                onClick={handleSavePin}
                className="w-full py-3 bg-white text-primary rounded-lg font-medium 
                         transition-all duration-300
                         shadow-lg hover:shadow-xl
                         hover:-translate-y-1
                         active:shadow-inner active:translate-y-0.5
                         focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
              >
                Update PIN
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
        className="mt-16"
      />
    </div>
  );
};

export default ManageChildLogin;
