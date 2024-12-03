/* eslint-disable react/prop-types */

import { MessageSquare, CheckCircle, XCircle } from 'lucide-react';

const StatsCard = ({ icon: Icon, number, label, color }) => (
  <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow">
    <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <div>
      <div className="text-2xl font-bold">{number}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  </div>
);

const Stats = () => {
  return (
    <div className="space-y-4">
      <div className="border-l-4 border-purple-500 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <StatsCard
            icon={MessageSquare}
            number="40"
            label="Chess"
            color="text-purple-500"
          />
          <StatsCard
            icon={CheckCircle}
            number="125"
            label="Others"
            color="text-purple-500"
          />
        </div>
      </div>

      <div className="border-l-4 border-red-500 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <StatsCard
            icon={XCircle}
            number="17"
            label="Chess"
            color="text-red-500"
          />
          <StatsCard
            icon={MessageSquare}
            number="18"
            label="Others"
            color="text-blue-500"
          />
        </div>
      </div>

      <div className="border-l-4 border-green-500 bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center">
          <StatsCard
            icon={MessageSquare}
            number="40"
            label="Chess"
            color="text-purple-500"
          />
          <StatsCard
            icon={CheckCircle}
            number="125"
            label="Others"
            color="text-purple-500"
          />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Filter board</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-purple-500">Completed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-red-500">Cancelled</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-green-500">Upcoming</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;