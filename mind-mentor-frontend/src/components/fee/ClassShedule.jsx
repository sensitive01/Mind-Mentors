import  { useState } from 'react';
import { Search, Cloud, Printer, Menu, List, Check, X, ChevronDown } from 'lucide-react';

const ClassSchedule = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const scheduleData = [
    {
      name: "Gabby George",
      classTitle: "Business Analyst",
      notes: "",
      status: "Completed",
      date: "10th Oct, 2024 12:30 pm"
    },
    {
      name: "Aiden Lloyd",
      classTitle: "Business Consultant",
      notes: "",
      status: "Completed",
      date: "09th Oct, 2024 12:30 pm"
    },
    {
      name: "Jaden Collins",
      classTitle: "Attorney",
      notes: "",
      status: "Paused",
      date: "08th Oct, 2024 12:30 pm"
    },
    {
      name: "Franky Rees",
      classTitle: "Business Analyst",
      notes: "",
      status: "Completed",
      date: "07th Oct, 2024 12:30 pm"
    }
  ];

  const filterOptions = {
    name: ['All', 'Gabby George', 'Aiden Lloyd', 'Jaden Collins', 'Franky Rees'],
    title: ['All', 'Business Analyst', 'Business Consultant', 'Attorney'],
    status: ['All', 'Completed', 'Paused', 'In Progress'],
    salary: ['All', '$0-$50k', '$50k-$100k', '$100k+']
  };

  return (
    <div className="p-6 bg-white">
 
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-violet-600">Class Schedules</h1>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowSearch(true)}>
            <Search className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
          <Cloud className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          <Printer className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          <Menu className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          <List className="w-6 h-6 text-gray-400 hover:text-gray-600" />
        </div>
      </div>

    
      {showSearch && (
        <div className="mb-4 relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
          <button
            onClick={() => {
              setShowSearch(false);
              setSearchQuery('');
            }}
            className="absolute right-3 top-2.5"
          >
            <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      )}

  
      <div className="flex justify-end mb-4">
        <button 
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg"
        >
          FILTERS
        </button>
      </div>

    
      {open && (
        <div className="fixed inset-0 flex justify-center items-start pt-20 bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[600px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">FILTERS</h3>
              <div className="flex items-center gap-4">
                <button 
                  className="text-violet-600 text-sm font-medium hover:text-violet-700"
                  onClick={() => setOpen(false)}
                >
                  RESET
                </button>
                <button onClick={() => setOpen(false)}>
                  <X className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {Object.entries(filterOptions).map(([key, options]) => (
                <div key={key} className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 capitalize">{key}</label>
                  <div className="relative">
                    <select className="w-full border border-gray-300 rounded-lg px-3 py-2 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-violet-500">
                      {options.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="w-12 py-4 px-6">
                <input type="checkbox" className="rounded border-gray-300" />
              </th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Name</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Class Title</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Notes</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {scheduleData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <input type="checkbox" className="rounded border-gray-300" />
                </td>
                <td className="py-4 px-6 text-sm text-gray-600">{row.name}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{row.classTitle}</td>
                <td className="py-4 px-6 text-sm text-gray-600">{row.notes}</td>
                <td className="py-4 px-6">
                  {row.status === 'Completed' ? (
                    <div className="flex items-center gap-2">
                      <div className="bg-violet-600 rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-violet-600">Completed</span>
                    </div>
                  ) : (
                    <div className="bg-violet-100 text-violet-600 px-4 py-1 rounded-full text-sm inline-block">
                      {row.status}
                    </div>
                  )}
                </td>
                <td className="py-4 px-6 text-sm text-gray-400">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassSchedule;