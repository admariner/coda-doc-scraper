import React, { useState } from 'react';
import { CopyIcon, LoadingSpinner } from './Icons';

const JsonPreviewPanel = ({ jsonData, title = 'JSON Preview' }) => {
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  // Format the JSON data with syntax highlighting
  const formattedJson = JSON.stringify(jsonData, null, 2);
  const isEmpty = !jsonData || Object.keys(jsonData).length === 0;

  const handleCopyJson = async () => {
    if (isEmpty) return;
    
    setIsCopying(true);
    setCopySuccess(false);
    try {
      await navigator.clipboard.writeText(formattedJson);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error copying JSON:', err);
    } finally {
      setIsCopying(false);
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
    </div>
  );
};

export default JsonPreviewPanel;