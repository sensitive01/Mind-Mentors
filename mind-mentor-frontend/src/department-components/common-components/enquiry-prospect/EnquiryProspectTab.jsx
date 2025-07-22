import React, { useState } from "react";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import Prospect from "../prospects/Prospects";
import Enquiry from "../enquiries/Enquires";
import ActiveKids from "../../../department-components/common-components/enrolled-kids-SD/ActiveEnquiry"; // Import your new component

const EnquiryProspectTab = () => {
  const [activeTab, setActiveTab] = useState("enquiry");
  const department = localStorage.getItem("department");

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <div className="flex space-x-4">
          {/* Leads */}
          <button
            className={`py-2 px-4 font-medium transition-colors relative ${
              activeTab === "enquiry"
                ? "text-[#642b8f]"
                : "text-gray-600 hover:text-[#642b8f]"
            }`}
            onClick={() => setActiveTab("enquiry")}
          >
            Leads
            {activeTab === "enquiry" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
            )}
          </button>

          {/* Prospects */}
          <button
            className={`py-2 px-4 font-medium transition-colors relative ${
              activeTab === "prospects"
                ? "text-[#642b8f]"
                : "text-gray-600 hover:text-[#642b8f]"
            }`}
            onClick={() => setActiveTab("prospects")}
          >
            Prospects
            {activeTab === "prospects" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
            )}
          </button>

          {/* Active Kids */}
          <button
            className={`py-2 px-4 font-medium transition-colors relative ${
              activeTab === "activeKids"
                ? "text-[#642b8f]"
                : "text-gray-600 hover:text-[#642b8f]"
            }`}
            onClick={() => setActiveTab("activeKids")}
          >
            Active Kids
            {activeTab === "activeKids" && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#642b8f]" />
            )}
          </button>
        </div>

        {/* New Enquiry Button */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#642b8f",
            "&:hover": {
              backgroundColor: "#4a1d6e",
              color: "#f8a213",
            },
          }}
          component={Link}
          to={`/${department}/department/enquiry-form`}
        >
          + New Enquiry Form
        </Button>
      </div>

      {/* Tab Content */}
      <div className="p-2">
        {activeTab === "enquiry" && <Enquiry />}
        {activeTab === "prospects" && <Prospect />}
        {activeTab === "activeKids" && <ActiveKids />}
      </div>
    </div>
  );
};

export default EnquiryProspectTab;
