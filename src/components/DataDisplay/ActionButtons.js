import React from 'react';
import { CopyIcon, DownloadIcon } from './Icons';

const ActionButtons = ({ tableData, selectedTables }) => {
  const handleCopyJSON = () => {
    const dataToCopy = JSON.stringify(tableData, null, 2);
    navigator.clipboard.writeText(dataToCopy);
    alert('JSON copied to clipboard!');
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tableData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coda-data.json';
    a.click();
  };

  // Disable buttons if no data is fetched
  const isDataFetched = Object.keys(tableData).length > 0;

  return (
    <div className="flex space-x-4 mb-4 justify-center">
      <button
        onClick={handleCopyJSON}
        disabled={!isDataFetched}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
      >
        <CopyIcon className="w-5 h-5 mr-2" />
        Copy
      </button>
      <button
        onClick={exportJSON}
        disabled={!isDataFetched}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        JSON
      </button>
    </div>
  );
};

export default ActionButtons;