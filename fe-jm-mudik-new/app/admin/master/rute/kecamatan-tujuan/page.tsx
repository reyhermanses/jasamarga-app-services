
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../../../components/BreadcrumbsComponent';
import MediaCard from '../../../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ModalForm from './ModalForm'
import axios from 'axios';

type KecamatanTujuanApiResponse = {
  data:  Array<KecamatanTujuan>
  meta: {
    totalRowCount: number;
  };
}

type KecamatanTujuan = {
  id: string;
  is_show: boolean
  name: string;
  active: boolean;
  rute: Rute;
  kecamatan: Kecamatan;
  created_by: string;
  updated_by: string;
}

type Rute = {
    route: string;
    kabupaten: Kabupaten;
}

type Kabupaten = {
    name: string;
}

type Kecamatan = {
    name: string
}

export default function KecamatanTujuan() {

  const [dataKecamatanTujuan, setDataKecamatanTujuan] = useState<KecamatanTujuan[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/child-rute`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as KecamatanTujuanApiResponse
        console.log(convertData.data);
        setDataKecamatanTujuan(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<KecamatanTujuan>[]>(
    () => [
      {
        accessorKey: "rute.route",
        header: "Jalur",
        size: 150,
      },
      {
        accessorKey: "rute.kabupaten.name",
        header: "Kota",
        size: 150,
      },
      {
        accessorKey: "kecamatan.name",
        header: "Kecamatan Tujuan",
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
    data: dataKecamatanTujuan, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Kota Tujuan" children={<MaterialReactTable table={table}/>} buttonCreate={<ModalForm fetchData={fetchData}/>} />
    </Stack>
  )
}