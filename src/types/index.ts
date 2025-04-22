export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string; // ISO Date format (YYYY-MM-DD)
  paymentMethod: string; // Ways to pay
  isRecurring: boolean; // Whether this bill recurs
  recurringFrequency?: 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually'; // How often the bill recurs
  recurringEndDate?: string; // Optional end date for recurring bills (ISO format)
  isVirtualRecurringInstance?: boolean; // Flag for generated instances of recurring bills
  isAutoPaid?: boolean; // Whether this bill is automatically paid
}

export type RecurringFrequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually';
