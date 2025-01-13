import { useState, useCallback } from 'react';
import axios from 'axios';

const useCodaApi = () => {
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState({}); // { tableId: [columns] }
  const [rows, setRows] = useState({}); // { tableId: [rows] }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTables = useCallback(async (apiToken, docId) => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching tables from Coda API...'); // Debugging
      const response = await axios.get(`https://coda.io/apis/v1/docs/${docId}/tables`, {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      console.log('Coda API response for tables:', response.data); // Debugging
      return response.data.items || []; // Ensure an array is returned
    } catch (err) {
      console.error('Error fetching tables:', err); // Debugging
      setError('Failed to fetch tables. Please check your API token and document ID.');
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchColumns = useCallback(async (apiToken, docId, tableId) => {
    setLoading(true);
    setError('');
    try {
      console.log(`Fetching columns for table ${tableId} from Coda API...`); // Debugging
      const response = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/columns`,
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );
      console.log('Coda API response for columns:', response.data); // Debugging
      return response.data.items || []; // Ensure an array is returned
    } catch (err) {
      console.error('Error fetching columns:', err); // Debugging
      setError('Failed to fetch columns. Please check your inputs and try again.');
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRows = useCallback(async (apiToken, docId, tableId, limit = 10, pageToken = '') => {
    setLoading(true);
    setError('');
    try {
      console.log(`Fetching rows for table ${tableId} from Coda API...`); // Debugging
      const response = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/rows`,
        {
          headers: { Authorization: `Bearer ${apiToken}` },
          params: { limit, pageToken },
        }
      );
      console.log('Coda API response for rows:', response.data); // Debugging
      return response.data.items || []; // Ensure an array is returned
    } catch (err) {
      console.error('Error fetching rows:', err); // Debugging
      setError('Failed to fetch rows. Please check your inputs and try again.');
      return []; // Return an empty array in case of error
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    tables,
    columns,
    rows,
    loading,
    error,
    fetchTables,
    fetchColumns,
    fetchRows,
  };
};

export default useCodaApi;