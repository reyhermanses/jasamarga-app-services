'use client'

import { Stack } from '@mui/material';
import BasicTable from './components/BasicTable';
import BasicBreadcrumbs from './components/BreadcrumbsComponent';
import AdvancedTable from './components/AdvancedTable';
import MediaCard from './components/MediaCard'

export default function page(){
  return (
    <div>
      <Stack
        direction="column"
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
      <BasicBreadcrumbs />
      {/* <AdvancedTable/> */}
    {/* <MediaCard/> */}
      </Stack>
    </div>
  );
}