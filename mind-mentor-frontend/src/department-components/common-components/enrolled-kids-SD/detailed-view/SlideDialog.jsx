import React from 'react';
import { X } from 'lucide-react';

const TaskAssignmentOverlay = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-start justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Sliding Panel */}
      <div 
        className={`relative h-full w-full md:w-1/3  bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
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
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignmentOverlay;