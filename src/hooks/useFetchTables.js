import { useState, useCallback } from 'react';
import axios from 'axios';

const useFetchTables = () => {
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

  return { tables, setTables, loading, error, fetchTables };
};

export default useFetchTables;