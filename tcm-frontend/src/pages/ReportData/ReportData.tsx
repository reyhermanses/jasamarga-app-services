import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { CTable } from '../../components/CTable/CTable';

export function ReportData() {
    const sxButton = {
        width: 25,
        height: 55
    }

    return (
        <>
            Report Data
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1 },
                    '& button': { m: 1, width: '5ch', height: '5.8ch' }
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic" label="Regional" variant="outlined" />
                <TextField id="outlined-basic" label="Ruas" variant="outlined" />
                <TextField id="outlined-basic" label="Gerbang" variant="outlined" />
                <TextField id="outlined-basic" label="Tahun" variant="outlined" />
                <Button variant="contained" size='medium'>Filter</Button>
                <Button variant="outlined">Reset</Button>
            </Box>
            <Box>
                <CTable/>
            </Box>
        </>
    )
}