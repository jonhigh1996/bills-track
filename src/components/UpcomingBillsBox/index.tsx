import React, { useMemo, useState } from 'react';
import { Bill } from '@/types';
import { getDueInDays } from '@/utils/dateHelpers';
import { formatRecurringFrequency } from '@/utils/recurringBillsHelper';

interface UpcomingBillsBoxProps {
  bills: Bill[];
  onDeleteBill: (id: string) => void;
  onMarkPaid: (id: string) => void; // Keeping for interface compatibility, but we won't use it
}

const UpcomingBillsBox: React.FC<UpcomingBillsBoxProps> = ({ bills, onDeleteBill, 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onMarkPaid 
}) => {
  const [showAutoPaid, setShowAutoPaid] = useState(false);

  // Get all upcoming bills
  const allUpcomingBills = useMemo(() => {
    return bills
      .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);
        
        // Only include bills that are due today or in the future (not past due)
        // and within the next 7 days
        return dueDate >= today && dueDate <= sevenDaysFromNow;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  // Filter bills based on auto-paid status
  const upcomingBills = useMemo(() => {
    if (showAutoPaid) {
      return allUpcomingBills;
    } else {
      return allUpcomingBills.filter(bill => !bill.isAutoPaid);
    }
  }, [allUpcomingBills, showAutoPaid]);

  // Count of auto-paid bills that are hidden
  const hiddenAutoPaidCount = useMemo(() => {
    return allUpcomingBills.filter(bill => bill.isAutoPaid).length;
  }, [allUpcomingBills]);

  // If there are no upcoming bills at all
  if (allUpcomingBills.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Upcoming Bills (7 Days)
        </h2>
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500 italic">No bills due in the next 7 days</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Upcoming Bills (7 Days)
        </h2>
        
        <button 
          onClick={() => setShowAutoPaid(!showAutoPaid)}
          className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-colors ${showAutoPaid ? 'bg-purple-100 text-purple-700 hover:bg-purple-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          aria-label={showAutoPaid ? "Hide auto-paid bills" : "Show auto-paid bills"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-1 ${showAutoPaid ? 'text-purple-500' : 'text-gray-500'}`} viewBox="0 0 20 20" fill="currentColor">
            {showAutoPaid ? (
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-14-14zm1.414 1.414l.707.707m8.486 8.486l1.414 1.414" clipRule="evenodd" />
            ) : (
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
            )}
          </svg>
          {showAutoPaid ? "Hide Auto-Paid" : "Show Auto-Paid"}
        </button>
      </div>

      <div className="space-y-3">
        {upcomingBills.length === 0 ? (
          <div className="text-center py-3">
            {!showAutoPaid && hiddenAutoPaidCount > 0 ? (
              <div>
                <p className="text-gray-500 mb-2">No manual bills due in the next 7 days</p>
                <button 
                  onClick={() => setShowAutoPaid(true)}
                  className="text-sm text-purple-600 hover:text-purple-800 underline"
                >
                  Show {hiddenAutoPaidCount} auto-paid bill{hiddenAutoPaidCount !== 1 ? 's' : ''}
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No bills due in the next 7 days</p>
            )}
          </div>
        ) : (
          upcomingBills.map(bill => {
            const daysUntilDue = getDueInDays(bill.dueDate);
            
            return (
              <div 
                key={bill.id} 
                className={`flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition duration-200 mb-2 shadow-sm ${bill.isAutoPaid ? 'border-l-4 border-l-purple-500' : ''}`}
              >
                <div className="flex-grow mr-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg flex items-center">
                      {bill.name}
                      <div className="flex ml-2">
                        {bill.isRecurring && (
                          <span 
                            className="inline-block w-3 h-3 rounded-full bg-green-500 mr-1"
                            title={`Recurring ${formatRecurringFrequency(bill.recurringFrequency)}`}
                          ></span>
                        )}
                        {bill.isAutoPaid && (
                          <span 
                            className="inline-block w-3 h-3 rounded-full bg-purple-500"
                            title="Automatically Paid"
                          ></span>
                        )}
                      </div>
                    </span>
                    <span className={`font-semibold ${bill.isRecurring ? 'text-green-600' : 'text-blue-600'}`}>
                      ${bill.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div className="text-sm text-gray-600 mt-1">
                    Due {new Date(bill.dueDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                    <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                      {daysUntilDue === 0 ? 'Due today' : daysUntilDue === 1 ? 'Due tomorrow' : `${daysUntilDue} days`}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-2 border-t border-gray-100 pt-2">
                    {bill.isRecurring && (
                      <div className="mb-1">
                        <span className="font-medium">Recurring:</span> {formatRecurringFrequency(bill.recurringFrequency)}
                        {bill.recurringEndDate && (
                          <span className="ml-2">
                            <span className="font-medium">Until:</span> {new Date(bill.recurringEndDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    )}
                    {bill.isAutoPaid && (
                      <div className="mb-1">
                        <span className="font-medium text-purple-600">Automatically Paid</span>
                      </div>
                    )}
                    <span className="font-medium">Payment Instructions:</span> {bill.paymentMethod || 'Not specified'}
                    {bill.isVirtualRecurringInstance && (
                      <div className="mt-1 italic text-gray-500">
                        This is an automatically generated instance of a recurring bill.
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  {onDeleteBill && (
                    <button 
                      onClick={() => onDeleteBill(bill.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition duration-200 rounded-md hover:bg-gray-100"
                      aria-label="Delete bill"
                      title="Delete bill"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingBillsBox;
