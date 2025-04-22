import React, { useMemo } from 'react';
import { Bill } from '@/types';

interface MonthlyExpensesProps {
  bills: Bill[];
  currentMonth: Date;
}

const MonthlyExpenses: React.FC<MonthlyExpensesProps> = ({ bills, currentMonth }) => {
  const totalExpenses = useMemo(() => {
    // Get the first and last day of the current month
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    
    // Filter bills for the current month
    const monthlyBills = bills.filter(bill => {
      const dueDate = new Date(bill.dueDate);
      return dueDate >= firstDay && dueDate <= lastDay;
    });
    
    // Calculate total
    return monthlyBills.reduce((total, bill) => total + bill.amount, 0);
  }, [bills, currentMonth]);
  
  // Use a stable date format that will be consistent between server and client
  const monthYearDisplay = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}`;
  
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Monthly Expenses Summary</h2>
      
      <div className="flex justify-center">
        <div className="bg-blue-50 p-4 rounded-lg text-center w-full max-w-md">
          <p className="text-sm text-gray-600 mb-1">Total Monthly Expenses</p>
          <p className="text-3xl font-bold text-blue-600">${totalExpenses.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-500">
        Showing expenses for {new Date(parseInt(monthYearDisplay.split('-')[0]), parseInt(monthYearDisplay.split('-')[1]) - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
};

export default MonthlyExpenses;
