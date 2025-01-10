import React, { useState, useEffect } from 'react';
import useFetchTables from '../../hooks/useFetchTables';
import useFetchTableData from '../../hooks/useFetchTableData';
import ApiTokenForm from './ApiTokenForm';
import GlobalActions from './GlobalActions';
import TableList from './TableList';
import Header from '../Header';
import ErrorDisplay from '../ErrorDisplay';
import WelcomeCard from '../WelcomeCard';

const CodaDocScraper = () => {
  const [apiToken, setApiToken] = useState('');
  const [docId, setDocId] = useState('');
  const [isFetchingTables, setIsFetchingTables] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const { tables, setTables, error, fetchTables, setError } = useFetchTables();
  const { tableData, setTableData, fetchData } = useFetchTableData();

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

  // Handle fetch all tables
  const handleFetchAll = async (rowCount) => {
    setIsFetchingData(true);
    for (const table of tables) {
      await fetchData(apiToken, docId, table.id, rowCount);
    }
    setIsFetchingData(false);
  };

  // Handle delete all tables
  const deleteAllTables = () => {
    setTables([]);
    setTableData({});
  };

  // Handle copy all data
  const copyAllData = () => {
    const allData = tables.reduce((acc, table) => {
      if (tableData[table.id]) {
        acc[table.name] = tableData[table.id];
      }
      return acc;
    }, {});
    navigator.clipboard.writeText(JSON.stringify(allData, null, 2));
    alert('All data copied to clipboard!');
  };

  // Handle export all data
  const exportAllData = () => {
    const allData = tables.reduce((acc, table) => {
      if (tableData[table.id]) {
        acc[table.name] = tableData[table.id];
      }
      return acc;
    }, {});
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'all-coda-data.json';
    a.click();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <Header />
        <WelcomeCard />

        {/* Section 1: API Token and Document ID */}
        <ApiTokenForm
          apiToken={apiToken}
          setApiToken={setApiToken}
          docId={docId}
          setDocId={setDocId}
          handleFetchTables={handleFetchTables}
          isFetchingTables={isFetchingTables}
        />

        {/* Section 2: Tables and Fetched Data */}
        {tables.length > 0 && (
          <div className="bg-white p-6 border rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Tables</h2>
            <GlobalActions
              handleFetchAll={handleFetchAll}
              copyAllData={copyAllData}
              exportAllData={exportAllData}
              deleteAllTables={deleteAllTables}
              isFetchingData={isFetchingData}
              tableData={tableData}
            />
            <TableList
              tables={tables}
              tableData={tableData}
              apiToken={apiToken} // Pass apiToken
              docId={docId} // Pass docId
              fetchData={(tableId, rowCount) => fetchData(apiToken, docId, tableId, rowCount)} // Pass apiToken and docId
              deleteTable={(tableId) => {
                setTables((prevTables) => prevTables.filter((table) => table.id !== tableId));
                setTableData((prevData) => {
                  const newData = { ...prevData };
                  delete newData[tableId];
                  return newData;
                });
              }}
            />
          </div>
        )}

        {/* Error display */}
        {error && <ErrorDisplay error={error} />}
      </div>
    </div>
  );
};

export default CodaDocScraper;