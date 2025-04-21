import { Bill } from '@/types';

const STORAGE_KEY = 'billtracker_bills';

export const getBills = (): Bill[] => {
  if (typeof window === 'undefined') return [];
  
  const storedBills = localStorage.getItem(STORAGE_KEY);
  return storedBills ? JSON.parse(storedBills) : [];
};

export const saveBills = (bills: Bill[]): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
};

export const addBill = (bill: Bill): Bill[] => {
  const bills = getBills();
  const updatedBills = [...bills, bill];
  saveBills(updatedBills);
  return updatedBills;
};

export const deleteBill = (id: string): Bill[] => {
  const bills = getBills();
  const updatedBills = bills.filter(bill => bill.id !== id);
  saveBills(updatedBills);
  return updatedBills;
};
