import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableCard from './TableCard';
import TableDropdown from './TableDropdown';
import Header from '../Header';
import WelcomeCard from '../WelcomeCard';
import ErrorDisplay from '../ErrorDisplay';
import SkeletonLoader from './SkeletonLoader';

const CodaDocScraper = () => {
  const [apiToken, setApiToken] = useState(localStorage.getItem('codaApiToken') || '');
  const [docId, setDocId] = useState(localStorage.getItem('codaDocId') || '');
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Save API token and docId to localStorage
  useEffect(() => {
    localStorage.setItem('codaApiToken', apiToken);
  }, [apiToken]);

  useEffect(() => {
    localStorage.setItem('codaDocId', docId);
  }, [docId]);

  // Fetch tables when "Load Table Data" is clicked
  const handleLoadTables = async () => {
    if (!apiToken || !docId) {
      setError('Please provide an API Token and Document ID.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Fetching tables...');
      const tablesResponse = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables`,
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );

      // Fetch row counts for each table
      const tablesWithRowCount = await Promise.all(
        tablesResponse.data.items.map(async (table) => {
          const tableDetails = await axios.get(
            `https://coda.io/apis/v1/docs/${docId}/tables/${table.id}`,
            { headers: { Authorization: `Bearer ${apiToken}` } }
          );
          return { ...table, rowCount: tableDetails.data.rowCount };
        })
      );

      console.log('Fetched tables with row counts:', tablesWithRowCount);
      setTables(tablesWithRowCount);
    } catch (err) {
      console.error('Error fetching tables:', err);
      setError('Failed to fetch tables. Please check your API token and document ID.');
    } finally {
      setLoading(false);
    }
  };

  // Handle copying all selected tables
  const handleCopyAllTables = async () => {
    if (selectedTables.size === 0) {
      setError('No tables selected.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      console.log('Fetching data for all selected tables...');
      const allTableData = await Promise.all(
        Array.from(selectedTables).map(async (tableId) => {
          const table = tables.find((t) => t.id === tableId);
          if (!table) return null;

          // Fetch all rows if "All Rows" is selected
          let rows = [];
          if (table.rowCount > 0) {
            let pageToken = '';
            do {
              const response = await axios.get(
                `https://coda.io/apis/v1/docs/${docId}/tables/${table.id}/rows`,
                {
                  headers: { Authorization: `Bearer ${apiToken}` },
                  params: { limit: 100, pageToken, valueFormat: 'simpleWithArrays' },
                }
              );
              rows = [...rows, ...response.data.items];
              pageToken = response.data.nextPageToken;
            } while (pageToken);
          }

          return { [table.name]: { columns: table.columns || [], rows } };
        })
      );

      const concatenatedData = allTableData.filter(Boolean);
      console.log('Concatenated data for all tables:', concatenatedData);
      navigator.clipboard.writeText(JSON.stringify(concatenatedData, null, 2));
      alert('All table data copied to clipboard!');
    } catch (err) {
      console.error('Error copying all tables:', err);
      setError('Failed to copy all tables. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Header */}
        <Header />

        {/* Welcome Card */}
        <WelcomeCard />

        {/* API Token and Document ID Form */}
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
                onClick={handleLoadTables}
                disabled={loading || !apiToken || !docId}
                className="w-full px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Loading Tables...
                  </>
                ) : (
                  'Get Tables'
                )}
              </button>
              <button
                onClick={() => {
                  setApiToken('');
                  setDocId('');
                  localStorage.removeItem('codaApiToken');
                  localStorage.removeItem('codaDocId');
                }}
                className="px-4 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Select Tables Dropdown */}
        {tables.length > 0 && (
          <TableDropdown
            tables={tables}
            selectedTables={selectedTables}
            setSelectedTables={setSelectedTables}
          />
        )}

        {/* Copy All Tables Button */}
        {selectedTables.size > 0 && (
          <button
            onClick={handleCopyAllTables}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            Copy All Tables
          </button>
        )}

        {/* Table Cards */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          tables
            .filter((table) => selectedTables.has(table.id))
            .map((table) => (
              <TableCard
                key={table.id}
                table={table}
                apiToken={apiToken}
                docId={docId}
                onRemove={(tableId) => {
                  const newSelectedTables = new Set(selectedTables);
                  newSelectedTables.delete(tableId);
                  setSelectedTables(newSelectedTables);
                }}
              />
            ))
        )}

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}
      </div>
    </div>
  );
};

export default CodaDocScraper;