import * as React from 'react';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import AvatarComponents from './AvatarComponents';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SettingsIcon from "@mui/icons-material/Settings";
import CropFreeOutlinedIcon from "@mui/icons-material/CropFreeOutlined";
import AcUnitRoundedIcon from '@mui/icons-material/AcUnitRounded';
import { CostumizedButtonMenu } from './CostumizedButtonMenu';
import Avatar from '@mui/material/Avatar';

export default function ButtonGroup() {
  return (
    <Card
      // variant="outlined"
      sx={{
        display: "flex",
        backgroundColor: "#364FC7",
        // color: "text.secondary",
        "& svg": {
          m: 0.5,
        },
        "& hr": {
          mx: 1,
        },
      }}
    >
      
      {/* <CostumizedButtonMenu children={<CropFreeOutlinedIcon sx={{color: "#F8F9FA"}} />}/> */}
      {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
      {/* <CostumizedButtonMenu children={<NotificationsNoneOutlinedIcon sx={{color: "#F8F9FA"}} />}/> */}
      {/* <Divider orientation="vertical" variant="middle" flexItem /> */}
      <CostumizedButtonMenu children={<Avatar sx={{ width: 40, height: 40 }}>U</Avatar>}/>
      {/* <Divider orientation="vertical" variant="middle" flexItem /> */}

      {/* <CostumizedButtonMenu children={<SettingsIcon sx={{color: "#F8F9FA"}}/>}/> */}
    </Card>
  );
}