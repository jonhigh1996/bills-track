import { useState, FormEvent, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Bill, RecurringFrequency } from '@/types';
import { formatDate } from '@/utils/dateHelpers';

interface BillFormProps {
  onAddBill: (bill: Bill) => void;
}

const BillForm: React.FC<BillFormProps> = ({ onAddBill }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState<RecurringFrequency>('monthly');
  const [recurringEndDate, setRecurringEndDate] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Bill name is required';
    }
    
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      // Remove formatting to check the number
      const numericAmount = Number(amount.replace(/[^0-9.-]+/g, ''));
      if (isNaN(numericAmount) || numericAmount <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      }
    }
    
    if (!paymentMethod) {
      newErrors.paymentMethod = 'Payment method is required';
    }
    
    if (!dueDate) {
      newErrors.dueDate = 'Due date is required';
    } else {
      // Validate date format MM/DD/YYYY
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
      if (!dateRegex.test(dueDate)) {
        newErrors.dueDate = 'Date must be in MM/DD/YYYY format';
      } else {
        // Check if it's a valid date
        const parts = dueDate.split('/');
        const month = parseInt(parts[0], 10) - 1; // JS months are 0-indexed
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        
        if (
          dateObj.getFullYear() !== year ||
          dateObj.getMonth() !== month ||
          dateObj.getDate() !== day
        ) {
          newErrors.dueDate = 'Please enter a valid date';
        }
      }
    }
    
    // Validate recurring end date if provided
    if (isRecurring && recurringEndDate) {
      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/;
      if (!dateRegex.test(recurringEndDate)) {
        newErrors.recurringEndDate = 'Date must be in MM/DD/YYYY format';
      } else {
        // Check if it's a valid date
        const parts = recurringEndDate.split('/');
        const month = parseInt(parts[0], 10) - 1;
        const day = parseInt(parts[1], 10);
        const year = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        
        if (
          dateObj.getFullYear() !== year ||
          dateObj.getMonth() !== month ||
          dateObj.getDate() !== day
        ) {
          newErrors.recurringEndDate = 'Please enter a valid date';
        }
        
        // Check if end date is after due date
        const dueDateParts = dueDate.split('/');
        const dueDateObj = new Date(
          parseInt(dueDateParts[2], 10),
          parseInt(dueDateParts[0], 10) - 1,
          parseInt(dueDateParts[1], 10)
        );
        
        if (dateObj <= dueDateObj) {
          newErrors.recurringEndDate = 'End date must be after the first due date';
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // Convert MM/DD/YYYY to ISO format for storage
      const parts = dueDate.split('/');
      const month = parts[0].padStart(2, '0');
      const day = parts[1].padStart(2, '0');
      const year = parts[2];
      const dateObj = new Date(`${year}-${month}-${day}`);
      const isoDate = formatDate(dateObj);
      
      // Process recurring end date if provided
      let isoEndDate: string | undefined;
      if (isRecurring && recurringEndDate) {
        const endParts = recurringEndDate.split('/');
        const endMonth = endParts[0].padStart(2, '0');
        const endDay = endParts[1].padStart(2, '0');
        const endYear = endParts[2];
        const endDateObj = new Date(`${endYear}-${endMonth}-${endDay}`);
        isoEndDate = formatDate(endDateObj);
      }
      
      const newBill: Bill = {
        id: uuidv4(),
        name: name.trim(),
        amount: Number(amount.replace(/[^0-9.-]+/g, '')),
        dueDate: isoDate,
        paymentMethod: paymentMethod,
        isRecurring: isRecurring,
        ...(isRecurring && { recurringFrequency }),
        ...(isoEndDate && { recurringEndDate: isoEndDate }),
      };
      
      onAddBill(newBill);
      
      // Reset form
      setName('');
      setAmount('');
      setDueDate('');
      setPaymentMethod('');
      setIsRecurring(false);
      setRecurringFrequency('monthly');
      setRecurringEndDate('');
      setErrors({});
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center sm:text-left">Add New Bill</h2>
      <form ref={formRef} onSubmit={handleSubmit} aria-label="Bill entry form">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Bill Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Electricity Bill"
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => {
                // Only allow numbers and formatting
                const value = e.target.value.replace(/[^0-9.]/g, '');
                if (value === '' || !isNaN(Number(value))) {
                  // Format with commas as thousands separators
                  if (value) {
                    const numericValue = Number(value);
                    setAmount(numericValue.toLocaleString('en-US', { maximumFractionDigits: 0 }));
                  } else {
                    setAmount('');
                  }
                }
              }}
              className={`w-full px-3 py-2 pl-8 border rounded-md ${
                errors.amount ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., 1,500"
              aria-describedby={errors.amount ? 'amount-error' : undefined}
            />
          </div>
          {errors.amount && <p id="amount-error" className="mt-1 text-sm text-red-500">{errors.amount}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date (MM/DD/YYYY)
          </label>
          <input
            type="text"
            id="dueDate"
            value={dueDate}
            onChange={(e) => {
              const value = e.target.value;
              // Allow typing but enforce format
              if (value === '' || /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/.test(value)) {
                setDueDate(value);
              }
            }}
            onBlur={() => {
              // Validate and convert to ISO format on blur
              if (dueDate) {
                const parts = dueDate.split('/');
                if (parts.length === 3) {
                  const month = parts[0].padStart(2, '0');
                  const day = parts[1].padStart(2, '0');
                  const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                  
                  // Check if it's a valid date
                  const dateObj = new Date(`${year}-${month}-${day}`);
                  if (!isNaN(dateObj.getTime())) {
                    // Convert to ISO format
                    setDueDate(`${month}/${day}/${year}`);
                  }
                }
              }
            }}
            placeholder="MM/DD/YYYY"
            className={`w-full px-3 py-2 border rounded-md ${
              errors.dueDate ? 'border-red-500' : 'border-gray-300'
            }`}
            aria-describedby={errors.dueDate ? 'date-error' : undefined}
          />
          {errors.dueDate && <p id="date-error" className="mt-1 text-sm text-red-500">{errors.dueDate}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Ways to Pay (How & Where)
          </label>
          <input
            type="text"
            id="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g., Pay online at website.com, Call 555-1234, Mail check to P.O. Box 123"
            aria-describedby={errors.paymentMethod ? 'payment-error' : undefined}
          />

          {errors.paymentMethod && <p id="payment-error" className="mt-1 text-sm text-red-500">{errors.paymentMethod}</p>}
        </div>
        
        {/* Recurring Bill Options */}
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-700">
              This is a recurring bill
            </label>
          </div>
          
          {isRecurring && (
            <div className="pl-6 border-l-2 border-blue-100 mt-3 space-y-3">
              <div>
                <label htmlFor="recurringFrequency" className="block text-sm font-medium text-gray-700 mb-1">
                  How often does this bill recur?
                </label>
                <select
                  id="recurringFrequency"
                  value={recurringFrequency}
                  onChange={(e) => setRecurringFrequency(e.target.value as RecurringFrequency)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Every Two Weeks</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly (Every 3 Months)</option>
                  <option value="annually">Annually (Yearly)</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="recurringEndDate" className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional, MM/DD/YYYY)
                </label>
                <input
                  type="text"
                  id="recurringEndDate"
                  value={recurringEndDate}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow typing but enforce format
                    if (value === '' || /^\d{0,2}(\/\d{0,2}(\/\d{0,4})?)?$/.test(value)) {
                      setRecurringEndDate(value);
                    }
                  }}
                  onBlur={() => {
                    // Validate and convert to ISO format on blur
                    if (recurringEndDate) {
                      const parts = recurringEndDate.split('/');
                      if (parts.length === 3) {
                        const month = parts[0].padStart(2, '0');
                        const day = parts[1].padStart(2, '0');
                        const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
                        
                        // Check if it's a valid date
                        const dateObj = new Date(`${year}-${month}-${day}`);
                        if (!isNaN(dateObj.getTime())) {
                          // Convert to ISO format
                          setRecurringEndDate(`${month}/${day}/${year}`);
                        }
                      }
                    }
                  }}
                  placeholder="MM/DD/YYYY (Leave blank for no end date)"
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.recurringEndDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  aria-describedby={errors.recurringEndDate ? 'end-date-error' : undefined}
                />
                {errors.recurringEndDate && (
                  <p id="end-date-error" className="mt-1 text-sm text-red-500">{errors.recurringEndDate}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Leave blank if this bill recurs indefinitely
                </p>
              </div>
            </div>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Bill
        </button>
      </form>
    </div>
  );
};

export default BillForm;
