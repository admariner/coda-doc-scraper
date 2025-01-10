import { useState, useCallback } from 'react';
import axios from 'axios';

const useCodaApi = () => {
  const [tableData, setTableData] = useState({});
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTables = useCallback(async (apiToken, docId) => {
    if (!apiToken || !docId) {
      setError('Please provide an API Token and Document ID.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const tablesResponse = await axios.get(`https://coda.io/apis/v1/docs/${docId}/tables`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });

      // Fetch rowCount for each table
      const tablesWithRowCount = await Promise.all(
        tablesResponse.data.items.map(async (table) => {
          const tableDetails = await axios.get(`https://coda.io/apis/v1/docs/${docId}/tables/${table.id}`, {
            headers: { Authorization: `Bearer ${apiToken}` },
          });
          return { ...table, rowCount: tableDetails.data.rowCount };
        })
      );

      setTables(tablesWithRowCount);
    } catch (err) {
      setError('Failed to fetch tables. Please check your API token and document ID.');
    } finally {
      setLoading(false);
    }
  }, []);

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
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );
  
      // Fetch rows with the specified rowCount
      let rows = [];
      if (rowCount !== '0') {
        const rowsResponse = await axios.get(
          `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/rows`,
          {
            headers: { Authorization: `Bearer ${apiToken}` },
            params: {
              limit: rowCount === 'All' ? undefined : parseInt(rowCount, 10), // Pass rowCount as limit
              valueFormat: 'simpleWithArrays', // Use simpleWithArrays for array values
            },
          }
        );
        rows = rowsResponse.data.items;
      }
  
      // Update tableData state
      setTableData((prev) => ({
        ...prev,
        [tableId]: { rows, columns: columnsResponse.data.items },
      }));
    } catch (err) {
      setError('Failed to fetch data. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { tableData, setTableData, tables, setTables, loading, error, fetchTables, fetchData, setError };
};

export default useCodaApi;