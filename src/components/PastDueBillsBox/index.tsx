import React, { useMemo } from 'react';
import { Bill } from '@/types';
import { getDueInDays } from '@/utils/dateHelpers';

interface PastDueBillsBoxProps {
  bills: Bill[];
  onDeleteBill: (id: string) => void;
}

const PastDueBillsBox: React.FC<PastDueBillsBoxProps> = ({ bills, onDeleteBill }) => {
  const pastDueBills = useMemo(() => {
    return bills
      .filter(bill => {
        const dueDate = new Date(bill.dueDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        return dueDate < today;
      })
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }, [bills]);

  if (pastDueBills.length === 0) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center mb-4">
        <div className="bg-red-100 p-2 rounded-full mr-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-red-600">Past Due Bills</h2>
      </div>
      
      <div className="space-y-3">
        {pastDueBills.length === 0 ? (
          <p className="text-gray-500 text-center py-3">No past due bills. Great job!</p>
        ) : (
          pastDueBills.map(bill => {
            const daysOverdue = Math.abs(getDueInDays(bill.dueDate));
            
            return (
              <div 
                key={bill.id} 
                className="flex items-center justify-between p-4 border border-red-200 rounded-md bg-red-50 hover:bg-red-100 transition duration-200 mb-2 shadow-sm"
              >
                <div className="flex-grow mr-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-lg">{bill.name}</span>
                    <span className="font-semibold text-red-600">
                      ${bill.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  
                  <div className="text-sm text-red-600 mt-1">
                    Due {new Date(bill.dueDate).toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })}
                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                      {daysOverdue} {daysOverdue === 1 ? 'day' : 'days'} overdue
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 mt-2 border-t border-red-100 pt-2">
                    <span className="font-medium">Payment Instructions:</span> {bill.paymentMethod || 'Not specified'}
                  </div>
                </div>
                
                <div>
                  {onDeleteBill && (
                    <button 
                      onClick={() => onDeleteBill(bill.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition duration-200 rounded-md hover:bg-red-200"
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

export default PastDueBillsBox;
