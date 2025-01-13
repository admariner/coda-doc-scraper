import React, { useState, useEffect } from 'react';
import useCodaApi from '../../hooks/useCodaApi';
import ApiTokenForm from './ApiTokenForm';
import ContentSelect from './ContentSelect';
import PreviewModal from './PreviewModal';
import SkeletonLoader from './SkeletonLoader';
import ErrorDisplay from '../ErrorDisplay';
import Header from '../Header';
import WelcomeCard from '../WelcomeCard';

const CodaDocScraper = () => {
  const [apiToken, setApiToken] = useState(localStorage.getItem('codaApiToken') || '');
  const [docId, setDocId] = useState(localStorage.getItem('codaDocId') || '');
  const [tables, setTables] = useState([]); // Initialize as an empty array
  const [selectedTables, setSelectedTables] = useState(new Set());
  const [rowSettings, setRowSettings] = useState({}); // { tableId: { rowsToFetch: '0' | '1' | '10' | 'All' } }
  const [previewData, setPreviewData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { fetchTables, fetchColumns, fetchRows } = useCodaApi();

  // Save apiToken and docId to localStorage
  useEffect(() => {
    localStorage.setItem('codaApiToken', apiToken);
  }, [apiToken]);

  useEffect(() => {
    localStorage.setItem('codaDocId', docId);
  }, [docId]);

  // Handle fetch tables button click
  const handleFetchTables = async () => {
    if (!apiToken || !docId) {
      setError('Please provide an API Token and Document ID.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Fetching tables...'); // Debugging
      const tablesResponse = await fetchTables(apiToken, docId);
      console.log('Fetched tables:', tablesResponse); // Debugging
      setTables(tablesResponse || []); // Ensure tables is always an array
    } catch (err) {
      console.error('Error in handleFetchTables:', err); // Debugging
      setError('Failed to fetch tables. Please check your API token and document ID.');
    } finally {
      setLoading(false);
    }
  };

  // Handle table selection
  const handleSelectTable = (tableId) => {
    console.log('Selected table:', tableId); // Debugging
    setSelectedTables((prev) => {
      const next = new Set(prev);
      if (next.has(tableId)) {
        next.delete(tableId);
      } else {
        next.add(tableId);
      }
      return next;
    });
  };

  // Handle row settings change
  const handleRowSettingsChange = (tableId, rowsToFetch) => {
    console.log('Row settings changed for table:', tableId, 'Rows to fetch:', rowsToFetch); // Debugging
    setRowSettings((prev) => ({
      ...prev,
      [tableId]: { rowsToFetch },
    }));
  };

  // Generate preview data
  const generatePreviewData = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Generating preview data...'); // Debugging
      const data = {};
      for (const tableId of selectedTables) {
        const table = tables.find((t) => t.id === tableId);
        if (table) {
          console.log(`Fetching columns for table ${tableId}...`); // Debugging
          const columns = await fetchColumns(apiToken, docId, tableId);
          console.log(`Fetched columns for table ${tableId}:`, columns); // Debugging

          const rowsToFetch = rowSettings[tableId]?.rowsToFetch || '0';
          console.log(`Fetching rows for table ${tableId} (rowsToFetch: ${rowsToFetch})...`); // Debugging
          const rows = rowsToFetch === '0' ? [] : await fetchRows(apiToken, docId, tableId, rowsToFetch);
          console.log(`Fetched rows for table ${tableId}:`, rows); // Debugging

          data[table.name] = { columns, rows };
        }
      }
      console.log('Preview data:', data); // Debugging
      setPreviewData(data);
      setShowPreview(true);
    } catch (err) {
      console.error('Error in generatePreviewData:', err); // Debugging
      setError('Failed to fetch data. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full max-w-4xl space-y-6">
        <Header />
        <WelcomeCard />

        {/* API Token and Document ID Form */}
        <ApiTokenForm
          apiToken={apiToken}
          setApiToken={setApiToken}
          docId={docId}
          setDocId={setDocId}
          handleFetchTables={handleFetchTables}
          isFetchingTables={loading}
        />

        {/* Content Select Section */}
        {loading ? (
          <SkeletonLoader />
        ) : (
          tables.length > 0 && ( // Only render ContentSelect if tables are available
            <div className="bg-white p-6 border rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-4">Content Select</h2>
              <ContentSelect
                tables={tables}
                selectedTables={selectedTables}
                rowSettings={rowSettings}
                onSelectTable={handleSelectTable}
                onRowSettingsChange={handleRowSettingsChange}
              />
            </div>
          )
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={generatePreviewData}
            disabled={loading || selectedTables.size === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Preview...' : 'Preview'}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(JSON.stringify(previewData, null, 2))}
            disabled={!previewData}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed"
          >
            Copy
          </button>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <PreviewModal
            data={previewData}
            onClose={() => setShowPreview(false)}
          />
        )}

        {/* Error Display */}
        {error && <ErrorDisplay error={error} />}
      </div>
    </div>
  );
};

export default CodaDocScraper;