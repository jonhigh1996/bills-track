import { Bill } from '@/types';
import { formatDate } from './dateHelpers';

/**
 * Calculates the next due date for a recurring bill based on its frequency
 * @param currentDueDate The current due date in ISO format (YYYY-MM-DD)
 * @param frequency The recurring frequency
 * @returns The next due date in ISO format
 */
export const calculateNextDueDate = (currentDueDate: string, frequency: Bill['recurringFrequency']): string => {
  const date = new Date(currentDueDate);
  
  switch (frequency) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'biweekly':
      date.setDate(date.getDate() + 14);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'annually':
      date.setFullYear(date.getFullYear() + 1);
      break;
    default:
      // Default to monthly if frequency is undefined
      date.setMonth(date.getMonth() + 1);
  }
  
  return formatDate(date);
};

/**
 * Generates virtual instances of recurring bills for a specified date range
 * @param bills The list of all bills
 * @param startDate The start date of the range in ISO format (YYYY-MM-DD)
 * @param endDate The end date of the range in ISO format (YYYY-MM-DD)
 * @returns An array of bills including original and virtual recurring instances
 */
export const generateRecurringBillInstances = (
  bills: Bill[],
  startDate: string,
  endDate: string
): Bill[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Start with non-recurring bills and bills that are already in the date range
  const result: Bill[] = bills.filter(bill => {
    const dueDate = new Date(bill.dueDate);
    return !bill.isRecurring || (dueDate >= start && dueDate <= end);
  });
  
  // Generate virtual instances for recurring bills
  bills.forEach(bill => {
    if (bill.isRecurring && bill.recurringFrequency) {
      let currentDueDate = bill.dueDate;
      const dueDateObj = new Date(currentDueDate);
      
      // Skip if the first due date is after the end date
      if (dueDateObj > end) {
        return;
      }
      
      // Skip if the first due date is in the range (already included)
      if (dueDateObj >= start && dueDateObj <= end) {
        currentDueDate = calculateNextDueDate(currentDueDate, bill.recurringFrequency);
      }
      
      // Generate future instances until we reach the end date or recurring end date
      while (true) {
        const nextDueDateObj = new Date(currentDueDate);
        
        // Stop if we've passed the end date
        if (nextDueDateObj > end) {
          break;
        }
        
        // Stop if we've passed the recurring end date (if specified)
        if (bill.recurringEndDate && nextDueDateObj > new Date(bill.recurringEndDate)) {
          break;
        }
        
        // Only add if the date is within our range
        if (nextDueDateObj >= start && nextDueDateObj <= end) {
          const virtualBill: Bill = {
            ...bill,
            id: `${bill.id}_${currentDueDate}`, // Create a unique ID for the virtual instance
            dueDate: currentDueDate,
            isVirtualRecurringInstance: true, // Mark as a virtual instance
          };
          
          result.push(virtualBill);
        }
        
        // Calculate the next due date
        currentDueDate = calculateNextDueDate(currentDueDate, bill.recurringFrequency);
      }
    }
  });
  
  // Sort by due date
  return result.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
};

/**
 * Formats a recurring bill's frequency for display
 * @param frequency The recurring frequency
 * @returns A human-readable string describing the frequency
 */
export const formatRecurringFrequency = (frequency: Bill['recurringFrequency']): string => {
  switch (frequency) {
    case 'weekly':
      return 'Weekly';
    case 'biweekly':
      return 'Every Two Weeks';
    case 'monthly':
      return 'Monthly';
    case 'quarterly':
      return 'Quarterly';
    case 'annually':
      return 'Annually';
    default:
      return '';
  }
};
