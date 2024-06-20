import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import RoleMasterModalForm from './RoleMasterModal';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//example data type
type Person = {
  role: string;
  description: string;
  status: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
  {
    role: "Super Admin",
    description: 'Lorem Ipsum',
    status: 'Active',
  },
  {
    role: "Admin",
    description: 'Lorem Ipsum',
    status: 'Active',
  },
  {
    role: "Operator",
    description: 'Lorem Ipsum',
    status: 'Active',
  },
  {
    role: "User",
    description: 'Lorem Ipsum',
    status: 'Inactive',
  },
];

const RoleMasterTable = () => {
  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'role', //access nested data with dot notation
        header: 'Role',
        size: 150,
        colSpan: 8,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        size: 150,
        colSpan: 8,
      },
      {
        accessorKey: 'status', //normal accessorKey
        header: 'Status',
        size: 200,
      },
    ],
    [],
  );

  const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d2', // Set your primary color here
      },
      secondary: {
        main: '#dc004e', // Set your secondary color here
      },
    },
  });

  const table = useMaterialReactTable({
    columns,
    data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowActions: true,
    renderRowActions: () => ([
      <RoleMasterModalForm />
    ]),
    muiTableHeadCellProps: {
      sx: {
        //use the `&` syntax to target nested elements by their class
        '& .Mui-TableHeadCell-Content': {
          padding: '0',
        },
        //use the `&` syntax to target hover state
        '&:hover': {
          fontWeight: 'bold',
        },
      },
    },
  });

  return <MaterialReactTable table={table} />;
  // return (
  //   <ThemeProvider theme={theme}>
  //     <MaterialReactTable
  //       columns={columns}
  //       data={data} // Data must be memoized or stable
  //       enableRowActions
  //       renderRowActions={({ row }) => (
  //         <RoleMasterModalForm />
  //       )}
  //       muiTableHeadCellProps={{
  //         sx: {
  //           // Use the `&` syntax to target nested elements by their class
  //           '& .Mui-TableHeadCell-Content': {
  //             padding: '0',
  //           },
  //           // Use the `&` syntax to target hover state
  //           '&:hover': {
  //             fontWeight: 'bold',
  //           },
  //         },
  //       }}
  //     />
  //   </ThemeProvider>
  // )
};

// export default RoleMasterTable;

export default RoleMasterTable