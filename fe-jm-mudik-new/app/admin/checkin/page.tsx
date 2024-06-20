
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../components/BreadcrumbsComponent';
import MediaCard from '../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';

type CheckinApiResponse = {
  data:  Array<Checkin>
  meta: {
    totalRowCount: number;
  };
}

type Checkin = {
  id: string;
  nama_lengkap: string;
  no_ktp: string;
  gender: string;
  alamat: string;
  no_hp: string;
  tiket: Ticket;
}

type Ticket = {
    registration_number: string;
    registration_place: string;
    status: string;
}

export default function Checkin() {

  const [dataCheckin, setDataCheckin] = useState<Checkin[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/api/registration-member?ticket_status=Checkin`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as CheckinApiResponse
        console.log(convertData.data);
        setDataCheckin(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<Checkin>[]>(
    () => [
      {
        accessorKey: "tiket.registration_number", //access nested data with dot notation
        header: "No Tiket",
        size: 150,
      },
      {
        accessorKey: "tiket.registration_place", //access nested data with dot notation
        header: "Tempat Registrasi",
        size: 150,
      },
      {
        accessorKey: "nama_lengkap", //access nested data with dot notation
        header: "Nama",
        size: 150,
      },
      {
        accessorKey: "alamat", //access nested data with dot notation
        header: "Alamat",
        size: 150,
      },
      {
        accessorKey: "nm_singkatan",
        header: "Singkatan",
        size: 150,
      },
      {
        accessorKey: "tiket.status", //access nested data with dot notation
        header: "Status Tiket",
        size: 150,
      },
    ],
    // ] as MRT_ColumnDef<(typeof data)[0]>[],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: dataCheckin, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Checkin" children={<MaterialReactTable table={table} />} />
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}