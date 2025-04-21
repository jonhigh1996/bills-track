import React, { useState, useRef } from 'react';
import { exportBills, importBills } from '@/utils/exportImport';

interface ExportImportProps {
  onImportComplete: () => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ onImportComplete }) => {
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportBills();
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportError(null);
    setImportSuccess(false);

    try {
      await importBills(file);
      setImportSuccess(true);
      onImportComplete();
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setImportSuccess(false);
      }, 3000);
    } catch (error) {
      setImportError((error as Error).message || 'Failed to import bills');
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4 text-center">
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-center">Data Management</h2>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleExport}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Export Data
        </button>
        
        <button
          onClick={handleImportClick}
          className="flex items-center justify-center bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition duration-200"
          disabled={isImporting}
        >
          {isImporting ? (
            <>
              <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Importing...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" transform="rotate(180, 10, 10)" />
              </svg>
              Import Data
            </>
          )}
        </button>
        
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
          aria-label="Import bills from JSON file"
        />
      </div>
      
      {importError && (
        <div className="mt-3 p-3 bg-red-100 text-red-700 rounded-md text-center">
          <p className="font-medium">Import Error</p>
          <p className="text-sm">{importError}</p>
        </div>
      )}
      
      {importSuccess && (
        <div className="mt-3 p-3 bg-green-100 text-green-700 rounded-md text-center">
          <p className="font-medium">Success!</p>
          <p className="text-sm">Data imported successfully.</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500 text-center">
        <p>Export your bill data before redeploying to save your information.</p>
        <p>After redeployment, use the Import feature to restore your data.</p>
      </div>
    </div>
  );
};

export default ExportImport;
