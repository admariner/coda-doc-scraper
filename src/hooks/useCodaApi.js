import { useState, useCallback } from 'react';
import axios from 'axios';

const useCodaApi = () => {
    const [tableData, setTableData] = useState({}); // Store data by tableId: { rows, columns }
    const [tables, setTables] = useState([]); // List of tables (excluding views)
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error message

    // Fetch tables from Coda API (only tables, not views)
    const fetchTables = useCallback(async (apiToken, docId, retries = 3) => {
        if (!apiToken || !docId) {
          setError('Please provide an API Token and Document ID.');
          return;
        }
      
        setLoading(true);
        setError('');
      
        try {
          const tablesResponse = await axios.get(
            `https://coda.io/apis/v1/docs/${docId}/tables`,
            {
              headers: {
                Authorization: `Bearer ${apiToken}`,
              },
              params: {
                tableTypes: 'table',
              },
            }
          );
          setTables(tablesResponse.data.items);
        } catch (err) {
          if (retries > 0) {
            setTimeout(() => fetchTables(apiToken, docId, retries - 1), 1000);
          } else {
            console.error('Error fetching tables:', err);
            setError('Failed to fetch tables. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      }, []);

    // Fetch data for a specific table
    const fetchData = useCallback(async (apiToken, docId, tableId, rowCount) => {
        if (!apiToken || !docId || !tableId) {
          setError('Please provide an API Token, Document ID, and Table ID.');
          return;
        }
      
        setLoading(true);
        setError('');
      
        try {
          // Fetch columns
          const columnsResponse = await axios.get(
            `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/columns`,
            {
              headers: {
                Authorization: `Bearer ${apiToken}`,
              },
            }
          );
      
          // Fetch rows if rowCount > 0
          let rows = [];
          if (rowCount !== '0') {
            let nextPageLink = `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/rows`;
            const params = {
              limit: rowCount === 'All' ? undefined : rowCount,
              valueFormat: 'simpleWithArrays',
            };
      
            // Fetch rows with pagination
            while (nextPageLink) {
              const rowsResponse = await axios.get(nextPageLink, {
                headers: {
                  Authorization: `Bearer ${apiToken}`,
                },
                params,
              });
      
              // Filter out empty values ("") from each row
              const filteredRows = rowsResponse.data.items.map((row) => {
                const filteredValues = {};
                for (const [key, value] of Object.entries(row.values)) {
                  if (value !== "") {
                    filteredValues[key] = value;
                  }
                }
                return { ...row, values: filteredValues };
              });
      
              // Add filtered rows to the rows array
              rows = [...rows, ...filteredRows];
      
              // Check if there's a next page
              nextPageLink = rowsResponse.data.nextPageLink;
      
              // If rowCount is not "All", stop fetching after the first request
              if (rowCount !== 'All') {
                break;
              }
            }
          }
      
          // Update tableData state
          setTableData((prev) => ({
            ...prev,
            [tableId]: { rows, columns: columnsResponse.data.items },
          }));
        } catch (err) {
          console.error('Error fetching data:', err);
          if (err.response?.status === 401) {
            setError('Invalid API Token. Please check your token and try again.');
          } else if (err.response?.status === 404) {
            setError('Table not found. Please check your Table ID.');
          } else {
            setError('Failed to fetch data. Please try again.');
          }
        } finally {
          setLoading(false);
        }
      }, []);

    return { tableData, setTableData, tables, loading, error, fetchTables, fetchData, setError };
};

export default useCodaApi;