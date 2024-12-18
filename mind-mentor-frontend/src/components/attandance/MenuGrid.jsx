
import { Link, useParams } from "react-router-dom";
import {
  BookOpen,
  Calendar,
  Settings,
  FileText,
  CreditCard,
  Users,
  GraduationCap,
  Award,
  Clock
} from "lucide-react";

const MenuGrid = () => {
  const { id } = useParams();

  const menuItems = [
    {
      id: id,
      icon: <BookOpen className="w-6 h-6 text-white" />,
      title: "Demo / Class",
      subtitle: "Requests",
      bgColor: "bg-indigo-600",
      gradient: "from-indigo-600 to-indigo-700",
      route: `/parent/kid/demo-class/${id}`,
    },
    {
      id: id,
      icon: <Calendar className="w-6 h-6 text-white" />,
      title: "Class",
      subtitle: "Schedules",
      bgColor: "bg-emerald-600",
      gradient: "from-emerald-600 to-emerald-700",
      route: "/parent/kid/attendance",
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
      title: "Reports",
      subtitle: "(Detailed View)",
      bgColor: "bg-blue-600",
      gradient: "from-blue-600 to-blue-700",
      route: "#",
    },
    {
      id: id,
      icon: <CreditCard className="w-6 h-6 text-white" />,
      title: "Fee",
      subtitle: "Details",
      bgColor: "bg-rose-600",
      gradient: "from-rose-600 to-rose-700",
      route: "/fee-details",
    },
    {
      id: id,
      icon: <Users className="w-6 h-6 text-white" />,
      title: "Kid(s)",
      subtitle: "Profile",
      bgColor: "bg-amber-600",
      gradient: "from-amber-600 to-amber-700",
      route: "/parent/kid",
    },
    {
      id: id,
      icon: <GraduationCap className="w-6 h-6 text-white" />,
      title: "Teachers",
      subtitle: "Teachers",
      bgColor: "bg-teal-600",
      gradient: "from-teal-600 to-teal-700",
      route: "#",
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
      icon: <Clock className="w-6 h-6 text-white" />,
      title: "Availability",
      subtitle: "Availability",
      bgColor: "bg-cyan-600",
      gradient: "from-cyan-600 to-cyan-700",
      route: `/parent/add-kid-availability/${id}`,
    },
  ];

  return (
    <div className="min-h-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-5">Dashboard Menu</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Link 
              key={item.id} 
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
                  <div className={`absolute top-0 right-0 w-16 h-16 ${item.bgColor} opacity-5 transform rotate-45 translate-x-8 -translate-y-8`}></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuGrid;
