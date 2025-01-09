import React, { useState, useEffect } from "react";
import useCodaApi from "./hooks/useCodaApi";
import InputForm from "./components/InputForm";
import TableSelector from "./components/TableSelector";
import DataDisplay from "./components/DataDisplay/DataDisplay";
import ErrorDisplay from "./components/ErrorDisplay";
import WelcomeCard from "./components/WelcomeCard";

const CodaDocScraper = () => {
  const [apiToken, setApiToken] = useState("");
  const [docId, setDocId] = useState("");
  const [rowCount, setRowCount] = useState("All");
  const [selectedTables, setSelectedTables] = useState([]);
  const [isFetchingTables, setIsFetchingTables] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);

  const { tableData, setTableData, tables, loading, error, fetchTables, fetchData, setError } = useCodaApi();

  // Load saved config from localStorage
  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem("codaConfig") || "{}");
    setApiToken(savedConfig.apiToken || "");
    setDocId(savedConfig.docId || "");
  }, []);

  // Save config to localStorage
  useEffect(() => {
    const config = { apiToken, docId };
    localStorage.setItem("codaConfig", JSON.stringify(config));
  }, [apiToken, docId]);

  // Clear fetched data when selected tables change
  useEffect(() => {
    setTableData({});
  }, [selectedTables]);

  // Handle fetch tables button click
  const handleFetchTables = async () => {
    if (!apiToken || !docId) {
      setError("Please provide an API Token and Document ID.");
      return;
    }

    setIsFetchingTables(true);
    await fetchTables(apiToken, docId);
    setIsFetchingTables(false);
  };

  // Handle fetch data button click
  const handleFetchData = async () => {
    if (selectedTables.length === 0) {
      setError("Please select at least one table.");
      return;
    }

    setIsFetchingData(true);

    // Fetch data for each selected table
    for (const tableId of selectedTables) {
      await fetchData(apiToken, docId, tableId, rowCount);
    }

    setIsFetchingData(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        {/* Welcome Card */}
        <WelcomeCard />

        {/* Section 1: API Token and Document ID */}
        <div className="bg-white p-6 border rounded-lg shadow-md">
          <h2 className="text-lg font-bold mb-4">API Token and Document ID</h2>
          <InputForm
            apiToken={apiToken}
            setApiToken={setApiToken}
            docId={docId}
            setDocId={setDocId}
          />
          <button
            onClick={handleFetchTables}
            disabled={isFetchingTables || loading || !apiToken || !docId}
            className="w-full px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
            title={!apiToken || !docId ? "Please enter API Token and Document ID" : ""}
          >
            {isFetchingTables || loading ? "Fetching Tables..." : "Get Tables"}
          </button>
        </div>

        {/* Section 2: Tables (Select, Num Rows, Fetch Data Button) */}
        {tables.length > 0 && (
          <div className="bg-white p-6 border rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Tables</h2>
            <TableSelector
              tables={tables}
              selectedTables={selectedTables}
              setSelectedTables={setSelectedTables}
            />

            {/* Number of Rows Select and Fetch Data Button */}
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
                <button
                  onClick={handleFetchData}
                  disabled={isFetchingData || loading}
                  className="w-full px-4 py-1.5 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
                >
                  {isFetchingData || loading ? 'Fetching Data...' : 'Fetch Data'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Section 3: Fetched Data (Copy/Export Buttons, Table Names, JSON) */}
        {selectedTables.length > 0 && Object.keys(tableData).length > 0 && (
          <div className="bg-white p-6 border rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Fetched Data</h2>
            <DataDisplay tableData={tableData} selectedTables={selectedTables} tables={tables} />
          </div>
        )}

        {/* Error display */}
        {error && <ErrorDisplay error={error} />}
      </div>
    </div>
  );
};

export default CodaDocScraper;