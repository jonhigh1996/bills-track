import React, { useState } from 'react';
import { Bill } from '@/types';
import { isToday } from '@/utils/dateHelpers';

interface DayCellProps {
  day: number;
  month: number;
  year: number;
  bills: Bill[];
  isCurrentMonth: boolean;
  onDeleteBill?: (id: string) => void;
  onMarkPaid?: (id: string) => void;
}

const DayCell: React.FC<DayCellProps> = ({ 
  day, 
  month, 
  year, 
  bills, 
  isCurrentMonth,
  onDeleteBill,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMarkPaid
}) => {
  const [expandedBillId, setExpandedBillId] = useState<string | null>(null);
  
  const toggleBillDetails = (billId: string) => {
    if (expandedBillId === billId) {
      setExpandedBillId(null);
    } else {
      setExpandedBillId(billId);
    }
  };

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
        min-h-16 sm:min-h-24 p-1 sm:p-2 border border-gray-200 
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
      
      <div className="mt-1 sm:mt-2">
        {dayBills.map(bill => (
          <div 
            key={bill.id} 
            className="text-xs mb-1 sm:mb-2 p-1 sm:p-2 rounded-md bg-blue-50 border-l-4 border-blue-500 shadow-sm"
          >
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleBillDetails(bill.id)}>
              <div className="text-sm font-medium truncate">{bill.name}</div>
              <button 
                className="text-gray-500 hover:text-gray-700 focus:outline-none flex items-center justify-center bg-white rounded-full p-1 border border-gray-200 shadow-sm"
                aria-label={expandedBillId === bill.id ? "Hide details" : "Show details"}
              >
                {expandedBillId === bill.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
            <div className="text-sm font-semibold text-blue-600 mt-1">
              ${bill.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            {expandedBillId === bill.id && (
              <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-gray-600 animate-fadeIn">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Payment Instructions:</span>
                  {onDeleteBill && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBill(bill.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-500 transition duration-200 rounded-full hover:bg-red-50"
                      aria-label="Delete bill"
                      title="Delete bill"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="text-xs">{bill.paymentMethod || 'Not specified'}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCell;
