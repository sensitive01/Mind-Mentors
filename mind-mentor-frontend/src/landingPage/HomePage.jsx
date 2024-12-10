import { Users, User, Baby, Briefcase } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  
  const userTypes = [
    {
      title: 'Parent',
      icon: User,
      description: 'Manage your children\'s activities and track their progress',
      path: '/parent/login',
      color: 'blue'
    },
    {
      title: 'Kid',
      icon: Baby,
      description: 'Access your activities, games, and learning materials',
      path: '/kids/login', // Adjust path as needed for kid login
      color: 'green'
    },
    {
      title: 'Employee',
      icon: Briefcase,
      description: 'Manage schedules and coordinate activities',
      path: '/employee-login',
      color: 'purple'
    },
    // {
    //   title: 'Service Delivery',
    //   icon: Briefcase,
    //   description: 'Manage schedules and coordinate activities',
    //   path: '/serviceLogin',
    //   color: 'blue'
    // },
    // {
    //   title: 'Renewal Associate',
    //   icon: Briefcase,
    //   description: 'Manage schedules and coordinate activities',
    //   path: '/renewalLogin',
    //   color: 'green'
    // },
    // {
    //   title: 'Coach',
    //   icon: Briefcase,
    //   description: 'Manage schedules and coordinate activities',
    //   path: '/coachLogin',
    //   color: 'purple'
    // },
    // {
    //   title: 'Marketing Associate',
    //   icon: Briefcase,
    //   description: 'Manage schedules and coordinate activities',
    //   path: '/marketingLogin',
    //   color: 'blue'
    // },
    // {
    //   title: 'Centre Admin',
    //   icon: Briefcase,
    //   description: 'Manage schedules and coordinate activities',
    //   path: '/centeradmin-login',
    //   color: 'green'
    // },
    // {
    //   title: ' Super Admin',
    //   icon: Briefcase,
    //   description: 'Manage schedules and coordinate activities',
    //   path: '/superadminLogin',
    //   color: 'purple'
    // }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: {
        bg: 'bg-blue-500',
        hover: 'hover:bg-blue-600',
        light: 'bg-blue-50',
        text: 'text-blue-500'
      },
      green: {
        bg: 'bg-green-500',
        hover: 'hover:bg-green-600',
        light: 'bg-green-50',
        text: 'text-green-500'
      },
      purple: {
        bg: 'bg-purple-500',
        hover: 'hover:bg-purple-600',
        light: 'bg-purple-50',
        text: 'text-purple-500'
      }
    };
    return colors[color];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full">
              <Users className="w-12 h-12 text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to KidSystem
          </h1>
          <p className="text-xl text-gray-600">
            Please select your user type to continue
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {userTypes.map((userType) => {
            const colors = getColorClasses(userType.color);
            return (
              <div
                key={userType.title}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105"
              >
                <div className={`${colors.light} p-8`}>
                  <div className="flex justify-center">
                    <userType.icon className={`w-16 h-16 ${colors.text}`} />
                  </div>
                </div>
                
                <div className="p-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    {userType.title}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    {userType.description}
                  </p>
                  <button
                    onClick={() => navigate(userType.path)}
                    className={`w-full ${colors.bg} ${colors.hover} text-white font-medium px-6 py-3 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md flex items-center justify-center gap-2`}
                  >
                    <userType.icon className="w-5 h-5" />
                    Continue as {userType.title}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
