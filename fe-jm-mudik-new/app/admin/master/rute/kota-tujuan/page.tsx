
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../../../components/BreadcrumbsComponent';
import MediaCard from '../../../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ModalForm from './ModalForm'
import axios from 'axios';

type KabupatenTujuanApiResponse = {
  data:  Array<KabupatenTujuan>
  meta: {
    totalRowCount: number;
  };
}

type KabupatenTujuan = {
  id: string;
  parent_id: string;
  route: string;
  route_level: string;
  latitude: string;
  longitude: string;
  is_show: boolean
  name: string;
  active: boolean;
  kabupaten: Kabupaten;
  created_by: string;
  updated_by: string;
}

type Kabupaten = {
    id: string,
    provinsi_id: string,
    name: string,
    active: boolean,
}

type KotaTujuan = {

}

export default function KabupatenTujuan() {

  const [dataKabupatenTujuan, setDataKabupatenTujuan] = useState<KabupatenTujuan[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/rute`)
      .then(async(response) => {
        const convertData:any =  (await response.data) as KabupatenTujuanApiResponse
        console.log(convertData.data);
        setDataKabupatenTujuan(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<KabupatenTujuan>[]>(
    () => [
      {
        accessorKey: "parent_id", //access nested data with dot notation
        header: "Rute Terhubung",
        size: 150,
      },
      {
          accessorKey: "route",
          header: "Jalur",
          size: 150,
        },
        {
          accessorKey: "kabupaten.name",
          header: "Kota Tujuan",
          size: 150,
        },
      {
        accessorKey: "route_level",
        header: "Level Rute",
        size: 150,
      },
      {
        accessorKey: "is_show",
        header: "Status",
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
    ],
    // ] as MRT_ColumnDef<(typeof data)[0]>[],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: dataKabupatenTujuan, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Rute Kota Tujuan Akhir" children={<MaterialReactTable table={table} />} buttonCreate={<ModalForm fetchData={fetchData}/>}/>
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}