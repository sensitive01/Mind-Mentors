import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Settings,
  FileText,
  CreditCard,
  Award,
  Clock,
  X,
  Video,
  Loader,
  Users,
  Trophy,
  PlayCircle,
  User,
  Receipt,
  CheckCircle,
  ArrowRight,
  Star,
  Zap,
  Activity,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  fetchEnquiryStatus,
  fetchPaymentNotifications,
} from "../../api/service/parent/ParentService";
import { useNavigate } from "react-router-dom";

const MenuGrid = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const parentId = localStorage.getItem("parentId");
  const [link, setLink] = useState();
  const [demoStatus, setDemoStatus] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getEnquiryStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetchEnquiryStatus(id, parentId);
        if (response.status === 200) {
          setDemoStatus(response.data.data.scheduleDemo?.status || "Pending");
          setPaymentStatus(response.data.data.paymentStatus);
        }
      } catch (error) {
        console.error("Error fetching enquiry status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getEnquiryStatus();
  }, [id, parentId]);

  const getMenuItems = () => {
    if (demoStatus === "Pending" && paymentStatus !== "Success") {
      return [
        {
          id: id,
          icon: <Calendar className="w-6 h-6" />,
          title: "Schedule Demo",
          subtitle: "Book trial class",
          color: "bg-blue-500",
          route: `/parent/kid/demo-class-shedule/${id}`,
        },
        {
          id: id,
          icon: <User className="w-6 h-6" />,
          title: "Manage Profile",
          subtitle: "Update info",
          color: "bg-purple-500",
          route: `/parent/kid/manage-login/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6" />,
          title: "Active Package",
          subtitle: "View details",
          color: "bg-green-500",
          route: `/parent-my-package-data/${id}`,
        },
      ];
    } else if (demoStatus === "Scheduled" && paymentStatus !== "Success") {
      return [
        {
          id: id,
          icon: <PlayCircle className="w-6 h-6" />,
          title: "View Demo",
          subtitle: "Join demo class",
          color: "bg-red-500",
          route: `/parent/kid/demo-class/${id}`,
        },
        {
          id: id,
          icon: <User className="w-6 h-6" />,
          title: "Manage Profile",
          subtitle: "Update details",
          color: "bg-purple-500",
          route: `/parent/kid/manage-login/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6" />,
          title: "Active Package",
          subtitle: "Package info",
          color: "bg-green-500",
          route: `/parent-my-package-data/${id}`,
        },
        {
          id: id,
          icon: <CheckCircle className="w-6 h-6" />,
          title: "Attendance",
          subtitle: "View records",
          color: "bg-cyan-500",
          route: `/parent/kid/show-kid-attandance/${id}`,
        },
        {
          id: id,
          icon: <Trophy className="w-6 h-6" />,
          title: "Tournaments",
          subtitle: "Join events",
          color: "bg-orange-500",
          route: `/parent/list-all-tournament/${id}`,
        },
      ];
    } else {
      return [
        {
          id: id,
          icon: <Video className="w-6 h-6" />,
          title: "Today's Class",
          subtitle: "Join now",
          color: "bg-red-500",
          route: `/parent/kid/live-class/${id}`,
        },
        {
          id: id,
          icon: <Calendar className="w-6 h-6" />,
          title: "Schedule",
          subtitle: "View classes",
          color: "bg-blue-500",
          route: `/parent/kid/classShedule/${id}`,
        },
        {
          id: id,
          icon: <User className="w-6 h-6" />,
          title: "Profile",
          subtitle: "Manage account",
          color: "bg-purple-500",
          route: `/parent/kid/manage-login/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6" />,
          title: "Package",
          subtitle: "View plan",
          color: "bg-green-500",
          route: `/parent-my-package-data/${id}`,
        },
        {
          id: id,
          icon: <Receipt className="w-6 h-6" />,
          title: "Billing",
          subtitle: "Payments",
          color: "bg-orange-500",
          route: `/fee-details/${id}`,
        },
        {
          id: id,
          icon: <Award className="w-6 h-6" />,
          title: "Certificates",
          subtitle: "Awards",
          color: "bg-yellow-500",
          route: "/parent/certificate",
        },
        {
          id: id,
          icon: <CheckCircle className="w-6 h-6" />,
          title: "Attendance",
          subtitle: "Track progress",
          color: "bg-cyan-500",
          route: `/parent/kid/show-kid-attandance/${id}`,
        },
        {
          id: id,
          icon: <Trophy className="w-6 h-6" />,
          title: "Tournaments",
          subtitle: "Competitions",
          color: "bg-pink-500",
          route: `/parent/list-all-tournament/${id}`,
        },
      ];
    }
  };

  const handlePayNow = () => {
    navigate(`/parent/payment-page${link}`);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Simple Payment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-96 rounded-xl shadow-xl mx-4">
            <div className="bg-blue-500 p-4 rounded-t-xl">
              <h2 className="text-lg font-semibold text-white">
                Payment Required
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:bg-blue-600 rounded-full p-1"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                Complete payment to access all features.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayNow}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simple Dashboard */}
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Manage your child's learning</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <div className="text-center">
              <div className="w-12 h-12 border-3 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600">Loading...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getMenuItems().map((item) => (
              <Link
                key={item.title + item.id}
                to={item.route.replace(":id", item.id)}
                className="group"
              >
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200">
                  <div
                    className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform`}
                  >
                    <div className="text-white">{item.icon}</div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                  <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MenuGrid;
