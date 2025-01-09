import React from 'react';

const ExportButtons = ({ rows }) => {
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(rows, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'coda-data.json';
    a.click();
  };

  return (
    <div className="mt-6 flex space-x-4">
      <button
        onClick={exportJSON}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Export as JSON
      </button>
    </div>
  );
};

export default ExportButtons;