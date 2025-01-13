import React from 'react';

const ApiTokenForm = ({ apiToken, setApiToken, docId, setDocId, handleFetchTables, isFetchingTables }) => {
  const handleReset = () => {
    setApiToken('');
    setDocId('');
    localStorage.removeItem('codaApiToken');
    localStorage.removeItem('codaDocId');
  };

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md">
      <h2 className="text-lg font-bold mb-4">API Token and Document ID</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API Token
            <input
              type="password"
              value={apiToken}
              onChange={(e) => setApiToken(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
              placeholder="Enter your Coda API token"
            />
          </label>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Document ID
            <input
              type="text"
              value={docId}
              onChange={(e) => setDocId(e.target.value)}
              className="w-full p-2 border rounded-md mt-1"
              placeholder="Enter your Coda Document ID"
            />
          </label>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={handleFetchTables}
            disabled={isFetchingTables || !apiToken || !docId}
            className="w-full px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isFetchingTables ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Getting Tables...
              </>
            ) : (
              'Get Tables'
            )}
          </button>
          <button
            onClick={handleReset}
            className="px-4 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApiTokenForm;