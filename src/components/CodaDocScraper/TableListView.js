import React from 'react';
import { CopyIcon, LoadingSpinner, RefreshIcon, DownloadIcon } from '../DataDisplay/Icons';

const TableListView = ({
  tables,
  selectedTables,
  setSelectedTables,
  onCopyTable,
  onDownloadTable,
  onSelectRowsOption,
  rowOptions,
  selectedRowCounts,
  isCopying,
  tableLoadingStatus
}) => {
  const handleSelectTable = (tableId) => {
    const newSelectedTables = new Set(selectedTables);
    
    if (newSelectedTables.has(tableId)) {
      newSelectedTables.delete(tableId);
    } else {
      newSelectedTables.add(tableId);
    }
    
    setSelectedTables(newSelectedTables);
  };

  const handleSelectAll = () => {
    if (selectedTables.size === tables.length) {
      // Deselect all if all are already selected
      setSelectedTables(new Set());
    } else {
      // Select all tables
      setSelectedTables(new Set(tables.map(table => table.id)));
    }
  };

  return (
    <div className="bg-white p-6 border rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Available Tables</h2>
        <button
          onClick={handleSelectAll}
          className="px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
        >
          {selectedTables.size === tables.length ? 'Deselect All' : 'Select All'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed lg:table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-10 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Select</span>
              </th>
              <th scope="col" className="w-1/4 px-2 md:px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Table Name
              </th>
              <th scope="col" className="w-12 px-2 md:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rows
              </th>
              <th scope="col" className="hidden sm:table-cell w-24 px-2 md:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modified
              </th>
              <th scope="col" className="px-2 md:px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" className="w-20 px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tables.map((table) => (
              <tr 
                key={table.id}
                className={selectedTables.has(table.id) ? 'bg-blue-50' : table.isView ? 'bg-amber-50 hover:bg-amber-100' : 'hover:bg-gray-50'}
              >
                <td className="px-2 py-3 whitespace-nowrap">
                  <input
                    type="checkbox"
                    id={`table-${table.id}`}
                    checked={selectedTables.has(table.id)}
                    onChange={() => handleSelectTable(table.id)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                </td>
                <td className="px-2 md:px-4 py-3 truncate">
                  <div className="flex items-center">
                    <label htmlFor={`table-${table.id}`} className="font-medium text-gray-900 truncate max-w-[150px] md:max-w-xs">
                      {table.name}
                    </label>
                    {table.isView && (
                      <span className="ml-1 inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                        View
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 md:px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                  {table.rowCount}
                </td>
                <td className="hidden sm:table-cell px-2 md:px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(table.updatedAt || Date.now()).toLocaleDateString()}
                </td>
                <td className="px-2 md:px-3 py-3 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1 items-center">
                    {rowOptions.map((option) => (
                      <button
                        key={`${table.id}-${option.value}`}
                        onClick={() => onSelectRowsOption(table.id, option.value)}
                        disabled={!selectedTables.has(table.id)}
                        className={`px-1.5 py-0.5 rounded-md text-xs font-medium ${
                          selectedTables.has(table.id) && selectedRowCounts[table.id] === option.value
                            ? 'bg-gray-700 text-white'
                            : !selectedTables.has(table.id)
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                    
                    {/* Loading indicator */}
                    {tableLoadingStatus[table.id] === 'loading' && (
                      <span className="ml-1 inline-flex items-center text-blue-500">
                        <LoadingSpinner className="animate-spin h-3 w-3" />
                      </span>
                    )}
                    {tableLoadingStatus[table.id] === 'error' && (
                      <span className="ml-1 inline-flex items-center text-red-500 text-xs">
                        Error
                      </span>
                    )}
                    {tableLoadingStatus[table.id] === 'loaded' && (
                      <span className="ml-1 inline-flex items-center text-green-500 text-xs">
                        <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-2 py-3 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex space-x-1 justify-end">
                    <button
                      onClick={() => onCopyTable(table.id)}
                      disabled={!selectedTables.has(table.id) || isCopying[table.id]}
                      className={`p-1 rounded-md ${!selectedTables.has(table.id) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                      title="Copy Table JSON"
                    >
                      {isCopying[table.id] ? (
                        <LoadingSpinner className="h-4 w-4 text-blue-500" />
                      ) : (
                        <CopyIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => onDownloadTable(table.id)}
                      disabled={!selectedTables.has(table.id) || isCopying[table.id]}
                      className={`p-1 rounded-md ${!selectedTables.has(table.id) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                      title="Download Table JSON"
                    >
                      <DownloadIcon className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {tables.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          No tables found. Enter your API Token and Document ID to load tables.
        </div>
      )}
    </div>
  );
};

export default TableListView;