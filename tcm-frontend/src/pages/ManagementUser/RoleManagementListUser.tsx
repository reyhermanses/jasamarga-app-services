import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { ThemeProvider, createTheme } from '@mui/material';

//example data type
type Person = {
    name: string;
    npp: string;
    role: string;
};

//nested data is ok, see accessorKeys in ColumnDef below
const data: Person[] = [
    {
        name: "User 1",
        npp: '10220',
        role: 'Administrator'
    },
    {
        name: "User 2",
        npp: '10221',
        role: 'Operator'
    },
    {
        name: "User 1",
        npp: '10222',
        role: 'User'
    },
];

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

const RoleManagementListUser = () => {
    //should be memoized or stable
    const columns = useMemo<MRT_ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'name', //access nested data with dot notation
                header: 'Nama',
                size: 150,
            },
            {
                accessorKey: 'npp',
                header: 'Npp',
                size: 150,
            },
            {
                accessorKey: 'role', //normal accessorKey
                header: 'Role',
                size: 200,
            },
        ],
        [],
    );

    const table = useMaterialReactTable({
        columns,
        data, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    });

    //   return <MaterialReactTable table={table} />;
    return (
        <ThemeProvider theme={theme}>
            <MaterialReactTable
                columns={columns}
                data={data} // Data must be memoized or stable
                enableRowActions
                renderRowActions={({ row }) => (
                    "test"
                )}
                muiTableHeadCellProps={{
                    sx: {
                        // Use the `&` syntax to target nested elements by their class
                        '& .Mui-TableHeadCell-Content': {
                            padding: '0',
                        },
                        // Use the `&` syntax to target hover state
                        '&:hover': {
                            fontWeight: 'bold',
                        },
                    },
                }}
            />
        </ThemeProvider>
    )
};

export default RoleManagementListUser;
