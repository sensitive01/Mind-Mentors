import { Search, Cloud, Menu, List, Check, Printer } from 'lucide-react';

const Fee = () => {
  const feeData = [
    {
      sno: "01",
      chessKidId: "MM123",
      program: "Chess",
      level: "Intermediate",
      type: "Online",
      subscription: "02",
      amount: "45,000.00",
      status: "Completed",
      date: "10th Oct, 2024 12:30 pm",
      hasPrinter: true
    },
    {
      sno: "02",
      chessKidId: "MM123",
      program: "Chess",
      level: "Beginner",
      type: "Offline",
      subscription: "01",
      amount: "45,000.00",
      status: "Completed",
      date: "09th Oct, 2024 12:30 pm",
      hasPrinter: true
    },
    {
      sno: "03",
      chessKidId: "MM123",
      program: "Chess",
      level: "Advanced",
      type: "Online",
      subscription: "02",
      amount: "45,000.00",
      status: "Pending",
      date: "08th Oct, 2024 12:30 pm",
      hasPrinter: false
    },
    {
      sno: "04",
      chessKidId: "MM123",
      program: "Chess",
      level: "Intermediate",
      type: "Online",
      subscription: "02",
      amount: "45,000.00",
      status: "Completed",
      date: "07th Oct, 2024 12:30 pm",
      hasPrinter: true
    },
    {
      sno: "05",
      chessKidId: "MM123",
      program: "Chess",
      level: "Intermediate",
      type: "Online",
      subscription: "02",
      amount: "45,000.00",
      status: "Completed",
      date: "07th Oct, 2024 12:30 pm",
      hasPrinter: true
    },
    {
      sno: "06",
      chessKidId: "MM123",
      program: "Chess",
      level: "Intermediate",
      type: "Online",
      subscription: "02",
      amount: "45,000.00",
      status: "Completed",
      date: "07th Oct, 2024 12:30 pm",
      hasPrinter: true
    }
  ];

  return (
    <div className="p-6">
    
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold text-primary">Fee Details</h1>
        <div className="flex gap-6">
          <Search className="w-6 h-6 text-gray-400" />
          <Cloud className="w-6 h-6 text-gray-400" />
          <Menu className="w-6 h-6 text-gray-400" />
          <List className="w-6 h-6 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Sno</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">ChessKid ID</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Program</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Level</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Type</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Subscription</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="py-4 px-6 text-center text-sm font-medium text-gray-600"></th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="py-4 px-6 text-left text-sm font-medium text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {feeData.map((row, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-6 px-6 text-gray-600">{row.sno}</td>
                <td className="py-6 px-6 text-gray-600">{row.chessKidId}</td>
                <td className="py-6 px-6 text-gray-600">{row.program}</td>
                <td className="py-6 px-6 text-gray-600">{row.level}</td>
                <td className="py-6 px-6 text-gray-600">{row.type}</td>
                <td className="py-6 px-6 text-gray-600">{row.subscription}</td>
                <td className="py-6 px-6 text-gray-600">{row.amount}</td>
                <td className="py-6 px-6 text-center">
                  {row.hasPrinter && <Printer className="w-5 h-5 text-gray-400 inline-block" />}
                </td>
                <td className="py-6 px-6">
                  {row.status === 'Completed' ? (
                    <div className="flex items-center gap-2 text-primary">
                      <div className="bg-primary rounded-full p-1">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      {row.status}
                    </div>
                  ) : (
                    <div className="bg-violet-100 text-primary px-4 py-1 rounded-full text-sm">
                      {row.status}
                    </div>
                  )}
                </td>
                <td className="py-6 px-6 text-gray-400">{row.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Fee;