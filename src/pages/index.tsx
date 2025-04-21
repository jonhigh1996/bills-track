import { useState, useEffect } from 'react';
import Head from 'next/head';
import BillForm from '@/components/BillForm';
import Calendar from '@/components/Calendar';
import UpcomingBillsBox from '@/components/UpcomingBillsBox';
import PastDueBillsBox from '@/components/PastDueBillsBox';
import { Bill } from '@/types';
import { getBills, addBill, deleteBill } from '@/utils/storageService';

export default function Home() {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    // Load bills from localStorage on initial render
    setBills(getBills());
  }, []);

  const handleAddBill = (bill: Bill) => {
    const updatedBills = addBill(bill);
    setBills(updatedBills);
  };

  const handleDeleteBill = (id: string) => {
    const updatedBills = deleteBill(id);
    setBills(updatedBills);
  };

  const handleMarkPaid = (id: string) => {
    // Find the bill and mark it as paid by removing it
    // In a real app, you might want to move it to a "paid bills" section instead
    const updatedBills = deleteBill(id);
    setBills(updatedBills);
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
                  bills={bills}
                  onDeleteBill={handleDeleteBill}
                />
                <UpcomingBillsBox 
                  bills={bills} 
                  onDeleteBill={handleDeleteBill} 
                  onMarkPaid={handleMarkPaid}
                />
              </div>
              
              <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md overflow-x-auto">
                <Calendar 
                  bills={bills} 
                  onDeleteBill={handleDeleteBill} 
                  onMarkPaid={handleMarkPaid}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>
          Simple Bill Tracker &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
