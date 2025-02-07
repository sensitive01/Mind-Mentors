import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import MyTaskTable from "../task/MyTaskTable"
import TaskAssignedByMeTable from "../task/TaskAssignedByMeTable"


const AssignAssignedTask = () => {
  const [activeTab, setActiveTab] = useState("myTask");
  const department = localStorage.getItem("department");

  return (
    <div className="w-full h-full  rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between  items-center px-6 py-4 border-b">
        <div className="flex space-x-4 ">
          <button
            className={`py-2 px-4 font-medium transition-colors relative ${
              activeTab === "myTask"
                ? "text-[#642b8f]"
                : "text-gray-600 hover:text-[#642b8f]"
            }`}
            onClick={() => setActiveTab("myTask")}
          >
            MyTaskTable
            {activeTab === "myTask" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
            )}
          </button>
          <button
            className={`py-2 px-4 font-medium transition-colors relative ${
              activeTab === "assignedByMe"
                ? "text-[#642b8f]"
                : "text-gray-600 hover:text-[#642b8f]"
            }`}
            onClick={() => setActiveTab("assignedByMe")}
          >
            Assigned By Me
            {activeTab === "assignedByMe" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
            )}
          </button>
        </div>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#642b8f",
            "&:hover": {
              backgroundColor: "#4a1d6e",
            },
          }}
          component={Link}
          to={`/${department}/department/assign-new-task`}
        >
          + Assign New Task
        </Button>
      </div>

      {activeTab === "myTask" ? <MyTaskTable /> : <TaskAssignedByMeTable />}
    </div>
  );
};
export default AssignAssignedTask;
