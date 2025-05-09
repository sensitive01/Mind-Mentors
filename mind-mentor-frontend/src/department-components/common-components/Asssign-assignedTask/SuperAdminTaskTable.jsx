import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import MyTaskTable from "../task/MyTaskTable";
import TaskAssignedByMeTable from "../task/TaskAssignedByMeTable";
import ShowAllTask from "./ShowAllTask";

const TaskManagement = () => {
  const [activeTab, setActiveTab] = useState("allTasks"); // Default to showing all tasks
  const department = localStorage.getItem("department");

  // Function to render the active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case "allTasks":
        return <ShowAllTask />;
      case "myTask":
        return <MyTaskTable />;
      case "assignedByMe":
        return <TaskAssignedByMeTable />;
      default:
        return <ShowAllTask />;
    }
  };

  return (
    <div className="w-full h-full rounded-lg shadow-sm bg-white">
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex space-x-2 overflow-x-auto">
          <TabButton 
            label="All Tasks" 
            tabKey="allTasks" 
            activeTab={activeTab} 
            onClick={() => setActiveTab("allTasks")} 
          />
          <TabButton 
            label="Tasks Assigned To Me" 
            tabKey="myTask" 
            activeTab={activeTab} 
            onClick={() => setActiveTab("myTask")} 
          />
          <TabButton 
            label="Tasks Assigned By Me" 
            tabKey="assignedByMe" 
            activeTab={activeTab} 
            onClick={() => setActiveTab("assignedByMe")} 
          />
        </div>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#642b8f",
            "&:hover": {
              backgroundColor: "#4a1d6e",
            },
            whiteSpace: "nowrap",
          }}
          component={Link}
          to={`/${department}/department/assign-new-task`}
        >
          + Add New Task
        </Button>
      </div>

      {/* Task Content Section */}
      <div className="bg-gray-50 p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

// Extracted tab button component for cleaner code
const TabButton = ({ label, tabKey, activeTab, onClick }) => (
  <button
    className={`py-2 px-4 font-medium transition-colors relative whitespace-nowrap ${
      activeTab === tabKey
        ? "text-[#642b8f]"
        : "text-gray-600 hover:text-[#642b8f]"
    }`}
    onClick={onClick}
  >
    {label}
    {activeTab === tabKey && (
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
    )}
  </button>
);

export default TaskManagement;