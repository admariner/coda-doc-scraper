import React from 'react';

const GlobalActions = ({ handleFetchAll, copyAllData, exportAllData, deleteAllTables, isFetchingData, tableData }) => {
  return (
    <div className="flex justify-center space-x-4 mb-4">
      <button
        onClick={() => handleFetchAll('All')}
        disabled={isFetchingData}
        className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
      >
        Fetch All
      </button>
      <button
        onClick={copyAllData}
        disabled={Object.keys(tableData).length === 0}
        className="px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
      >
        Copy All
      </button>
      <button
        onClick={exportAllData}
        disabled={Object.keys(tableData).length === 0}
        className="px-4 py-1.5 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-purple-300 disabled:cursor-not-allowed"
      >
        Export All
      </button>
      <button
        onClick={deleteAllTables}
        className="px-4 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600"
      >
        Delete All
      </button>
    </div>
  );
};

export default GlobalActions;