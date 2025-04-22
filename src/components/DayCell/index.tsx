import React, { useState } from 'react';
import { Bill } from '@/types';
import { isToday } from '@/utils/dateHelpers';
import { formatRecurringFrequency } from '@/utils/recurringBillsHelper';

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
            className={`text-xs mb-1 sm:mb-2 p-1 sm:p-2 rounded-md ${bill.isRecurring ? 'bg-green-50 border-l-4 border-green-500' : 'bg-blue-50 border-l-4 border-blue-500'} ${bill.isAutoPaid ? 'border-r-4 border-r-purple-500' : ''} shadow-sm`}
          >
            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleBillDetails(bill.id)}>
              <div className="text-sm font-medium truncate flex items-center">
                {bill.name}
                <div className="flex ml-1">
                  {bill.isRecurring && (
                    <span 
                      className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"
                      title={`Recurring ${formatRecurringFrequency(bill.recurringFrequency)}`}
                    ></span>
                  )}
                  {bill.isAutoPaid && (
                    <span 
                      className="inline-block w-2 h-2 rounded-full bg-purple-500"
                      title="Automatically Paid"
                    ></span>
                  )}
                </div>
              </div>
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
            <div className={`text-sm font-semibold ${bill.isRecurring ? 'text-green-600' : 'text-blue-600'} mt-1`}>
              ${bill.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </div>
            {expandedBillId === bill.id && (
              <div className={`mt-2 pt-2 border-t ${bill.isRecurring ? 'border-green-200' : 'border-blue-200'} text-xs text-gray-600 animate-fadeIn`}>
                {bill.isRecurring && (
                  <div className="mb-2">
                    <span className="font-medium">Recurring:</span> {formatRecurringFrequency(bill.recurringFrequency)}
                    {bill.recurringEndDate && (
                      <div>
                        <span className="font-medium">Until:</span> {new Date(bill.recurringEndDate).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                )}
                {bill.isAutoPaid && (
                  <div className="mb-2">
                    <span className="font-medium text-purple-600">Automatically Paid</span>
                  </div>
                )}
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium">Payment Instructions:</span>
                  {onDeleteBill && (
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteBill(bill.id);
                      }}
                      className="ml-1 bg-gray-100 text-gray-600 hover:text-red-500 hover:bg-red-50 transition duration-200 font-bold rounded px-1.5 py-0.5 flex items-center justify-center"
                      aria-label="Delete bill"
                      title="Delete bill"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="text-xs">{bill.paymentMethod || 'Not specified'}</div>
                {bill.isVirtualRecurringInstance && (
                  <div className="mt-2 text-xs italic text-gray-500">
                    This is an automatically generated instance of a recurring bill.
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DayCell;
