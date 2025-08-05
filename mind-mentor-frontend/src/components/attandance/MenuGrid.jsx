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

  // useEffect(() => {
  //   const paymentNotification = async () => {
  //     try {
  //       const response = await fetchPaymentNotifications(id, parentId);
  //       if (response.status === 200) {
  //         setIsModalOpen(true);
  //         setLink(response.data.paymentLink);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching payment notifications:", error);
  //     }
  //   };
  //   paymentNotification();
  // }, [id, parentId]);

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
          icon: <BookOpen className="w-6 h-6 text-white" />,
          title: "Schedule Demo",
          subtitle: "Class",
          bgColor: "bg-indigo-600",
          gradient: "from-indigo-600 to-indigo-700",
          route: `/parent/kid/demo-class/${id}`,
        },
        {
          id: id,
          icon: <Settings className="w-6 h-6 text-white" />,
          title: "Manage",
          subtitle: "Child Profile",
          bgColor: "bg-violet-600",
          gradient: "from-violet-600 to-violet-700",
          route: `/parent/kid/manage-login/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6 text-white" />,
          title: "My Active Package",
          subtitle: "(Detailed View)",
          bgColor: "bg-blue-600",
          gradient: "from-blue-600 to-blue-700",
          route: `/parent-my-package-data/${id}`,
        },
      ];
    }
    // If demo is scheduled but enquiry is still pending, show demo view, manage kids and package
    else if (demoStatus === "Scheduled" && paymentStatus !== "Success") {
      return [
        {
          id: id,
          icon: <Video className="w-6 h-6 text-white" />,
          title: "View Demo",
          subtitle: "Class",
          bgColor: "bg-indigo-600",
          gradient: "from-indigo-600 to-indigo-700",
          route: `/parent/kid/demo-class/${id}`,
        },
        {
          id: id,
          icon: <Settings className="w-6 h-6 text-white" />,
          title: "Manage",
          subtitle: "Child Login",
          bgColor: "bg-violet-600",
          gradient: "from-violet-600 to-violet-700",
          route: `/parent/kid/manage-login/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6 text-white" />,
          title: "My Active Package",
          subtitle: "(Detailed View)",
          bgColor: "bg-blue-600",
          gradient: "from-blue-600 to-blue-700",
          route: `/parent-my-package-data/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6 text-white" />,
          title: "Class Attandance",
          subtitle: "(Detailed View)",
          bgColor: "bg-blue-600",
          gradient: "from-blue-600 to-blue-700",
          route: `/parent/kid/show-kid-attandance/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6 text-white" />,
          title: "All Tournamnets",
          subtitle: "(Detailed View)",
          bgColor: "bg-blue-600",
          gradient: "from-blue-600 to-blue-700",
          route: `/parent/list-all-tournament/${id}`,
        },
      ];
    }
    // Otherwise show all standard menu items
    else {
      return [
        {
          id: id,
          icon: <Video className="w-6 h-6 text-white" />,
          title: "Today's Class",
          subtitle: "Class",
          bgColor: "bg-red-600",
          gradient: "from-red-600 to-red-700",
          route: `/parent/kid/live-class/${id}`,
        },
        {
          id: id,
          icon: <Calendar className="w-6 h-6 text-white" />,
          title: "Class Schedule",
          subtitle: "Schedules",
          bgColor: "bg-emerald-600",
          gradient: "from-emerald-600 to-emerald-700",
          route: `/parent/kid/classShedule/${id}`,
        },
        {
          id: id,
          icon: <Settings className="w-6 h-6 text-white" />,
          title: "Manage",
          subtitle: "Child Profile",
          bgColor: "bg-violet-600",
          gradient: "from-violet-600 to-violet-700",
          route: `/parent/kid/manage-login/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6 text-white" />,
          title: "My Active Package",
          subtitle: "(Detailed View)",
          bgColor: "bg-blue-600",
          gradient: "from-blue-600 to-blue-700",
          route: `/parent-my-package-data/${id}`,
        },
        {
          id: id,
          icon: <CreditCard className="w-6 h-6 text-white" />,
          title: "Invoice",
          subtitle: "Details",
          bgColor: "bg-rose-600",
          gradient: "from-rose-600 to-rose-700",
          route: `/fee-details/${id}`,
        },
        {
          id: id,
          icon: <Award className="w-6 h-6 text-white" />,
          title: "Certificate",
          subtitle: "Certificate",
          bgColor: "bg-purple-600",
          gradient: "from-purple-600 to-purple-700",
          route: "/parent/certificate",
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6 text-white" />,
          title: "Class Attandance",
          subtitle: "(Detailed View)",
          bgColor: "bg-blue-600",
          gradient: "from-blue-600 to-blue-700",
          route: `/parent/kid/show-kid-attandance/${id}`,
        },
        {
          id: id,
          icon: <FileText className="w-6 h-6 text-white" />,
          title: "All Tournamnets",
          subtitle: "(Detailed View)",
          bgColor: "bg-blue-600",
          gradient: "from-blue-600 to-blue-700",
          route: `/parent/list-all-tournament/${id}`,
        },
        // {
        //   id: id,
        //   icon: <Clock className="w-6 h-6 text-white" />,
        //   title: "Availability",
        //   subtitle: "Availability",
        //   bgColor: "bg-cyan-600",
        //   gradient: "from-cyan-600 to-cyan-700",
        //   route: `/parent/add-kid-availability/${id}`,
        // },
      ];
    }
  };

  const handlePayNow = () => {
    navigate(`/parent/payment-page${link}`);
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Payment Notification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-[500px] rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            <div className="bg-indigo-600 p-6 relative">
              <h2 className="text-xl font-bold text-white">
                Payment Notification
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-white hover:bg-indigo-500 rounded-full p-1"
              >
                <X size={24} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-6 text-center">
                You have a pending payment for your child's classes. Would you
                like to proceed with the payment?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayNow}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-auto bg-gray-50">
        <div className="max-w-7xl mx-auto p-6 sm:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-5">
            Dashboard Menu
          </h1>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center">
                <Loader className="w-10 h-10 text-indigo-600 animate-spin" />
                <p className="mt-4 text-gray-600">Loading menu items...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getMenuItems().map((item) => (
                <Link
                  key={item.title + item.id}
                  to={item.route.replace(":id", item.id)}
                  className="group"
                >
                  <div className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 border border-gray-100 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`
                        w-16 h-16 rounded-xl bg-gradient-to-br ${item.gradient}
                        flex items-center justify-center 
                        shadow-lg 
                        transition-all duration-300 ease-in-out
                        group-hover:scale-110 group-hover:rotate-3
                        relative overflow-hidden
                      `}
                      >
                        <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        <div className="transform transition-transform duration-300 group-hover:scale-110">
                          {item.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-gray-900 transition-colors duration-300">
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-300">
                          {item.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-gradient-to-r ${item.gradient} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left`}
                      ></div>
                    </div>

                    <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div
                        className={`absolute top-0 right-0 w-16 h-16 ${item.bgColor} opacity-5 transform rotate-45 translate-x-8 -translate-y-8`}
                      ></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MenuGrid;
