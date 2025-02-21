import { Bell } from "lucide-react";

const NotificationItem = ({ time, title, message, type }) => (
  <div className="flex gap-6 relative">
    <div className="relative shrink-0 w-[14px]">
      <div className="absolute left-1/2 top-7 w-[2px] h-full bg-purple-500 -translate-x-1/2" />
      <div className="absolute left-1/2 top-1.5 w-4 h-4 rounded-full border-2 border-purple-500 bg-white -translate-x-1/2" />
    </div>

    <div className="w-[60px] pt-[2px] text-gray-400 text-sm shrink-0">
      {time}
    </div>

    <div className="flex-1 pb-8">
      <div>
        <span
          className={`font-medium text-[15px] ${
            type === "payment"
              ? "text-orange-500"
              : type === "upcoming"
              ? "text-blue-500"
              : type === "achievement"
              ? "text-green-500"
              : "text-black"
          }`}
        >
          {title}
        </span>
        <p className="text-gray-400 mt-0.5 text-[14px] leading-relaxed">
          {message}
        </p>
      </div>
    </div>
  </div>
);

const ParentNotifications = () => {
  const notifications = [
    {
      time: "Now",
      title: "Tournament Registration Open",
      message:
        "Spring Chess Tournament registration is now open. Register before Feb 25th.",
      type: "upcoming",
    },
    {
      time: "2h ago",
      title: "Payment Due",
      message: "Monthly chess class payment for March is due in 3 days.",
      type: "payment",
    },
    {
      time: "Yesterday",
      title: "Achievement Unlocked",
      message: "Sarah completed the Advanced Tactics module with distinction!",
      type: "achievement",
    },
    {
      time: "2 days ago",
      title: "Class Rescheduled",
      message:
        "Next week's Wednesday class will be held at 4 PM instead of 3 PM.",
      type: "upcoming",
    },
    {
      time: "3 days ago",
      title: "New Learning Materials",
      message:
        "New chess puzzles have been uploaded to your child's dashboard.",
      type: "upcoming",
    },
    {
      time: "1 week ago",
      title: "Payment Successful",
      message: "February month's chess class payment has been processed.",
      type: "payment",
    },
    {
      time: "2 weeks ago",
      title: "Class Performance",
      message:
        "Monthly progress report has been generated. View your child's performance.",
      type: "achievement",
    },
  ];

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-[#b115b1]">
      <div className="px-6 pt-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center">
            <Bell className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-[#b115b1] text-2xl font-semibold">
            Notifications
          </h2>
        </div>
      </div>

      <div className="px-6 pb-4">
        <div
          className="relative h-[380px] overflow-y-auto pr-3"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#E2E8F0 #CBD5E1",
          }}
        >
          <div className="relative">
            {notifications.map((notification, index) => (
              <NotificationItem
                key={index}
                time={notification.time}
                title={notification.title}
                message={notification.message}
                type={notification.type}
              />
            ))}

            <div className="relative w-[14px]">
              <div className="absolute left-1/2 bottom-0 w-[2px] h-6 bg-white -translate-x-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentNotifications;
