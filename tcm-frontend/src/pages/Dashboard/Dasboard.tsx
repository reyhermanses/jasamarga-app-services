import * as React from 'react';
import Box from '@mui/material/Box';
import { Button, TextField } from '@mui/material';
import { ReportDataDashboard } from '../ReportData/ReportDataDahboard';
import { CTable } from '../../components/CTable/CTable';
import RTable from '../../components/RTable/RTable';

export function Dashboard() {
    return (
        <div>
            Container Dashboard
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                <TextField id="outlined-basic" label="Outlined" variant="outlined" />
                <Button variant="contained" size='medium'>Filter</Button>
                <Button variant="outlined">Reset</Button>
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate
                autoComplete="off">
                <ReportDataDashboard/>
            </Box>
            <Box>
                <RTable/>
            </Box>
        </div>
    )
}