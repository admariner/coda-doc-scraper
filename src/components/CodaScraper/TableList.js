import React, { useState } from 'react';
import ReactJson from 'react-json-view';
import { CopyIcon, DownloadIcon, TrashIcon, RefreshIcon } from '../DataDisplay/Icons';

const TableList = ({ tables, tableData, apiToken, docId, fetchData, deleteTable }) => {
  const [rowCounts, setRowCounts] = useState(
    tables.reduce((acc, table) => {
      acc[table.id] = '1'; // Default to '1'
      return acc;
    }, {})
  );

  const handleRowCountChange = (tableId, value) => {
    setRowCounts((prev) => ({ ...prev, [tableId]: value }));
  };

  return (
    <div className="space-y-4">
      {tables.map((table) => (
        <div key={table.id} className="bg-white p-4 border rounded-lg shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              {table.name}
              {table.rowCount && <span className="text-sm text-gray-500 ml-2">({table.rowCount} rows)</span>}
            </h3>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                {['0', '1', '10', 'All'].map((option) => (
                  <label key={option} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      value={option}
                      checked={rowCounts[table.id] === option}
                      onChange={() => handleRowCountChange(table.id, option)}
                      className="form-radio"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    console.log(`Fetching ${rowCounts[table.id]} rows for table ${table.id}`); // Debugging
                    fetchData(apiToken, docId, table.id, rowCounts[table.id]);
                  }}
                  className="p-1 text-blue-500 hover:text-blue-600"
                  title="Fetch Data"
                >
                  <RefreshIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => navigator.clipboard.writeText(JSON.stringify({ [table.name]: tableData[table.id] }, null, 2))}
                  className="p-1 text-green-500 hover:text-green-600"
                  title="Copy Data"
                >
                  <CopyIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    const blob = new Blob([JSON.stringify({ [table.name]: tableData[table.id] }, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${table.name}-data.json`;
                    a.click();
                  }}
                  className="p-1 text-purple-500 hover:text-purple-600"
                  title="Export Data"
                >
                  <DownloadIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteTable(table.id)}
                  className="p-1 text-red-500 hover:text-red-600"
                  title="Delete Table"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          {tableData[table.id] && (
            <div className="mt-4 text-left">
              <ReactJson
                src={{ [table.name]: tableData[table.id] }}
                name={null}
                collapsed={true}
                displayDataTypes={false}
                enableClipboard={false}
                displayObjectSize={false}
                iconStyle="triangle"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TableList;