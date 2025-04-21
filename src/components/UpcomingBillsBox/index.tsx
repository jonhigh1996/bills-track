import React, { useMemo } from 'react';
import { Bill } from '@/types';
import { getDueInDays, formatCurrency } from '@/utils/dateHelpers';

interface UpcomingBillsBoxProps {
  bills: Bill[];
  onDeleteBill: (id: string) => void;
  onMarkPaid: (id: string) => void; // Keeping for interface compatibility, but we won't use it
}

const UpcomingBillsBox: React.FC<UpcomingBillsBoxProps> = ({ bills, onDeleteBill, onMarkPaid }) => {

  const upcomingBills = useMemo(() => {
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

  if (upcomingBills.length === 0) {
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
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Upcoming Bills (7 Days)
      </h2>
      <div className="space-y-3">
        {upcomingBills.map(bill => {
          const daysUntilDue = getDueInDays(bill.dueDate);
          let statusColor = 'bg-green-100 text-green-800';
          
          if (daysUntilDue === 0) {
            statusColor = 'bg-red-100 text-red-800';
          } else if (daysUntilDue <= 2) {
            statusColor = 'bg-orange-100 text-orange-800';
          } else if (daysUntilDue <= 4) {
            statusColor = 'bg-yellow-100 text-yellow-800';
          }
          
          return (
            <div 
              key={bill.id} 
              className="flex items-center justify-between p-4 border rounded-md hover:bg-gray-50 transition duration-200 mb-2 shadow-sm"
            >
              <div className="flex-grow mr-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-lg">{bill.name}</span>
                  <span className="font-semibold text-blue-600">
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
                  <span className="font-medium">Payment Instructions:</span> {bill.paymentMethod || 'Not specified'}
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
        })}
      </div>
    </div>
  );
};

export default UpcomingBillsBox;
