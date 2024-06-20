
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../../components/BreadcrumbsComponent';
import MediaCard from '../../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import axios from 'axios';

type CompanyApiResponse = {
  data:  Array<Company>
  meta: {
    totalRowCount: number;
  };
}

type Company = {
  id: string;
  name: string;
  kd_comp: string;
  nm_singkatan: string;
  active: boolean;
  created_by: string;
  updated_by: string;
}

export default function Company() {

  const [dataCompany, setDataCompany] = useState<Company[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/company`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as CompanyApiResponse
        console.log(convertData.data);
        setDataCompany(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<Company>[]>(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Nama Company",
        size: 150,
      },
      {
        accessorKey: "kd_comp", //access nested data with dot notation
        header: "KD COMP",
        size: 150,
      },
      {
        accessorKey: "nm_singkatan",
        header: "Singkatan",
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
    data: dataCompany, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Company" children={<MaterialReactTable table={table} />} />
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}