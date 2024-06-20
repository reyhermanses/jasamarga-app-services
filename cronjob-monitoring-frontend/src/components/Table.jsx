// DataTable.js
import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import './Table.module.css'; // Import your custom CSS file

function Table({ columns, rows }) {
  return (
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
      />
  );
}

export default Table;