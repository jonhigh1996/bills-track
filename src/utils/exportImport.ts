import { Bill } from '@/types';
import { getBills, saveBills } from './storageService';

/**
 * Exports all bills as a JSON file that gets downloaded to the user's device
 */
export const exportBills = (): void => {
  try {
    // Get all bills from localStorage
    const bills = getBills();
    
    // Convert to JSON string with nice formatting
    const billsJSON = JSON.stringify(bills, null, 2);
    
    // Create a blob with the data
    const blob = new Blob([billsJSON], { type: 'application/json' });
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = url;
    
    // Set the filename with date for better organization
    const date = new Date();
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    link.download = `bill-tracker-export-${formattedDate}.json`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to export bills:', error);
    alert('Failed to export bills. Please try again.');
  }
};

/**
 * Imports bills from a JSON file
 * @param file The JSON file to import
 * @returns A promise that resolves when the import is complete
 */
export const importBills = (file: File): Promise<void> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (!event.target?.result) {
          throw new Error('Failed to read file');
        }
        
        // Parse the JSON
        const bills = JSON.parse(event.target.result as string) as Bill[];
        
        // Validate the data structure
        if (!Array.isArray(bills)) {
          throw new Error('Invalid data format: Expected an array of bills');
        }
        
        // Validate each bill
        bills.forEach(bill => {
          if (!bill.id || !bill.name || typeof bill.amount !== 'number' || !bill.dueDate) {
            throw new Error('Invalid bill data: Missing required fields');
          }
        });
        
        // Save the bills to localStorage
        saveBills(bills);
        
        resolve();
      } catch (error) {
        console.error('Failed to import bills:', error);
        reject(error);
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    
    reader.readAsText(file);
  });
};
