
import { 
  UserCircle, 
  Trophy, 
  Calendar, 
  Star, 
  Book, 
  Award 
} from 'lucide-react';

const KidsChessDashboard = () => {
  const buttonStyle = `bg-primary text-white hover:bg-opacity-90 transition`;
  
  return (
    <div className={`bg-gradient-to-br from-primary-50 to-primary-100 min-h-screen p-6 font-sans`}>
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className={`text-5xl font-bold text-primary tracking-tight`}>Chess Academy</h1>
          <p className={`text-primary mt-2`}>Learn. Play. Grow.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
          {/* Profile Section */}
          <section className="bg-white rounded-2xl shadow-lg p-6 text-center transform transition hover:scale-105 duration-300 border border-primary">
            <UserCircle className={`mx-auto text-primary`} size={80} />
            <h2 className={`text-2xl font-semibold mt-4 text-primary`}>My Profile</h2>
            <div className="flex justify-between mt-6 text-center">
              <div>
                <Star className="mx-auto text-yellow-500" />
                <p className={`font-medium text-primary-700 mt-2`}>Level</p>
              </div>
              <div>
                <Trophy className="mx-auto text-green-500" />
                <p className={`font-medium text-primary-700 mt-2`}>Rank</p>
              </div>
              <div>
                <Award className="mx-auto text-purple-500" />
                <p className={`font-medium text-primary-700 mt-2`}>Points</p>
              </div>
            </div>
            <button className={`mt-6 w-full ${buttonStyle} py-3 rounded-full`}>
              View Progress
            </button>
          </section>

          {/* Learning Path */}
          <section className="bg-white rounded-2xl shadow-lg p-6 transform transition hover:scale-105 duration-300 border border-primary">
            <div className="flex items-center space-x-4 mb-6">
              <Book className={`text-primary-600`} size={32} />
              <h2 className={`text-2xl font-semibold text-primary`}>Learning Path</h2>
            </div>
            <div className="space-y-4">
              <div className={`bg-primary-50 p-4 rounded-lg flex items-center justify-between`}>
                <div>
                  <h3 className={`font-medium text-primary`}>Basic Moves</h3>
                  <p className={`text-sm text-primary-600`}>Learn how pieces move</p>
                </div>
                <Star className="text-yellow-500" />
              </div>
              <div className={`bg-primary-50 p-4 rounded-lg flex items-center justify-between`}>
                <div>
                  <h3 className={`font-medium text-primary-800`}>Opening Strategies</h3>
                  <p className={`text-sm text-primary-600`}>First 10 moves</p>
                </div>
                <Trophy className="text-green-500" />
              </div>
            </div>
          </section>

          {/* Upcoming Classes */}
          <section className="bg-white rounded-2xl shadow-lg p-6 transform border border-primary transition hover:scale-105 duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <Calendar className={`text-primary-600`} size={32} />
              <h2 className={`text-2xl font-semibold text-primary`}>Classes</h2>
            </div>
            <div className="space-y-4">
              <div className={`bg-primary-50 p-4 rounded-lg flex items-center justify-between`}>
                <div>
                  <h3 className={`font-medium text-primary-800`}>Chess Basics</h3>
                  <p className={`text-sm text-primary-600`}>Every Saturday</p>
                </div>
                <button className={buttonStyle + " px-4 py-2 rounded-full text-sm"}>
                  Join
                </button>
              </div>
              <div className={`bg-primary-50 p-4 rounded-lg flex items-center justify-between`}>
                <div>
                  <h3 className={`font-medium text-primary-800`}>Advanced Tactics</h3>
                  <p className={`text-sm text-primary-600`}>Every Sunday</p>
                </div>
                <button className={buttonStyle + " px-4 py-2 rounded-full text-sm"}>
                  Join
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default KidsChessDashboard;