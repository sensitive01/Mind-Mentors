import { useState, useEffect } from 'react';
import { Card, CardContent } from '@mui/material';
import { Calendar, X } from 'lucide-react';
import { fetchAllHoliday } from '../../../api/service/employee/EmployeeService';

const ImageModal = ({ src, alt, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-4xl w-full mx-4 animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <img
          src={src}
          alt={alt}
          className="w-full h-auto rounded-lg shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
};
const HolidayCard = ({ holiday }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const calculateDurationAndMergedDate = () => {
    if (holiday?.startDate && holiday?.endDate) {
      const start = new Date(holiday.startDate);
      const end = new Date(holiday.endDate);
      const diffTime = Math.abs(end - start);
      const duration = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const startDateFormatted = start.toLocaleDateString('en-US', options);
      const endDateFormatted = end.toLocaleDateString('en-US', options);
      let mergedDate = duration > 1
        ? `${startDateFormatted.split(' ').slice(0, 2).join(' ')}-${endDateFormatted.split(' ').slice(1).join(' ')}`
        : startDateFormatted;
      return { mergedDate, duration };
    }
    return { mergedDate: '', duration: 0 };
  };
  const { mergedDate, duration } = calculateDurationAndMergedDate();
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-xl transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1 bg-white/90 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 bg-gradient-to-br from-violet-500 via-fuchsia-500 to-rose-500 translate-x-16 -translate-y-16 transition-transform duration-700 ${
            isHovered ? 'scale-150' : 'scale-100'
          }`} 
        />
        <CardContent className="p-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-lg font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent transform transition-all duration-300 group-hover:scale-105">
                  {holiday.holidayName}
                </p>
                <p className="text-sm text-gray-500">{holiday.category}</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 text-white text-sm font-medium transform transition-all duration-300 group-hover:scale-110">
                {duration} Days
              </span>
            </div>
            {holiday.attachment && (
              <div 
                className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
                onClick={() => setShowImageModal(true)}
              >
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Click to enlarge
                  </span>
                </div>
                <img
                  src={holiday.attachment}
                  alt="Holiday"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-fuchsia-500 transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-base font-medium text-gray-700">{mergedDate}</span>
            </div>
            <p className="text-gray-600 leading-relaxed text-sm transform transition-all duration-300">
              {holiday.description}
            </p>
          </div>
        </CardContent>
      </Card>
      {showImageModal && (
        <ImageModal
          src={holiday.attachment}
          alt={holiday.holidayName}
          onClose={() => setShowImageModal(false)}
        />
      )}
    </>
  );
};
const HolidayCalendar = () => {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetchAllHoliday();
        if (Array.isArray(response)) {
          setHolidays(response);
        } else {
          setError('Invalid data format received');
        }
      } catch (err) {
        setError('Failed to fetch holidays');
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, []);
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-fuchsia-500" />
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-4">
          <div className="inline-block p-2 rounded-full bg-white shadow-xl mb-6">
            <div className="px-4 sm:px-6 py-2 rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-rose-500 text-white font-medium">
              Celebrating Special Moments
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
            <span className="bg-gradient-to-r from-violet-600 via-fuchsia-600 to-rose-600 bg-clip-text text-transparent">
              2025 Celebrations
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-4">
          "Discover and celebrate key moments with our curated holiday calendar."
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {holidays.map((holiday, index) => (
            <HolidayCard key={index} holiday={holiday} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default HolidayCalendar;