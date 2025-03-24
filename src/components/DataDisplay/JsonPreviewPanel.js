import React, { useState, useEffect } from 'react';
import { CopyIcon, LoadingSpinner } from './Icons';

const JsonPreviewPanel = ({ jsonData, title = 'JSON Preview' }) => {
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSizeOption, setPageSizeOption] = useState('all');
  const [formattedJson, setFormattedJson] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [jsonDataSize, setJsonDataSize] = useState(0);

  const pageSizeOptions = [
    { label: 'All', value: 'all' },
    { label: '250 lines', value: 250 },
    { label: '500 lines', value: 500 },
    { label: '1000 lines', value: 1000 }
  ];

  useEffect(() => {
    // Format the JSON data
    const fullJson = JSON.stringify(jsonData, null, 2);
    setJsonDataSize(fullJson.length);
    
    // Reset to page 1 when data changes
    setCurrentPage(1);
    
    if (pageSizeOption === 'all') {
      setFormattedJson(fullJson);
      setTotalPages(1);
    } else {
      // Split into lines
      const lines = fullJson.split('\n');
      setTotalPages(Math.ceil(lines.length / Number(pageSizeOption)));
      
      // Get lines for current page
      const startLine = (currentPage - 1) * Number(pageSizeOption);
      const endLine = Math.min(startLine + Number(pageSizeOption), lines.length);
      
      setFormattedJson(lines.slice(startLine, endLine).join('\n'));
    }
  }, [jsonData, currentPage, pageSizeOption]);

  const isEmpty = !jsonData || Object.keys(jsonData).length === 0;

  const handleCopyJson = async () => {
    if (isEmpty) return;
    
    setIsCopying(true);
    setCopySuccess(false);
    try {
      // Always copy the full JSON, not just the current page
      await navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error copying JSON:', err);
    } finally {
      setIsCopying(false);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (size) => {
    setPageSizeOption(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Size indicators
  const getDataSizeDisplay = () => {
    const kb = jsonDataSize / 1024;
    const mb = kb / 1024;
    
    if (mb >= 1) {
      return `${mb.toFixed(2)} MB`;
    } else {
      return `${kb.toFixed(2)} KB`;
    }
  };

  return (
    <div className="bg-white p-4 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        <button
          onClick={handleCopyJson}
          disabled={isEmpty || isCopying}
          className={`relative p-2 rounded-md ${isEmpty ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          title="Copy JSON"
        >
          {isCopying ? (
            <LoadingSpinner className="h-5 w-5 text-blue-500" />
          ) : (
            <CopyIcon className={`h-5 w-5 ${copySuccess ? 'text-green-500' : ''}`} />
          )}
          {copySuccess && (
            <span className="absolute -top-8 right-0 bg-green-500 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
              Copied!
            </span>
          )}
        </button>
      </div>
      
      {!isEmpty && (
        <div className="flex flex-wrap items-center justify-between mb-3 bg-gray-50 p-2 rounded-md">
          <div className="text-sm text-gray-500">
            Size: {getDataSizeDisplay()}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Show:</span>
            {pageSizeOptions.map(option => (
              <button 
                key={option.value}
                onClick={() => handlePageSizeChange(option.value)}
                className={`px-2 py-1 text-xs rounded ${
                  pageSizeOption === option.value
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="text-left font-mono text-sm bg-gray-50 p-4 rounded-md overflow-x-auto max-h-[calc(100vh-300px)]">
        {isEmpty ? (
          <div className="text-gray-400 text-center italic">
            No data selected. Choose tables to display JSON.
          </div>
        ) : (
          <pre className="json-preview">
            {formattedJson}
          </pre>
        )}
      </div>
      
      {!isEmpty && totalPages > 1 && (
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 text-sm bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default JsonPreviewPanel;