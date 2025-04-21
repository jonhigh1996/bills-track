import { useState, useEffect } from 'react';
import Head from 'next/head';
import BillForm from '@/components/BillForm';
import Calendar from '@/components/Calendar';
import UpcomingBillsBox from '@/components/UpcomingBillsBox';
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

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Simple Bill Tracker
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <BillForm onAddBill={handleAddBill} />
              <UpcomingBillsBox 
                bills={bills} 
                onDeleteBill={handleDeleteBill} 
                onMarkPaid={handleMarkPaid}
              />
            </div>
          </div>
          
          <div className="lg:col-span-2">
            <Calendar bills={bills} />
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-gray-500 text-sm">
        <p>
          Simple Bill Tracker &copy; {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
