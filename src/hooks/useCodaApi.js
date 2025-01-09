import { useState, useCallback } from 'react';
import axios from 'axios';

const useCodaApi = () => {
  const [rows, setRows] = useState([]);
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]); // Store column metadata
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
      console.log('Fetching tables...');
      const tablesResponse = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      console.log('Tables fetched:', tablesResponse.data.items);
      setTables(tablesResponse.data.items);
    } catch (err) {
      console.error('Error fetching tables:', err);
      if (err.response?.status === 401) {
        setError('Invalid API Token. Please check your token and try again.');
      } else if (err.response?.status === 404) {
        setError('Document not found. Please check your Document ID.');
      } else {
        setError('Failed to fetch tables. Please try again.');
      }
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
    setColumns([]); // Reset columns
    setRows([]); // Reset rows
  
    try {
      console.log('Fetching data for table:', tableId);
      console.log('Row count:', rowCount);
  
      // Always fetch column metadata
      const columnsResponse = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/columns`,
        {
          headers: {
            Authorization: `Bearer ${apiToken}`,
          },
        }
      );
      console.log('Columns fetched:', columnsResponse.data.items);
      setColumns(columnsResponse.data.items); // Store column metadata
  
      // Fetch rows if rowCount > 0
      if (rowCount !== '0') {
        const params = {
          limit: rowCount === 'All' ? undefined : rowCount,
          valueFormat: 'simpleWithArrays',
        };
  
        console.log('API request params:', params);
  
        const rowsResponse = await axios.get(
          `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/rows`,
          {
            headers: {
              Authorization: `Bearer ${apiToken}`,
            },
            params,
          }
        );
  
        console.log('API request URL:', rowsResponse.config.url);
        console.log('Rows fetched:', rowsResponse.data.items);
        setRows(rowsResponse.data.items);
      }
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

  return { rows, tables, columns, loading, error, fetchTables, fetchData, setError };
};

export default useCodaApi;