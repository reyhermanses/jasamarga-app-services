
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../../../components/BreadcrumbsComponent';
import MediaCard from '../../../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';

type KecamatanApiResponse = {
  data:  Array<Kecamatan>
  meta: {
    totalRowCount: number;
  };
}

type Kecamatan = {
  id: string;
  name: string;
  active: boolean;
  created_by: string;
  updated_by: string;
}

export default function Kecamatan() {

  const [dataKecamatan, setDataKecamatan] = useState<Kecamatan[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/wilayah/Kecamatan`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as KecamatanApiResponse
        console.log(convertData.data);
        setDataKecamatan(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<Kecamatan>[]>(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Nama Kecamatan",
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
    data: dataKecamatan, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Kecamatan" children={<MaterialReactTable table={table} />} />
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}