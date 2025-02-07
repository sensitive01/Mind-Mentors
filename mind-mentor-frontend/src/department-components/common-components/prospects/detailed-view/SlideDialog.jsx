import React from "react";
import { X } from "lucide-react";
import { Dialog, Slide } from "@mui/material";

const TaskAssignmentOverlay = ({ isOpen, onClose, children }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "right" }}
      maxWidth={false}
      PaperProps={{
        sx: {
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "100%",
          maxWidth: "33.333%", // md:w-1/3 equivalent
          margin: 0,
          borderRadius: 0,
          zIndex: 1500, // Ensure high z-index
        },
      }}
      sx={{
        zIndex: 1500, // Ensure dialog is on top
        "& .MuiDialog-container": {
          justifyContent: "flex-end",
          alignItems: "stretch",
        },
      }}
    >
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-primary to-purple-500 p-4 flex justify-between items-center shadow-md">
        <h2 className="text-2xl font-semibold text-white">Assign Task</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="text-white" size={24} />
        </button>
      </div>

      {/* Content Area */}
      <div className="h-[calc(100vh-64px)] overflow-y-auto bg-gray-50">
        <div className="p-6">{children}</div>
      </div>
    </Dialog>
  );
};

export default TaskAssignmentOverlay;
