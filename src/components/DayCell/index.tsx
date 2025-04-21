import React from 'react';
import { Bill } from '@/types';
import { isToday, formatCurrency } from '@/utils/dateHelpers';

interface DayCellProps {
  day: number;
  month: number;
  year: number;
  bills: Bill[];
  isCurrentMonth: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ 
  day, 
  month, 
  year, 
  bills, 
  isCurrentMonth
}) => {
  const date = new Date(year, month, day);
  const dayBills = bills.filter(bill => {
    // Parse the ISO date string (YYYY-MM-DD)
    const billDate = new Date(bill.dueDate);
    return (
      billDate.getDate() === day &&
      billDate.getMonth() === month &&
      billDate.getFullYear() === year
    );
  });

  const today = isToday(date);
  
  return (
    <div 
      className={`
        min-h-24 p-2 border border-gray-200 
        ${!isCurrentMonth ? 'bg-gray-100 text-gray-400' : 'bg-white'}
        ${today ? 'ring-2 ring-blue-500' : ''}
      `}
      aria-label={`${month + 1}/${day}/${year}${dayBills.length > 0 ? `, ${dayBills.length} bill${dayBills.length > 1 ? 's' : ''}` : ''}`}
    >
      <div className="flex justify-between items-start">
        <span 
          className={`
            text-sm font-medium 
            ${today ? 'bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center' : ''}
          `}
        >
          {day}
        </span>
      </div>
      
      <div className="mt-2">
        {dayBills.map(bill => (
          <div 
            key={bill.id} 
            className="text-xs mb-1 p-1 rounded bg-blue-50 border-l-4 border-blue-500"
          >
            <div className="font-medium truncate">{bill.name}</div>
            <div className="text-blue-700">{formatCurrency(bill.amount)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCell;
