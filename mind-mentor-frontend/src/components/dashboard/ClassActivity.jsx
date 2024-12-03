/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */

import { Clock } from "lucide-react";

const TimelineItem = ({ time, status, description }) => (
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
            status === "Paused" ? "text-red-500" : "text-black"
          }`}
        >
          {status}
        </span>
        <p className="text-gray-400 mt-0.5 text-[14px] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const ClassActivity = () => {
  const activities = [
    {
      time: "Now",
      status: "Attended",
      description: "Current class session in progress.",
    },
    {
      time: "11:20",
      status: "Attended",
      description: "Quisque a consequat ante, at volutpat enim.",
    },
    {
      time: "Yesterday",
      status: "Paused",
      description: "Aenean sit amet magna vel magna fringilla fermentum.",
    },
    {
      time: "7 Oct",
      status: "Attended",
      description: "Nam posuere accumsan porta.",
    },
    {
      time: "6 Oct",
      status: "Attended",
      description: "Mathematics class - Chapter 4 review.",
    },
    {
      time: "5 Oct",
      status: "Missed",
      description: "Science laboratory session.",
    },
    {
      time: "4 Oct",
      status: "Attended",
      description: "Literature discussion group.",
    },
  ];

  return (
    <div className="w-full max-w-2xl bg-white rounded-lg shadow-md border border-[#b115b1]">
      <div className="px-6 pt-5">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center">
            <Clock className="w-5 h-5 text-purple-500" />
          </div>
          <h2 className="text-[#b115b1] text-2xl font-semibold">Class Activity</h2>


        </div>
      </div>

      <div className="px-6 pb-4">
        <div className="relative max-h-[380px] overflow-y-auto pr-3 custom-scrollbar">
          <div className="relative">
            {activities.map((activity, index) => (
              <TimelineItem
                key={index}
                time={activity.time}
                status={activity.status}
                description={activity.description}
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

export default ClassActivity;
