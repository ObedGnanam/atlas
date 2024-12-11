import React, { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

function InfiniteScrollGrid() {
  const [loading, setLoading] = useState(false);

  const columnDefs = [
    { headerName: 'ID', field: 'id', sortable: true },
    { headerName: 'Name', field: 'name', sortable: true },
    { headerName: 'Username', field: 'username', sortable: true },
    { headerName: 'Email', field: 'email', sortable: true },
    { headerName: 'City', field: 'address.city', sortable: true },
  ];

  const datasource = {
    getRows: (params) => {
      setLoading(true);
      const { startRow, endRow } = params;

      // Fetching data from the API
      fetch(`https://json-server-vercel-inky.vercel.app/users?_page=${Math.floor(startRow / 10) + 1}&_limit=10`)
        .then(response => response.json())
        .then(data => {
          const rowsThisBlock = data; // Adjust data if needed (e.g., mapping).
          const lastRow = rowsThisBlock.length < 10 ? startRow + rowsThisBlock.length : -1; // Handle last row
          params.successCallback(rowsThisBlock, lastRow); // Pass data and last row to AG Grid
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          params.failCallback();
        })
        .finally(() => {
          setLoading(false);
        });
    },
  };

  const gridOptions = {
    rowModelType: 'infinite', // Enable infinite scrolling
    datasource: datasource, // Set the data source directly
    cacheBlockSize: 10, // Number of rows per block
    maxBlocksInCache: 10, // Maximum number of blocks to cache
    paginationPageSize: 10, // Number of rows per page
    pagination: true,
    domLayout: 'autoHeight', // Dynamically adjust grid height
  };

  return (
    <div>
      <div className="ag-theme-alpine" style={{ height: '600px', width: '100%' }}>
        {loading && <div className="loading-indicator">Loading...</div>}
        <AgGridReact
          columnDefs={columnDefs}
          gridOptions={gridOptions} // Pass gridOptions directly to AgGridReact
        />
      </div>
    </div>
  );
}

export default InfiniteScrollGrid;
