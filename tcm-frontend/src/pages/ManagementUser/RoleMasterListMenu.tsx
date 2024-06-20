import { useMemo } from 'react';
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import { Checkbox, ThemeProvider, createTheme } from '@mui/material';

export type Person = {
  roleName: string;
  state: string;
  subRows?: Person[]; //Each person can have sub rows of more people
};

export const data: Person[] = [
  {
    roleName: 'Laporan Lalin',
    state: 'Kentucky',
    subRows: [
      {
        roleName: 'Per Jam',
        state: 'West Virginia',
        subRows: [
          {
            roleName: 'Per Shift',
            state: 'West Virginia',
          },
          {
            roleName: 'Per Hari',
            state: 'California',
            subRows: [
              {
                roleName: 'Export',
                state: 'West Virginia',
              },
              {
                roleName: 'Tab Lalin',
                state: 'California',
              },
              {
                roleName: 'Tab Lalin 2',
                state: 'California',
              },
            ],
          },
          {
            roleName: 'Per Minggu',
            state: 'California',
          },
        ],
      },
      {
        roleName: 'Per Bulan',
        state: 'California',
      },
    ],
  },
  {
    roleName: 'Laporan AT',
    state: 'Ohio',
    subRows: [
      {
        roleName: 'Laporan AT1',
        state: 'South Carolina',
      },
      {
        roleName: 'Laporan AT2',
        state: 'South Carolina',
      },
      {
        roleName: 'Laporan AT3',
        state: 'South Carolina',
      },
      {
        roleName: 'Laporan AT4',
        state: 'South Carolina',
      },
      {
        roleName: 'Laporan AT5',
        state: 'South Carolina',
      },
    ],
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

const RoleMasterListMenu = () => {
  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    //column definitions...
    () => [
      {
        accessorKey: 'roleName',
        header: 'Menu',
      },
      {
        accessorKey: 'active',
        header: 'Active',
        enableColumnFilter: false,
        Cell: ({ row }) => {
          return (
            <>
              <Checkbox size="small" />
            </>
          )
        }
      }
    ],
    [],
    //end
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableExpandAll: false, //hide expand all double arrow in column header
    enableExpanding: true,
    filterFromLeafRows: true, //apply filtering to all rows instead of just parent rows
    getSubRows: (row) => row.subRows, //default
    initialState: { expanded: true }, //expand all rows by default
    paginateExpandedRows: false, //When rows are expanded, do not count sub-rows as number of rows on the page towards pagination
  });

  // return <MaterialReactTable table={table} />;
  return <ThemeProvider theme={theme}>
    <MaterialReactTable
        columns={columns}
        data={data} // Data must be memoized or stable
      />
  </ThemeProvider>
};

export default RoleMasterListMenu;
