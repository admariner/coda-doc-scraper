import React, { useState } from 'react';

const DataDisplay = ({ rows, columns }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleCopyJSON = () => {
    const dataToCopy = JSON.stringify({ columns, rows }, null, 2);
    navigator.clipboard.writeText(dataToCopy);
    alert('JSON copied to clipboard!');
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Fetched Data</h2>

      {/* Copy JSON button */}
      <button
        onClick={handleCopyJSON}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-4"
      >
        Copy JSON to Clipboard
      </button>

      {/* Collapsible JSON view */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <details open={!isCollapsed}>
          <summary
            className="font-medium cursor-pointer"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? 'Show Raw JSON' : 'Hide Raw JSON'}
          </summary>
          <pre className="mt-2 text-sm text-gray-700 overflow-x-auto">
            {JSON.stringify({ columns, rows }, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
};

export default DataDisplay;