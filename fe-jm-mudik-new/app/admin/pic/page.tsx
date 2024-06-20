
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../components/BreadcrumbsComponent';
import MediaCard from '../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ModalForm from './ModalForm'
import axios from 'axios';

type PicApiResponse = {
  data:  Array<Pic>
  meta: {
    totalRowCount: number;
  };
}

type Pic = {
  id: string;
  company_name: string;
  kd_comp: string;
  muatan: string;
  priority: string;
  active: boolean;
  created_by: string;
  updated_by: string;
}

export default function Pic() {

  const [dataPic, setDataPic] = useState<Pic[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/api/pic`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as PicApiResponse
        console.log(convertData.data);
        setDataPic(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<Pic>[]>(
    () => [
      {
        accessorKey: "company_name", //access nested data with dot notation
        header: "Company Name",
        size: 150,
      },
      {
        accessorKey: "kd_comp", //access nested data with dot notation
        header: "KD Comp",
        size: 150,
      },
      {
        accessorKey: "muatan", //access nested data with dot notation
        header: "Quota",
        size: 150,
      },
      {
        accessorKey: "priority", //access nested data with dot notation
        header: "Prioritas",
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
    ],
    // ] as MRT_ColumnDef<(typeof data)[0]>[],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: dataPic, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Pic" children={<MaterialReactTable table={table} />} buttonCreate={<ModalForm fetchData={fetchData}/>} />
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}