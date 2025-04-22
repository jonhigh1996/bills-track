import { useState, useEffect } from 'react';
import Head from 'next/head';
import BillForm from '@/components/BillForm';
import Calendar from '@/components/Calendar';
import UpcomingBillsBox from '@/components/UpcomingBillsBox';
import PastDueBillsBox from '@/components/PastDueBillsBox';
import ExportImport from '@/components/ExportImport';
import MonthlyExpenses from '@/components/MonthlyExpenses';
import { Bill } from '@/types';
import { getBills, addBill, deleteBill } from '@/utils/storageService';
import { generateRecurringBillInstances } from '@/utils/recurringBillsHelper';
import { formatDate } from '@/utils/dateHelpers';

export default function Home() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [processedBills, setProcessedBills] = useState<Bill[]>([]);
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());

  const loadBills = () => {
    setBills(getBills());
  };

  useEffect(() => {
    loadBills();
  }, []);
  
  // Process bills to include recurring instances for the current view
  useEffect(() => {
    // Calculate start and end dates for the current month view (with padding)
    const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    startOfMonth.setMonth(startOfMonth.getMonth() - 1); // Include previous month
    
    const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    endOfMonth.setMonth(endOfMonth.getMonth() + 2); // Include next month
    
    const startDateISO = formatDate(startOfMonth);
    const endDateISO = formatDate(endOfMonth);
    
    // Generate recurring bill instances for the date range
    const processed = generateRecurringBillInstances(bills, startDateISO, endDateISO);
    setProcessedBills(processed);
  }, [bills, currentMonth]);

  const handleAddBill = (bill: Bill) => {
    const updatedBills = addBill(bill);
    setBills(updatedBills);
  };

  const handleDeleteBill = (id: string) => {
    // Check if this is a virtual recurring instance
    const billToDelete = processedBills.find(bill => bill.id === id);
    
    if (billToDelete?.isVirtualRecurringInstance) {
      // For virtual instances, find the original recurring bill
      const originalId = id.split('_')[0];
      const updatedBills = deleteBill(originalId);
      setBills(updatedBills);
    } else {
      // For regular bills, just delete them
      const updatedBills = deleteBill(id);
      setBills(updatedBills);
    }
  };

  const handleMarkPaid = (id: string) => {
    // Check if this is a virtual recurring instance
    const billToMark = processedBills.find(bill => bill.id === id);
    
    if (billToMark?.isVirtualRecurringInstance) {
      // For virtual instances, find the original recurring bill
      const originalId = id.split('_')[0];
      const originalBill = bills.find(bill => bill.id === originalId);
      
      if (originalBill) {
        // Mark the original bill as paid by removing it
        const updatedBills = deleteBill(originalId);
        setBills(updatedBills);
      }
    } else {
      // For regular bills, just delete them
      const updatedBills = deleteBill(id);
      setBills(updatedBills);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Simple Bill Tracker</title>
        <meta name="description" content="A simple app to track your bills" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-center">Simple Bill Tracker</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-4">
            <BillForm onAddBill={handleAddBill} />
          </div>
          
          <div className="lg:col-span-8">
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                <PastDueBillsBox
                  bills={processedBills}
                  onDeleteBill={handleDeleteBill}
                />
                <UpcomingBillsBox 
                  bills={processedBills} 
                  onDeleteBill={handleDeleteBill} 
                  onMarkPaid={handleMarkPaid}
                />
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
                <Calendar 
                  bills={processedBills} 
                  onDeleteBill={handleDeleteBill} 
                  onMarkPaid={handleMarkPaid}
                  onMonthChange={setCurrentMonth}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 sm:py-8 max-w-7xl">
        <MonthlyExpenses bills={processedBills} currentMonth={currentMonth} />
        <ExportImport onImportComplete={loadBills} />
      </div>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>
          Simple Bill Tracker &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
