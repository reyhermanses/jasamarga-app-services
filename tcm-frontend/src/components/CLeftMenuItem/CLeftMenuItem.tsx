import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import { Home } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';

interface Props {
  isCollapse: boolean,
  menuItems: any
}

const NestedList: React.FC<Props> = ({ isCollapse, menuItems }) => {
  // const [open, setOpen] = React.useState(true);

  // const handleClick = () => {
  //   setOpen(!open);
  // };

  const [open, setOpen] = React.useState<{ [key: number]: boolean }>({});

  const handleClick = (index: number) => {
    setOpen((prevOpen: any) => ({
      ...prevOpen,
      [index]: !prevOpen[index]
    }));
  };


  const MenuHover: Object = [
    {
      backgroundColor: 'white',
      borderRadius: 2.5,
    },
    {
      '&:hover': {
        color: 'white',
        backgroundColor: 'white',
      },
    },
    `foo` && {
      '&:hover': { backgroundColor: 'red' },
    },
    `bar` && {
      '&:hover': { backgroundColor: '#bbdefb' },
    },
  ]

  return (
    <List
      sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    // subheader={
    //   <ListSubheader component="div" id="nested-list-subheader">
    //     Nested List Items
    //   </ListSubheader>
    // }
    >
      <ListItemButton sx={MenuHover}>
        <ListItemIcon>
          <Home />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>
      {menuItems.map((item: any, index: number) => (
        <div key={index}>
          <ListItemButton sx={MenuHover} onClick={() => handleClick(index)}>
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.title} />
            {open[index] ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          {isCollapse ? <Collapse in={open[index]} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.subItems.map((subItem: any, subIndex: number) => (
                <Box sx={{ pl: 4 }}>
                  <ListItemButton sx={MenuHover} key={subIndex}>
                    <ListItemIcon>
                      {subItem.icon}
                    </ListItemIcon>
                    <Link to={subItem.url} style={{ textDecoration: 'none' }}>
                      <ListItemText primary={subItem.title} />
                    </Link>
                  </ListItemButton>
                </Box>
              ))}
            </List>
          </Collapse> : null}
        </div>
      ))}
      {/* <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {isCollapse ? <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Master Role" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Master Role Management" />
          </ListItemButton>
        </List>
      </Collapse> : null}
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Laporan AT" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {isCollapse ? <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Master Role" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Master Role Management" />
          </ListItemButton>
        </List>
      </Collapse> : null}
      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {isCollapse ? <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Master Role" />
          </ListItemButton>
        </List>
        <List component="div" disablePadding>
          <ListItemButton sx={{ pl: 4 }}>
            <ListItemIcon>
              <StarBorder />
            </ListItemIcon>
            <ListItemText primary="Master Role Management" />
          </ListItemButton>
        </List>
      </Collapse> : null} */}
    </List>
  );
}


export default NestedList