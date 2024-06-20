'use client'
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { useQRCode } from 'next-qrcode';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

export default function Qrcode() {
    const theme = useTheme();

    const QrcodeValue = () => {
        const { Canvas } = useQRCode();
      
        const [data, setData] = useState('');
      
        const handleInputChange = (event:any) => {
          setData(event.target.value);
        };
      
        return (
          <div>
            <Canvas
              text={'https://localhost:8000'}
              options={{
                width: 250,
                // height: 250,
                color: { dark: '#000000', light: '#FFFFFF' },
                margin: 4,
                scale: 4,
              }}
            />
          </div>
        );
      };

  return (
    <Card sx={{ width: '100%'}}>
      <CardMedia
        sx={{ height: 400 }}
        image="/header-qr-code.png"
        title="green iguana"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Lizard
        </Typography>
          
        <Card sx={{ display: 'flex', width: '50%' }}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <CardContent sx={{ flex: '1 0 auto' }}>
                <Typography component="div" variant="h5">
                    Live From Space
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" component="div">
                    Mac Miller
                </Typography>
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
                <IconButton aria-label="previous">
                    {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
                </IconButton>
                <IconButton aria-label="play/pause">
                    <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                </IconButton>
                <IconButton aria-label="next">
                    {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
                </IconButton>
                </Box>
            </Box>
        <CardMedia
            // component="img"
            // sx={{ width: 151 }}
            // image="/static/images/cards/live-from-space.jpg"
            // alt="Live from space album cover"
        />
        <QrcodeValue/>
        </Card>

      </CardContent>
      <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  );
}

// const QrcodeValue = () => {
//   const { Canvas } = useQRCode();

//   const [data, setData] = useState('');

//   const handleInputChange = (event) => {
//     setData(event.target.value);
//   };

//   return (
//     <div>
//       <Canvas
//         text={'https://localhost:8000'}
//         options={{
//           width: 250,
//           height: 250,
//           color: { dark: '#000000', light: '#FFFFFF' },
//           margin: 4,
//           scale: 4,
//         }}
//       />
//     </div>
//   );
// };

// export QrcodeValue;
