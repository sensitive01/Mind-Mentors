import React, { useState } from 'react';
import { X as CloseIcon } from 'lucide-react';

const ZoomMeetingFrame = ({ zoomLink, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="fixed inset-0 z-50 bg-white">
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={onClose}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      
      <div className="w-full h-full">
        <iframe
          src={zoomLink}
          allow="camera; microphone; fullscreen; display-capture"
          className="w-full h-full border-0"
          onLoad={() => setIsLoading(false)}
        />
        
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
              <p className="text-gray-600">Loading meeting...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ZoomMeetingFrame;