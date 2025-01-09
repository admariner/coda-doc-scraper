import React from 'react';
import { CopyIcon, DownloadIcon } from './Icons';

const ActionButtons = ({ rows, columns }) => {
  const handleCopyJSON = () => {
    const dataToCopy = JSON.stringify({ columns, rows }, null, 2);
    navigator.clipboard.writeText(dataToCopy);
    alert('JSON copied to clipboard!');
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coda-data.json';
    a.click();
  };

  const exportCSV = () => {
    const csv = rows.map((row) => Object.values(row).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coda-data.csv';
    a.click();
  };

  return (
    <div className="flex space-x-4 mb-4">
      <button
        onClick={handleCopyJSON}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
      >
        <CopyIcon className="w-5 h-5 mr-2" />
        Copy
      </button>
      <button
        onClick={exportJSON}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        JSON
      </button>
      <button
        onClick={exportCSV}
        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
      >
        <DownloadIcon className="w-5 h-5 mr-2" />
        CSV
      </button>
    </div>
  );
};

export default ActionButtons;