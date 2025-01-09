import React, { useState, useEffect } from 'react';
import useCodaApi from './hooks/useCodaApi';
import InputForm from './components/InputForm';
import TableSelector from './components/TableSelector';
import DataDisplay from './components/DataDisplay/DataDisplay'; // Updated import
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const CodaDocScraper = () => {
  const [apiToken, setApiToken] = useState('');
  const [docId, setDocId] = useState('');
  const [rowCount, setRowCount] = useState('All');
  const [selectedTables, setSelectedTables] = useState([]);
  const [isFetchingTables, setIsFetchingTables] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const { rows, tables, columns, loading, error, fetchData, fetchTables, setError } = useCodaApi();

  // Load saved config from localStorage
  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem('codaConfig') || '{}');
    setApiToken(savedConfig.apiToken || '');
    setDocId(savedConfig.docId || '');
  }, []);

  // Save config to localStorage
  useEffect(() => {
    const config = { apiToken, docId };
    localStorage.setItem('codaConfig', JSON.stringify(config));
  }, [apiToken, docId]);

  // Handle fetch tables button click
  const handleFetchTables = async () => {
    if (!apiToken || !docId) {
      setError('Please provide an API Token and Document ID.');
      return;
    }

    setIsFetchingTables(true);
    await fetchTables(apiToken, docId);
    setIsFetchingTables(false);
  };

  // Handle fetch data button click
  const handleFetchData = async () => {
    if (selectedTables.length === 0) {
      setError('Please select at least one table.');
      return;
    }

    setIsFetchingData(true);

    console.log('Selected tables:', selectedTables);
    console.log('Row count:', rowCount);

    // Fetch data for each selected table
    for (const tableId of selectedTables) {
      await fetchData(apiToken, docId, tableId, rowCount);
    }

    setIsFetchingData(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6 border rounded-lg shadow-md bg-white">
        <h1 className="text-xl font-bold mb-4 text-center">Coda Doc Scraper</h1>

        {/* Input form */}
        <InputForm
          apiToken={apiToken}
          setApiToken={setApiToken}
          docId={docId}
          setDocId={setDocId}
        />

        {/* Fetch Tables button */}
        <div className="mt-4">
          <button
            onClick={handleFetchTables}
            disabled={isFetchingTables || loading}
            className="w-full max-w-xs px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isFetchingTables || loading ? 'Fetching Tables...' : 'Fetch Tables'}
          </button>
        </div>

        {/* Table selector */}
        {tables.length > 0 && (
          <TableSelector
            tables={tables}
            selectedTables={selectedTables}
            setSelectedTables={setSelectedTables}
          />
        )}

        {/* Row count selector */}
        {selectedTables.length > 0 && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Rows
              <select
                value={rowCount}
                onChange={(e) => setRowCount(e.target.value)}
                className="w-full p-2 border rounded-md mt-1"
              >
                <option value="0">0 (Just metadata)</option>
                <option value="1">1</option>
                <option value="10">10</option>
                <option value="All">All</option>
              </select>
            </label>
          </div>
        )}

        {/* Fetch Data button */}
        {selectedTables.length > 0 && (
          <div className="mt-4">
            <button
              onClick={handleFetchData}
              disabled={isFetchingData || loading}
              className="w-full max-w-xs px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
            >
              {isFetchingData || loading ? 'Fetching Data...' : 'Fetch Data'}
            </button>
          </div>
        )}

        {/* Loading spinner */}
        {loading && <LoadingSpinner />}

        {/* Error display */}
        {error && <ErrorDisplay error={error} />}

        {/* Data display */}
        {(rows.length > 0 || columns.length > 0) && (
          <DataDisplay rows={rows} columns={columns} />
        )}
      </div>
    </div>
  );
};

export default CodaDocScraper;