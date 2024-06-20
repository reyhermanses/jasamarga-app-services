import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

type Props = {
  nomor_bus: string;
  muatan: string;
  total_penumpang: string;
}

const BoxBus: React.FC<Props> = ({nomor_bus, muatan, total_penumpang}) => {
  return (
    <Card sx={{ maxWidth: 300 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="250"
        image="/bus.svg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          Bus {nomor_bus}
        </Typography>
        {/* <Typography variant="body2" color="text.secondary">
          Lizards are a widespread group of squamate reptiles, with over 6,000
          species, ranging across all continents except Antarctica
        </Typography> */}
      </CardContent>
      <CardActions>
        <Button size="small">Max Quota {muatan}</Button>
        <Button size="small">Penumpang {total_penumpang}</Button>
      </CardActions>
    </Card>
  );
}

export default BoxBus