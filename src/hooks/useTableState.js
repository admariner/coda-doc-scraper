import { useState } from 'react';

const useTableState = () => {
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState({});

  return { tables, setTables, tableData, setTableData };
};

export default useTableState;