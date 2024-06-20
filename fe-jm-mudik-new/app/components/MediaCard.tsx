import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { CardHeader, Divider, IconButton } from "@mui/material";
import BasicTable from "./BasicTable";

interface Props {
  title?: string;
  children?: any;
  buttonCreate?: any;
}

const MediaCard: React.FC<Props> = ({ title, children, buttonCreate }) => {
  return (
    <Card sx={{ maxWidth: "100%", backgroundColor: "#364FC7", color: "#fff" }}>
      <CardHeader
        title={title}
        action={buttonCreate}
      />
      <Divider />
      <CardContent style={{ backgroundColor: "#DBE4FF", color: "#fff" }}>
        {children}
      </CardContent>
    </Card>
  );
}

export default MediaCard