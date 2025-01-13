import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CopyIcon, TrashIcon } from '../DataDisplay/Icons';

const TableCard = ({ table, apiToken, docId, onRemove }) => {
  const [rowCount, setRowCount] = useState('1'); // Default to "1 Row"
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Logging: Track rowCount changes
  useEffect(() => {
    console.log(`Row count changed for table ${table.id}:`, rowCount);
  }, [rowCount, table.id]);

  // Logging: Track tableData changes
  useEffect(() => {
    console.log(`Table data updated for table ${table.id}:`, tableData);
  }, [tableData, table.id]);

  // Fetch column data when the table is selected
  useEffect(() => {
    const fetchColumns = async () => {
      setIsLoading(true);
      setError('');
      try {
        console.log(`Fetching columns for table ${table.id}...`);
        const response = await axios.get(
          `https://coda.io/apis/v1/docs/${docId}/tables/${table.id}/columns`,
          { headers: { Authorization: `Bearer ${apiToken}` } }
        );
        console.log(`Columns fetched for table ${table.id}:`, response.data.items);
        setTableData((prev) => ({ ...prev, columns: response.data.items }));
      } catch (err) {
        console.error(`Error fetching columns for table ${table.id}:`, err);
        setError('Failed to fetch columns. Please check your inputs and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
  }, [apiToken, docId, table.id]);

  // Fetch row data when rowCount changes
  useEffect(() => {
    const fetchRows = async () => {
      if (rowCount === '0') return; // Skip fetching rows for "Metadata Only"

      setIsLoading(true);
      setError('');
      try {
        console.log(`Fetching rows for table ${table.id} with rowCount: ${rowCount}...`);
        const limit = rowCount === 'All' ? undefined : parseInt(rowCount, 10);
        const response = await axios.get(
          `https://coda.io/apis/v1/docs/${docId}/tables/${table.id}/rows`,
          {
            headers: { Authorization: `Bearer ${apiToken}` },
            params: { limit, valueFormat: 'simpleWithArrays' },
          }
        );
        console.log(`Rows fetched for table ${table.id}:`, response.data.items);
        setTableData((prev) => ({ ...prev, rows: response.data.items }));
      } catch (err) {
        console.error(`Error fetching rows for table ${table.id}:`, err);
        setError('Failed to fetch rows. Please check your inputs and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRows();
  }, [apiToken, docId, table.id, rowCount]);

  // Handle copying table data
  const handleCopyTableData = () => {
    navigator.clipboard.writeText(JSON.stringify(tableData, null, 2));
    alert('Table data copied to clipboard!');
  };

  // Filter out blank key/values from the JSON preview
  const filterBlankValues = (data) => {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (value === "") return undefined; // Remove blank values
      return value;
    }));
  };

  // Row selector options
  const rowOptions = [
    { label: 'Metadata Only', value: '0', color: 'gray' },
    { label: '1 Row', value: '1', color: 'green' },
    { label: 'All Rows', value: 'All', color: 'blue' },
  ];

  return (
    <div className="bg-white p-4 border rounded-lg shadow-md mb-4">
      {/* Table Header */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-md font-semibold">{table.name}</h3>
          <p className="text-sm text-gray-500">{table.rowCount} rows</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleCopyTableData}
            className="text-gray-500 hover:text-gray-700"
            title="Copy Table Data"
          >
            <CopyIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onRemove(table.id)}
            className="text-gray-500 hover:text-gray-700"
            title="Remove Table"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Num. Rows Selector */}
      <div className="mt-4">
        <div className="flex space-x-2">
          {rowOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setRowCount(option.value)}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                rowCount === option.value
                  ? `bg-${option.color}-500 text-white`
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm text-blue-500 hover:text-blue-600"
        >
          <span>Preview</span>
          {isExpanded ? (
            <ChevronDown className="ml-2 h-4 w-4" />
          ) : (
            <ChevronRight className="ml-2 h-4 w-4" />
          )}
        </button>

        {isExpanded && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Preview</h4>
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded"></div>
              </div>
            ) : (
              <div className="text-left font-mono text-sm bg-gray-50 p-4 rounded-md overflow-x-auto max-h-60">
                <pre>
                  {JSON.stringify(
                    filterBlankValues({
                      columns: tableData.columns,
                      rows: rowCount === 'All' ? tableData.rows.slice(0, 10) : tableData.rows, // Limit preview to 10 rows for "All Rows"
                    }),
                    null,
                    2
                  )}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default TableCard;