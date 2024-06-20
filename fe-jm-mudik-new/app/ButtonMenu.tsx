import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PixIcon from '@mui/icons-material/Pix';
import Link from "next/link";
import { Stack } from '@mui/material';

import { styled } from "@mui/material/styles";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CircleIcon from "@mui/icons-material/Circle";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
  },
}));

type Props = {
  index: number,
  items: any[]
};

interface OpenItemState {
  [id: string]: boolean; // Maps item IDs to their expansion states
}
export const BasicMenu: React.FC<Props> = ({ index, items }) => {
  const [openItem, setOpenItem] = React.useState<OpenItemState>({1: false})

  // Initialize openItem state with all Tooltip IDs set to false
  // const [openItem, setOpenItem] = React.useState<OpenItemState>(
  //   items.reduce((acc, item) => {
  //     acc[item.id] = false;
  //     return acc;
  //   }, {})
  // );

  const handleOpen = (id: any) => {
    setOpenItem({ ...openItem, [id]: true });
  };

  const handleClose = (id: any) => {
    console.log(id);
    setOpenItem({ ...openItem, [id]: false });
    console.log(openItem);
  };

  return (
    <div>
      <Stack direction="column" spacing={2} sx={{ pl: 2 }}>
        {items.map((item: any, index: number) => (
          <HtmlTooltip
            open={openItem[item.id]}
            key={item.id}
            arrow
            // sx={{pl:"5px"}}
            placement="right-start"
            title={
              item.child.length > 0 && (
                <React.Fragment>
                  <nav aria-label="main mailbox folders">
                    <List>
                      {item.child.length !== 0 ? (
                        item.child.map((c: any) => (
                          <ListItem key={c.id} disablePadding>
                            <Link href={c.url}>
                              <ListItemButton
                                onClick={() => handleClose(item.id)}
                              >
                                <ListItemIcon>{c.icon}</ListItemIcon>
                                <ListItemText
                                  primaryTypographyProps={{
                                    fontSize: 15,
                                    fontWeight: "medium",
                                  }}
                                  primary={c.label}
                                />
                              </ListItemButton>
                            </Link>
                          </ListItem>
                        ))
                      ) : (
                        <></>
                      )}
                    </List>
                  </nav>
                </React.Fragment>
              )
            }
          >
            <Link href={item.url}>{item.icon}</Link>
          </HtmlTooltip>
        ))}
      </Stack>
    </div>
  );
};

