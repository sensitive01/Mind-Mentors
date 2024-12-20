import { useState } from "react";
import { ArrowRight } from "lucide-react";

import { ToastContainer, toast } from "react-toastify";

import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import { validateKidChessId } from "../../../api/service/kid/KidService";
import KidLeftSide from "./KidLeftSide";

const KidsLoginPage = () => {
  const navigate = useNavigate();
  const [chessId, setChessId] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(chessId);

    try {
      const response = await validateKidChessId(chessId);
      console.log(response);

      if (response.status === 200) {
        toast.success(response?.data?.message);
        setTimeout(() => {
          navigate("/kid/otp", { state: response?.data?.kid?._id });
        }, 1500);
      } else {
        toast.err(response?.data?.message);
      }
    } catch (err) {
      console.log("Error in validating the chess ID", err);
      toast.error("Error validating Chess ID. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <KidLeftSide />

      <div className="lg:w-3/5 p-4 sm:p-6 lg:p-8 bg-white flex items-center justify-center flex-grow">
        <div className="w-full max-w-md mx-auto">
          <div className="flex flex-col items-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-4">
              Kids Login
            </h2>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-4 sm:space-y-6 w-full"
          >
            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Enter your chess id - MM9850422
              </label>

              <div className="relative">
                <input
                  type="text"
                  name="chessId"
                  value={chessId}
                  onChange={(e) => setChessId(e.target.value)}
                  required
                  autoFocus
                  className={`w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  placeholder="Enter your chess id"
                  maxLength={9}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-3 px-4 rounded-lg hover:bg-opacity-90 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary 
                transition-all duration-300 text-sm sm:text-base font-medium flex items-center justify-center"
            >
              Next <ArrowRight size={16} className="ml-2" />
            </button>
          </form>
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

export default KidsLoginPage;
