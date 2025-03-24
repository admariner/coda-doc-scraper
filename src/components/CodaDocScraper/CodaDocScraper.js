import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableCard from './TableCard';
import Header from '../Header';
import WelcomeCard from '../WelcomeCard';
import ErrorDisplay, { Toast } from '../ErrorDisplay';
import SkeletonLoader from './SkeletonLoader';
import { CopyIcon, RefreshIcon, LoadingSpinner } from '../DataDisplay/Icons';
import AttributeSelector from './AttributeSelector';
import JsonPreviewPanel from '../DataDisplay/JsonPreviewPanel';
import TableSelector from './TableSelector';
import ColumnFilter from './ColumnFilter';

const CodaDocScraper = () => {
  const [apiToken, setApiToken] = useState(localStorage.getItem('codaApiToken') || '');
  const [docId, setDocId] = useState(localStorage.getItem('codaDocId') || '');
  const [tables, setTables] = useState([]);
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const [copyLoading, setCopyLoading] = useState(false);
  const [apiTokenError, setApiTokenError] = useState('');
  const [docIdError, setDocIdError] = useState('');
  
  // New state for the improved UI
  const [selectedRowCounts, setSelectedRowCounts] = useState({});
  const [columnsData, setColumnsData] = useState({});
  const [selectedColumns, setSelectedColumns] = useState({});
  const [previewJsonData, setPreviewJsonData] = useState({});
  const [tableIsCopying, setTableIsCopying] = useState({});
  const [showColumnFilter, setShowColumnFilter] = useState(null);

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

  // Validate inputs
  const validateInputs = () => {
    let isValid = true;
    
    // Reset errors
    setApiTokenError('');
    setDocIdError('');
    
    // Validate API token
    if (!apiToken) {
      setApiTokenError('API Token is required');
      isValid = false;
    } else if (apiToken.length < 20) {
      setApiTokenError('API Token appears to be invalid (too short)');
      isValid = false;
    }
    
    // Validate Doc ID
    if (!docId) {
      setDocIdError('Document ID is required');
      isValid = false;
    } else if (!docId.match(/^[a-zA-Z0-9_-]+$/)) {
      setDocIdError('Document ID contains invalid characters');
      isValid = false;
    }
    
    return isValid;
  };

  // Fetch tables when "Load Table Data" is clicked
  const handleLoadTables = async () => {
    if (!validateInputs()) {
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
          return { 
            ...table, 
            rowCount: tableDetails.data.rowCount,
            updatedAt: tableDetails.data.updatedAt || new Date().toISOString()
          };
        })
      );

      console.log('Fetched tables with row counts:', tablesWithRowCount);
      setTables(tablesWithRowCount);
      
      // Initialize selectedRowCounts with default value "1" for all tables
      const rowCounts = {};
      tablesWithRowCount.forEach(table => {
        rowCounts[table.id] = '1';
      });
      setSelectedRowCounts(rowCounts);
      
      // Initialize tableIsCopying state
      const copyingState = {};
      tablesWithRowCount.forEach(table => {
        copyingState[table.id] = false;
      });
      setTableIsCopying(copyingState);
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

    setCopyLoading(true);
    try {
      console.log('Copying data for all selected tables...');

      // Create an object to hold all table data
      const allTableData = {};

      // Iterate over selected tables
      tables
        .filter((table) => selectedTables.has(table.id))
        .forEach((table) => {
          // Get the raw data for this table
          const rawTableData = tableData[table.id];
          
          if (rawTableData) {
            // Process the data for a more intuitive structure
            // This mimics what TableCard.getProcessedData() does
            const columns = rawTableData.columns || [];
            const rows = rawTableData.rows || [];
            
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
            
            // Add this table's structured data to the overall object
            allTableData[table.name] = structuredData;
          }
        });

      console.log('Copied data for all tables:', allTableData);
      await navigator.clipboard.writeText(JSON.stringify(allTableData, null, 2));
      showToast('All table data copied to clipboard!', 'success');
    } catch (err) {
      console.error('Error copying all tables:', err);
      setError('Failed to copy all tables. Please try again.');
      showToast('Failed to copy data', 'error');
    } finally {
      setCopyLoading(false);
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
    setApiTokenError('');
    setDocIdError('');
    setSelectedRowCounts({});
    setColumnsData({});
    setSelectedColumns({});
    setPreviewJsonData({});
    setTableIsCopying({});
    setShowColumnFilter(null);
    localStorage.removeItem('codaApiToken');
    localStorage.removeItem('codaDocId');
    showToast('Reset successful', 'success');
  };
  
  // Show toast message
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // This function is no longer needed since the TableCard component
  // handles all filtering with ID-to-name mapping and nested object simplification
  // eslint-disable-next-line no-unused-vars
  const filterData = () => {};

  // Fetch columns for a table and add to columnsData state
  const fetchColumnsForTable = async (tableId) => {
    try {
      const response = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/columns`,
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );
      
      // Add columns to columnsData state
      setColumnsData(prev => ({
        ...prev,
        [tableId]: response.data.items
      }));
      
      // Initialize selectedColumns with all column IDs
      setSelectedColumns(prev => ({
        ...prev,
        [tableId]: response.data.items.map(col => col.id)
      }));
      
      return response.data.items;
    } catch (err) {
      console.error(`Error fetching columns for table ${tableId}:`, err);
      setError(`Failed to fetch columns for table. ${err.message}`);
      return [];
    }
  };
  
  // Handle selecting row count option for a specific table
  const handleSelectRowsOption = async (tableId, rowCount) => {
    // Update the selected row count
    setSelectedRowCounts(prev => ({
      ...prev,
      [tableId]: rowCount
    }));
    
    // If columns haven't been fetched yet, fetch them
    if (!columnsData[tableId]) {
      await fetchColumnsForTable(tableId);
    }
    
    // Fetch rows based on the selected row count
    await fetchAndProcessTableData(tableId, rowCount);
  };
  
  // Copy data for a specific table
  const handleCopyTableData = async (tableId) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    
    // Update copying state
    setTableIsCopying(prev => ({
      ...prev,
      [tableId]: true
    }));
    
    try {
      // If we don't have the data yet, fetch it
      if (!tableData[tableId]) {
        await fetchAndProcessTableData(tableId, selectedRowCounts[tableId] || '1');
      }
      
      // Get the processed data
      const processedData = {
        [table.name]: processTableData(tableId)
      };
      
      // Copy to clipboard
      await navigator.clipboard.writeText(JSON.stringify(processedData, null, 2));
      showToast(`Table "${table.name}" copied to clipboard!`, 'success');
    } catch (err) {
      console.error(`Error copying table ${tableId}:`, err);
      setError(`Failed to copy table data. ${err.message}`);
      showToast('Failed to copy table data', 'error');
    } finally {
      // Update copying state
      setTableIsCopying(prev => ({
        ...prev,
        [tableId]: false
      }));
    }
  };
  
  // Fetch and process data for a specific table
  const fetchAndProcessTableData = async (tableId, rowCount) => {
    const table = tables.find(t => t.id === tableId);
    if (!table) return;
    
    try {
      // Skip row fetch if "Columns Only" is selected
      if (rowCount === '0') {
        // Update tableData with empty rows
        setTableData(prev => ({
          ...prev,
          [tableId]: {
            ...prev[tableId],
            rows: []
          }
        }));
        
        // Update preview JSON
        updatePreviewJson();
        return;
      }
      
      // Fetch rows
      const limit = rowCount === 'All' ? undefined : parseInt(rowCount, 10);
      const response = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/rows`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
          params: { limit, valueFormat: 'simpleWithArrays' },
        }
      );
      
      // Update tableData with fetched rows
      setTableData(prev => ({
        ...prev,
        [tableId]: {
          ...prev[tableId],
          rows: response.data.items
        }
      }));
      
      // Update preview JSON
      updatePreviewJson();
    } catch (err) {
      console.error(`Error fetching rows for table ${tableId}:`, err);
      setError(`Failed to fetch rows for table. ${err.message}`);
    }
  };
  
  // Process table data to the desired format
  const processTableData = (tableId) => {
    const data = tableData[tableId];
    if (!data) return {};
    
    const columns = columnsData[tableId] || [];
    const rows = data.rows || [];
    const selectedColIds = selectedColumns[tableId] || [];
    
    // Create a mapping from column ID to column name
    const columnIdToNameMap = {};
    columns.forEach(column => {
      columnIdToNameMap[column.id] = column.name;
    });
    
    // Only include selected columns
    const filteredColumns = columns.filter(col => selectedColIds.includes(col.id));
    
    // Create structured data (column-centric)
    const structuredData = {};
    
    // Add column definitions
    filteredColumns.forEach(column => {
      structuredData[column.name] = {
        ...column,
        rows: []
      };
    });
    
    // Add row data under each column
    rows.forEach(row => {
      if (row.values) {
        Object.entries(row.values).forEach(([columnId, value]) => {
          const columnName = columnIdToNameMap[columnId];
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
  
  // Toggle showing the column filter for a specific table
  const toggleColumnFilter = (tableId) => {
    setShowColumnFilter(current => current === tableId ? null : tableId);
  };
  
  // Handle column selection change
  const handleColumnToggle = (tableId, selectedColIds) => {
    setSelectedColumns(prev => ({
      ...prev,
      [tableId]: selectedColIds
    }));
    
    // Update preview JSON
    updatePreviewJson();
  };
  
  // Update preview JSON data based on selected tables, columns, and rows
  const updatePreviewJson = () => {
    const previewData = {};
    
    // Process each selected table
    Array.from(selectedTables).forEach(tableId => {
      const table = tables.find(t => t.id === tableId);
      if (table) {
        previewData[table.name] = processTableData(tableId);
      }
    });
    
    setPreviewJsonData(previewData);
  };
  
  // When selected tables change, update the preview JSON
  useEffect(() => {
    updatePreviewJson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTables, tableData, selectedColumns]);

  // Row selector options
  const rowOptions = [
    { label: 'Columns Only', value: '0', color: 'gray' },
    { label: '1 Row', value: '1', color: 'gray' },
    { label: 'All Rows', value: 'All', color: 'gray' },
  ];

  return (
    <div className="flex flex-col xl:flex-row xl:space-x-6 max-w-7xl mx-auto">
      {/* Left side - Input and tables */}
      <div className="w-full xl:w-1/2 space-y-6">
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
                  onChange={(e) => {
                    setApiToken(e.target.value);
                    setApiTokenError('');
                  }}
                  className={`w-full p-2 border rounded-md mt-1 ${apiTokenError ? 'border-red-500' : ''}`}
                  placeholder="Enter your Coda API token"
                />
              </label>
              {apiTokenError && (
                <p className="text-red-500 text-xs mt-1">{apiTokenError}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document ID
                <input
                  type="text"
                  value={docId}
                  onChange={(e) => {
                    setDocId(e.target.value);
                    setDocIdError('');
                  }}
                  className={`w-full p-2 border rounded-md mt-1 ${docIdError ? 'border-red-500' : ''}`}
                  placeholder="Enter your Coda Document ID"
                />
              </label>
              {docIdError && (
                <p className="text-red-500 text-xs mt-1">{docIdError}</p>
              )}
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

        {/* Table Selector */}
        {tables.length > 0 && (
          <TableSelector
            tables={tables}
            selectedTables={selectedTables}
            setSelectedTables={setSelectedTables}
            onCopyTable={handleCopyTableData}
            onSelectRowsOption={handleSelectRowsOption}
            rowOptions={rowOptions}
            selectedRowCounts={selectedRowCounts}
            isCopying={tableIsCopying}
          />
        )}

        {/* Column Filter for Selected Table */}
        {showColumnFilter && columnsData[showColumnFilter] && (
          <ColumnFilter 
            tableId={showColumnFilter}
            tableName={tables.find(t => t.id === showColumnFilter)?.name || 'Table'}
            columns={columnsData[showColumnFilter]}
            selectedColumns={selectedColumns[showColumnFilter] || []}
            onColumnToggle={handleColumnToggle}
          />
        )}

        {/* Selected Tables Buttons */}
        {selectedTables.size > 0 && (
          <div className="bg-white p-4 border rounded-lg shadow-md">
            <div className="flex flex-wrap gap-2 justify-between items-center">
              <h3 className="text-md font-semibold">Selected Tables:</h3>
              <button
                onClick={handleCopyAllTables}
                disabled={copyLoading}
                className="px-3 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center text-sm"
              >
                {copyLoading ? (
                  <>
                    <LoadingSpinner className="h-4 w-4 mr-2" />
                    Copying All...
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-4 w-4 mr-2" />
                    Copy All Tables
                  </>
                )}
              </button>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {Array.from(selectedTables).map(tableId => {
                const table = tables.find(t => t.id === tableId);
                return (
                  <button
                    key={tableId}
                    onClick={() => toggleColumnFilter(tableId)}
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      showColumnFilter === tableId 
                        ? 'bg-blue-100 border border-blue-400' 
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {table?.name} ({selectedColumns[tableId]?.length || 0} columns)
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading Skeleton */}
        {loading && <SkeletonLoader />}

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}
      </div>

      {/* Right side - JSON Preview */}
      <div className="w-full xl:w-1/2 mt-6 xl:mt-0 sticky top-6 self-start">
        <JsonPreviewPanel 
          jsonData={previewJsonData} 
          title="Combined JSON Preview" 
        />
      </div>

      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default CodaDocScraper;