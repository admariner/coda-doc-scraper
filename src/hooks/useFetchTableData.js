import { useState, useCallback } from 'react';
import axios from 'axios';

const useFetchTableData = () => {
  const [tableData, setTableData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = useCallback(async (apiToken, docId, tableId, rowCount) => {
    if (!apiToken || !docId || !tableId) {
      setError('Please provide an API Token, Document ID, and Table ID.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log(`Fetching data for table ${tableId} with rowCount: ${rowCount}`); // Debugging

      // Fetch columns
      const columnsResponse = await axios.get(
        `https://coda.io/apis/v1/docs/${docId}/tables/${tableId}/columns`,
        { headers: { Authorization: `Bearer ${apiToken}` } }
      );
      console.log('Columns fetched:', columnsResponse.data.items); // Debugging

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
        console.log('Rows fetched:', rows); // Debugging
      }

      // Update tableData state
      setTableData((prev) => ({
        ...prev,
        [tableId]: { rows, columns: columnsResponse.data.items },
      }));
      console.log('Updated tableData:', { [tableId]: { rows, columns: columnsResponse.data.items } }); // Debugging
    } catch (err) {
      console.error('Error fetching data:', err); // Debugging
      setError('Failed to fetch data. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  return { tableData, setTableData, loading, error, fetchData };
};

export default useFetchTableData;