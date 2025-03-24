import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { CopyIcon, TrashIcon, LoadingSpinner } from '../DataDisplay/Icons';

const TableCard = ({
  table,
  apiToken,
  docId,
  selectedColumnAttributes,
  selectedRowAttributes,
  onRemove,
  onTableDataChange, // Callback to update parent
}) => {
  const [rowCount, setRowCount] = useState('1'); // Default to "1 Row"
  const [tableData, setTableData] = useState({ columns: [], rows: [] });
  const [columnIdToNameMap, setColumnIdToNameMap] = useState({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

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
        
        // Create mapping from column ID to column name
        const idToNameMap = {};
        response.data.items.forEach(column => {
          idToNameMap[column.id] = column.name;
        });
        setColumnIdToNameMap(idToNameMap);
        
        const filteredColumns = filterData(response.data.items, selectedColumnAttributes);
        setTableData((prev) => ({ ...prev, columns: filteredColumns }));
        
        // Update parent with the traditional format for backward compatibility
        // Later we'll transform this for display
        onTableDataChange(table.id, { columns: filteredColumns, rows: tableData.rows });
      } catch (err) {
        console.error(`Error fetching columns for table ${table.id}:`, err);
        setError('Failed to fetch columns. Please check your inputs and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchColumns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToken, docId, table.id, selectedColumnAttributes]);

  // Fetch row data when rowCount changes
  useEffect(() => {
    const fetchRows = async () => {
      setIsLoading(true);
      setError('');
      try {
        if (rowCount === '0') {
          // For "Columns Only", set rows to an empty array
          setTableData((prev) => ({ ...prev, rows: [] }));
          onTableDataChange(table.id, { columns: tableData.columns, rows: [] }); // Update parent
          return;
        }

        console.log(`Fetching rows for table ${table.id} with rowCount: ${rowCount}...`);
        const limit = rowCount === 'All' ? undefined : parseInt(rowCount, 10);
        const response = await axios.get(
          `https://coda.io/apis/v1/docs/${docId}/tables/${table.id}/rows`,
          {
            headers: { Authorization: `Bearer ${apiToken}` },
            params: { limit, valueFormat: 'simpleWithArrays' },
          }
        );
        const filteredRows = filterData(response.data.items, selectedRowAttributes);
        setTableData((prev) => ({ ...prev, rows: filteredRows }));
        
        // Update parent with the traditional format for backward compatibility
        // Later we'll transform this for display
        onTableDataChange(table.id, { columns: tableData.columns, rows: filteredRows });
      } catch (err) {
        console.error(`Error fetching rows for table ${table.id}:`, err);
        setError('Failed to fetch rows. Please check your inputs and try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiToken, docId, table.id, rowCount, selectedRowAttributes]);

  // Handle copying table data
  const handleCopyTableData = async () => {
    setIsCopying(true);
    setCopySuccess(false);
    try {
      const structuredData = getProcessedData();
      await navigator.clipboard.writeText(JSON.stringify(structuredData, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Error copying table data:', err);
      setError('Failed to copy table data');
    } finally {
      setIsCopying(false);
    }
  };

  // Recursive object processing function is used instead of this simpler version
  // for more complex nested structure handling

  // Recursively process an object to simplify nested objects
  const processObject = (obj) => {
    if (!obj || typeof obj !== 'object') return obj;
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => processObject(item));
    }
    
    // If object has a name property and other properties like 'table', 'id', etc. - just return the name
    if (obj.name && (obj.table || obj.id || obj.type || obj.href)) {
      return obj.name;
    }
    
    // Otherwise process each property
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value && typeof value === 'object') {
        result[key] = processObject(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  };

  // Replace column IDs with column names in values object
  const replaceColumnIdsWithNames = (valuesObj) => {
    if (!valuesObj || typeof valuesObj !== 'object') return valuesObj;
    
    const result = {};
    for (const [columnId, value] of Object.entries(valuesObj)) {
      const columnName = columnIdToNameMap[columnId] || columnId; // Fallback to id if name not found
      result[columnName] = value;
    }
    return result;
  };

  // Filter data based on selected attributes
  const filterData = (data, selectedAttributes) => {
    return data.map((item) => {
      // Log the row data before filtering
      console.log('Row data before filtering:', item);

      // Filter the item based on selected attributes
      const filteredItem = Object.fromEntries(
        Object.entries(item)
          .filter(([key]) => selectedAttributes.includes(key))
          .map(([key, value]) => {
            // Special handling for values - replace column IDs with names
            if (key === 'values' && typeof value === 'object' && value !== null) {
              const namedValues = replaceColumnIdsWithNames(value);
              const filteredValues = Object.fromEntries(
                Object.entries(namedValues).filter(([, val]) => val !== '')
              );
              return [key, filteredValues];
            }
            
            // Process nested objects to simplify them
            if (value && typeof value === 'object') {
              return [key, processObject(value)];
            }
            
            return [key, value];
          })
          .filter(([, value]) => value !== null && value !== '' && value !== undefined)
      );

      // Log the row data after filtering
      console.log('Row data after filtering:', filteredItem);

      return filteredItem;
    });
  };

  // Row selector options
  const rowOptions = [
    { label: 'Columns Only', value: '0', color: 'gray' },
    { label: '1 Row', value: '1', color: 'gray' },
    { label: 'All Rows', value: 'All', color: 'gray' },
  ];

  // Create a processed version of the data for display with rows nested under columns
  const getProcessedData = () => {
    const columns = filterData(tableData.columns, selectedColumnAttributes);
    const rows = filterData(tableData.rows, selectedRowAttributes);
    
    // Create a more intuitive structure with rows nested under columns
    const structuredData = {};
    
    // Add column definitions
    columns.forEach(column => {
      structuredData[column.name] = {
        ...column,
        rows: []
      };
    });
    
    // Add row data under each column
    rows.forEach(row => {
      if (row.values) {
        Object.entries(row.values).forEach(([columnName, value]) => {
          if (structuredData[columnName]) {
            // Include relevant row metadata with each value
            const rowMetadata = {};
            if (row.name) rowMetadata.name = row.name;
            if (row.createdAt) rowMetadata.createdAt = row.createdAt;
            
            structuredData[columnName].rows.push({
              ...rowMetadata,
              value
            });
          }
        });
      }
    });
    
    return structuredData;
  };

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
            className="text-gray-500 hover:text-gray-700 relative"
            title="Copy Table Data"
            disabled={isCopying}
          >
            {isCopying ? (
              <LoadingSpinner className="h-5 w-5 text-blue-500" />
            ) : (
              <CopyIcon className={`h-5 w-5 ${copySuccess ? 'text-green-500' : ''}`} />
            )}
            {copySuccess && (
              <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs py-1 px-2 rounded shadow-lg whitespace-nowrap">
                Copied!
              </span>
            )}
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
                  ? `bg-gray-700 text-white`
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
            {isLoading ? (
              <div className="animate-pulse space-y-2">
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded"></div>
                <div className="bg-gray-200 h-4 rounded"></div>
              </div>
            ) : (
              <div className="text-left font-mono text-sm bg-gray-50 p-4 rounded-md overflow-x-auto max-h-60">
                <pre>
                  {JSON.stringify(getProcessedData(), null, 2)}
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