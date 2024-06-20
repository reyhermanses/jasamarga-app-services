import * as React from "react";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import { Typography } from '@mui/material';

export default function AvatarComponents() {
  return (
      <Avatar sx={{ bgcolor: deepPurple[500], width: 30, height: 30 }} >
        <Typography style={{ color: "white", fontSize: "11px" }} >OP</Typography>
      </Avatar>
  );
}
