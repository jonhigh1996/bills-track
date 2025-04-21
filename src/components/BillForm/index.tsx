import { useState, FormEvent, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Bill } from '@/types';
import { formatDate } from '@/utils/dateHelpers';

interface BillFormProps {
  onAddBill: (bill: Bill) => void;
}

const BillForm: React.FC<BillFormProps> = ({ onAddBill }) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');
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
      
      const newBill: Bill = {
        id: uuidv4(),
        name: name.trim(),
        amount: Number(amount.replace(/[^0-9.-]+/g, '')),
        dueDate: isoDate,
      };
      
      onAddBill(newBill);
      
      // Reset form
      setName('');
      setAmount('');
      setDueDate('');
      setErrors({});
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Add New Bill</h2>
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
          <div className="relative">
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
