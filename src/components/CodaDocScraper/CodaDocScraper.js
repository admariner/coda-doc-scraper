import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableCard from './TableCard';
import TableDropdown from './TableDropdown';
import Header from '../Header';
import WelcomeCard from '../WelcomeCard';
import ErrorDisplay from '../ErrorDisplay';
import SkeletonLoader from './SkeletonLoader';
import { CopyIcon, RefreshIcon } from '../DataDisplay/Icons';
import AttributeSelector from './AttributeSelector';

const CodaDocScraper = () => {
  const [apiToken, setApiToken] = useState(localStorage.getItem('codaApiToken') || '');
  const [docId, setDocId] = useState(localStorage.getItem('codaDocId') || '');
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // State for selected column and row attributes
  const [selectedColumnAttributes, setSelectedColumnAttributes] = useState([
    'id',
    'name',
    'display',
    'format',
    'formula',
    'defaultValue',
  ]);
  const [selectedRowAttributes, setSelectedRowAttributes] = useState([
    'id',
    'values',
    'createdAt',
  ]);

  // Save API token and docId to localStorage
  useEffect(() => {
    localStorage.setItem('codaApiToken', apiToken);
  }, [apiToken]);

  useEffect(() => {
    localStorage.setItem('codaDocId', docId);
  }, [docId]);

  // Callback to update tableData when filtered data changes in a TableCard
  const onTableDataChange = (tableId, filteredData) => {
    setTableData((prev) => ({
      ...prev,
      [tableId]: filteredData,
    }));
  };

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
  const handleCopyAllTables = () => {
    if (selectedTables.size === 0) {
      setError('No tables selected.');
      return;
    }

    try {
      console.log('Copying data for all selected tables...');

      // Create an object to hold all table data
      const allTableData = {};

      // Iterate over selected tables
      tables
        .filter((table) => selectedTables.has(table.id))
        .forEach((table) => {
          // Get the table's data from the tableData state
          const tableDataForTable = tableData[table.id];

          if (tableDataForTable) {
            // Wrap the table's data in its own object
            allTableData[table.name] = tableDataForTable;
          }
        });

      console.log('Copied data for all tables:', allTableData);
      navigator.clipboard.writeText(JSON.stringify(allTableData, null, 2));
      alert('All table data copied to clipboard!');
    } catch (err) {
      console.error('Error copying all tables:', err);
      setError('Failed to copy all tables. Please try again.');
    }
  };

  // Reset the entire state
  const handleReset = () => {
    setApiToken('');
    setDocId('');
    setTables([]);
    setSelectedTables(new Set());
    setTableData({});
    setError('');
    localStorage.removeItem('codaApiToken');
    localStorage.removeItem('codaDocId');
  };

  // Filter data based on selected attributes and remove null/blank values
  const filterData = (data, selectedAttributes) => {
    return data.map((item) =>
      Object.fromEntries(
        Object.entries(item)
          .filter(([key]) => selectedAttributes.includes(key))
          .filter(([, value]) => value !== null && value !== '' && value !== undefined)
      )
    );
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
                className="w-32 px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? 'Loading...' : 'Get Tables'}
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center justify-center"
              >
                <RefreshIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Select Tables and Data */}
        {tables.length > 0 && (
          <div className="bg-white p-6 border rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Select Tables and Data</h2>
            <div className="space-y-4">
              {/* Table Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Tables
                </label>
                <TableDropdown
                  tables={tables}
                  selectedTables={selectedTables}
                  setSelectedTables={setSelectedTables}
                />
              </div>

              {/* Column Attributes Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Column Data
                </label>
                <AttributeSelector
                  options={[
                    'id',
                    'name',
                    'display',
                    'format',
                    'formula',
                    'defaultValue',
                    'href',
                    'calculated',
                  ]}
                  selectedOptions={selectedColumnAttributes}
                  onSelect={(option) => {
                    if (selectedColumnAttributes.includes(option)) {
                      setSelectedColumnAttributes(
                        selectedColumnAttributes.filter((attr) => attr !== option)
                      );
                    } else {
                      setSelectedColumnAttributes([...selectedColumnAttributes, option]);
                    }
                  }}
                />
              </div>

              {/* Row Attributes Dropdown */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">
                  Row Data
                </label>
                <AttributeSelector
                  options={['id', 'values', 'createdAt', 'href', 'index', 'name']}
                  selectedOptions={selectedRowAttributes}
                  onSelect={(option) => {
                    if (selectedRowAttributes.includes(option)) {
                      setSelectedRowAttributes(
                        selectedRowAttributes.filter((attr) => attr !== option)
                      );
                    } else {
                      setSelectedRowAttributes([...selectedRowAttributes, option]);
                    }
                  }}
                />
              </div>

              {/* Copy All Tables Button */}
              <div className="flex justify-center">
                <button
                  onClick={handleCopyAllTables}
                  disabled={selectedTables.size === 0}
                  className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  <CopyIcon className="h-4 w-4 mr-2" />
                  Copy All Tables
                </button>
              </div>
            </div>
          </div>
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
                selectedColumnAttributes={selectedColumnAttributes}
                selectedRowAttributes={selectedRowAttributes}
                onRemove={(tableId) => {
                  const newSelectedTables = new Set(selectedTables);
                  newSelectedTables.delete(tableId);
                  setSelectedTables(newSelectedTables);
                }}
                onTableDataChange={onTableDataChange} // Pass the callback
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