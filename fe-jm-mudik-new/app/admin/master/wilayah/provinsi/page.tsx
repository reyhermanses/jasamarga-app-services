
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../../../components/BreadcrumbsComponent';
import MediaCard from '../../../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';

type ProvinsiApiResponse = {
  data:  Array<Provinsi>
  meta: {
    totalRowCount: number;
  };
}

type Provinsi = {
  id: string;
  name: string;
  active: boolean;
  created_by: string;
  updated_by: string;
}

export default function Provinsi() {

  const [dataProvinsi, setDataProvinsi] = useState<Provinsi[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/wilayah/provinsi`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as ProvinsiApiResponse
        console.log(convertData.data);
        setDataProvinsi(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<Provinsi>[]>(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Nama Provinsi",
        size: 150,
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
    data: dataProvinsi, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Provinsi" children={<MaterialReactTable table={table} />} />
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}