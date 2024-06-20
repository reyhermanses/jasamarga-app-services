
'use client'

import { Stack } from '@mui/material';
import BasicBreadcrumbs from '../../components/BreadcrumbsComponent';
import MediaCard from '../../components/MediaCard'
import { useEffect, useMemo, useState } from 'react';
import { MRT_ColumnDef, MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import FullscreenModalForm from './FullscreenModalForm'
import axios from 'axios';

type RegistrationTujuanApiResponse = {
  data:  Array<RegistrationTujuan>
  meta: {
    totalRowCount: number;
  };
}

type RegistrationTujuan = {
  id: string;
  nama_lengkap: string
  gender: string;
  tanggal_lahir: string;
  alamat: string;
  no_hp: string;
  tiket: Tiket
}

type Tiket = {
  registration_number: string;
  registration_place: string;
  status: string,
  kota_tujuan_akhir: KotaTujuanAkhir,
  kota_tujuan: KotaTujuan
}

type Pic = {
    id: string;
    kd_comp: string;
}

type KotaTujuanAkhir = {
    id: string;
    route: string;
    kabupaten: Kabupaten;
}

type Kabupaten = {
    id: string;
    provinsi_id: string;
    name: string;
}

type KotaTujuan = {
    id: string;
    kecamatan: Kecamatan;
}

type Kecamatan = {
    id: string;
    provinsi_id: string;
    name: string;
}

export default function Registrasi() {

  const [dataRegistrationTujuan, setDataRegistrationTujuan] = useState<RegistrationTujuan[]>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/api/registration-member?ticket_status=Registered`)
      .then(async(response) => {
        // Handle successful response
        // console.log('Response data:', response.data);
        const convertData:any =  (await response.data) as RegistrationTujuanApiResponse
        setDataRegistrationTujuan(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  useEffect(() => {
    fetchData();
  },[])

  const columns = useMemo<MRT_ColumnDef<RegistrationTujuan>[]>(
    () => [
      {
        accessorKey: "tiket.registration_number",
        header: "No Tiket",
        size: 150,
      },
      {
        accessorKey: "nama_lengkap",
        header: "Nama Peserta",
        size: 150,
      },
      {
        accessorKey: "tiket.kota_tujuan_akhir.kabupaten.name",
        header: "Kota Tujuan Akhir",
        size: 150,
      },
      {
        accessorKey: "tiket.kota_tujuan.kecamatan.name",
        header: "Kota Tujuan",
        size: 150,
      },
      {
        accessorKey: "gender",
        header: "Jenis Kelamin",
        size: 150,
      },
      {
        accessorKey: "tanggal_lahir",
        header: "Tanggal Lahir",
        size: 150,
      },
      {
        accessorKey: "alamat",
        header: "Alamat",
        size: 150,
      },
      {
        accessorKey: "no_hp",
        header: "Nomor Handphone",
        size: 150,
      },
      {
        accessorKey: "tiket.registration_place",
        header: "Tempat Daftar",
        size: 150,
      },
      {
        accessorKey: "tiket.status",
        header: "Status Tiket",
        size: 150,
      },
    ],
    // ] as MRT_ColumnDef<(typeof data)[0]>[],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: dataRegistrationTujuan, //data must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    paginationDisplayMode: "pages",
  });

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
      <BasicBreadcrumbs />
      <MediaCard title="Registrasi" children={<MaterialReactTable table={table}/>} buttonCreate={<FullscreenModalForm/>} />
      {/* <MediaCard title="Master Data" children={"table"} /> */}
    </Stack>
  )
}