import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material';
import Link from "next/link";
import React from 'react'

type Props = {
  items: any,
  headerTitle: string,
  openParams: boolean
}

interface OpenItemState {
  [id: string]: boolean; // Maps item IDs to their expansion states
}

const ListMenu: React.FC<Props> = ({ items, headerTitle, openParams }) => {
  const [open, setOpen] = React.useState(true);
  const [openItem, setOpenItem] = React.useState<OpenItemState>({ 1: true });

  const handleClick = (id: any) => {
    setOpen(openParams);
    setOpenItem({ ...openItem, [id]: !openItem[id] });
  };

  return (
    <List
      sx={{ width: "100%", maxWidth: 340, bgcolor: "background.paper" }}

      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader
          sx={{ opacity: open ? 1 : 0, color: "#212529", fontWeight: "bold" }}
          component="div"
          id="nested-list-subheader"
        >
          {headerTitle}
        </ListSubheader>
      }
    >
      {items.map((d: any, index: number) => (
        <div key={d.id}>
          {d.child.length > 0 ? (
            <div key={d.id}>
              <ListItemButton onClick={() => handleClick(d.id)}>
                <ListItemIcon>{d.icon}</ListItemIcon>
                <ListItemText
                  primary={d.label}
                  sx={{ opacity: open ? 1 : 0 }}
                />
                {openItem[d.id] ? (
                  <ExpandLess
                    sx={{
                      opacity: open ? 1 : 0,
                      width: "18px",
                      height: "18px",
                    }}
                  />
                ) : (
                  <ExpandMore sx={{ width: "18px", height: "18px" }} />
                )}
              </ListItemButton>
              {d.child.map((c: any, c_index: number) => (
                <Collapse
                  key={c.id}
                  sx={{ opacity: open ? 1 : 0, minWidth: "3px" }}
                  in={openItem[d.id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    <ListItemButton sx={{ pl: 5 }}>
                      <ListItemIcon>{c.icon}</ListItemIcon>
                      <Link href={c.url}>
                        <ListItemText primary={c.label} />
                      </Link>
                    </ListItemButton>
                  </List>
                </Collapse>
              ))}
            </div>
          ) : (
            <ListItemButton key={d.id}>
              <ListItemIcon>{d.icon}</ListItemIcon>
              <Link href={d.url}>
                <ListItemText
                  primary={d.label}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </Link>
            </ListItemButton>
          )}
        </div>
      ))}
    </List>
  );
};

export default ListMenu