
'use client'

import { Stack } from '@mui/material';
import MediaCard from '@/app/components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Form from "./Form"
import BasicBreadcrumbs from '../../../components/BreadcrumbsComponent';
import axios from 'axios';
import moment from 'moment';

type TanggalMudikApiResponse = {
  data:  Array<TanggalMudik>
  meta: {
    totalRowCount: number;
  };
}

type TanggalMudik = {
  id: string;
  tanggal: string;
  active: boolean;
  created_by: string;
  updated_by: string;
}

export default function TanggalMudik() {

  const [dataTanggalMudik, setDataTanggalMudik] = useState<TanggalMudik[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/tanggal`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as TanggalMudikApiResponse
        console.log(convertData.data);
        setDataTanggalMudik(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<TanggalMudik>[]>(
    () => [
      {
        accessorKey: "tanggal", //access nested data with dot notation
        header: "Tanggal Mudik",
        size: 150,
        cell: (rowData:any) => {
            // Custom render function for the date column
            // Assuming 'date' is stored as a string, you can format it using moment.js or any other date formatting library
            return moment(rowData.date).format('DD/MM/YYYY'); // Format the date as 'DD/MM/YYYY'
            // const date = new Date(dateString);
            // return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          },
      },
      {
        accessorKey: "active",
        header: "Status Active",
        size: 150,
      },
      {
        accessorKey: "created_by", //normal accessorKey
        header: "Dibuat oleh",
        size: 200,
      },
      {
        accessorKey: "updated_by",
        header: "Dirubah oleh",
        size: 150,
      },
      {
        accessorKey: "state",
        header: "State",
        size: 150,
      },
    ],
    // ] as MRT_ColumnDef<(typeof data)[0]>[],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: dataTanggalMudik, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  const buttonCreate =  <Button style={{ backgroundColor: "#20C997", color: "#fff" }}>
  Create
</Button>

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Tanggal Mudik" children={<MaterialReactTable table={table}/>} buttonCreate={<Form fetchData={fetchData}/>} />
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}