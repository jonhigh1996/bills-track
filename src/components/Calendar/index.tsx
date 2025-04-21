import React, { useState, useEffect, useCallback } from 'react';
import DayCell from '@/components/DayCell';
import { Bill } from '@/types';
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from '@/utils/dateHelpers';

interface CalendarProps {
  bills: Bill[];
}

const Calendar: React.FC<CalendarProps> = ({ bills }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<{ day: number; month: number; year: number; isCurrentMonth: boolean }>>([]);
  
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add days from previous month to fill the first week
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevMonthYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevMonthYear, prevMonth);
    
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({
        day: daysInPrevMonth - firstDayOfMonth + i + 1,
        month: prevMonth,
        year: prevMonthYear,
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        month,
        year,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month to fill the last week
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextMonthYear = month === 11 ? year + 1 : year;
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        month: nextMonth,
        year: nextMonthYear,
        isCurrentMonth: false
      });
    }
    
    setCalendarDays(days);
  };

  const goToPreviousMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const goToCurrentMonth = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 flex justify-between items-center bg-blue-50">
        <button 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-blue-100 transition duration-200"
          aria-label="Previous month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        
        <div className="flex items-center">
          <div className="relative">
            <h2 className="text-xl font-semibold cursor-pointer hover:text-blue-600 transition duration-200">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <button 
            onClick={goToCurrentMonth}
            className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
          >
            Today
          </button>
        </div>
        
        <button 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-blue-100 transition duration-200"
          aria-label="Next month"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      

      
      <div className="grid grid-cols-7 bg-gray-50">
        {daysOfWeek.map(day => (
          <div key={day} className="py-2 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7">
        {calendarDays.map((dayData, index) => (
          <DayCell
            key={index}
            day={dayData.day}
            month={dayData.month}
            year={dayData.year}
            bills={bills}
            isCurrentMonth={dayData.isCurrentMonth}
          />
        ))}
      </div>
    </div>
  );
};

export default Calendar;
