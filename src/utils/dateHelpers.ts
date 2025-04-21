// Date formatting and manipulation functions
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getFirstDayOfMonth = (year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
};

export const isToday = (date: Date): boolean => {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

export const getDueInDays = (dueDate: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const billDueDate = new Date(dueDate);
  billDueDate.setHours(0, 0, 0, 0);
  
  const diffTime = billDueDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};
