'use client'
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Stack from '@mui/material/Stack';
import BoxBus from './BoxBus'
import MediaCard from '../../components/MediaCard'
import BasicBreadcrumbs from '../../components/BreadcrumbsComponent'

const Bus = () => {

  const [dataBus, setDataBus] = useState<any>([]);

  const fetchData = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/api/bus`)
      .then(async(response) => {
        // Handle successful response
        console.log('Response data:', response.data);
        setDataBus(response.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }
  
  useEffect(() => {
    fetchData();
  }, [])

  const listBus = <Stack spacing={{ xs: 3, sm: 2 }} direction="row" useFlexGap flexWrap="wrap">
  {dataBus.map((e: any, index: number) => {
     console.log(e);
     return (
         <BoxBus key={index} nomor_bus={e.nomor} muatan={e.muatan} total_penumpang={e.passengers.length} />
     )
 })}
 </Stack>;

  return (
    <Stack
      direction="column"
      spacing={{ xs: 1, sm: 2, md: 4 }}
    >
        <BasicBreadcrumbs />
        <MediaCard title={"Bus"} children={listBus}/>
        </Stack>
  );
};

export default Bus;
