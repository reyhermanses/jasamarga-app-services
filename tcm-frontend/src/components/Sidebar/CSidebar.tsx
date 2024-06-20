import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import CHeader from '../Header/CHeader';
import { Link, Outlet } from 'react-router-dom';
import { Container, Grid, MenuItem, MenuList, Paper } from '@mui/material';
import { ArticleOutlined, Cloud, ContentCopy, ContentCut, ContentPaste, Home, Settings, SummarizeOutlined } from '@mui/icons-material';
import CLeftMenuItem from '../CLeftMenuItem/CLeftMenuItem';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CircleIcon from '@mui/icons-material/Circle';

const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});

const DrawerHeader = styled('div')(({ theme }) => ({
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

export function CSidebar() {
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const menuItems = [
        {
            title: "Laporan Lalin",
            icon: <AssessmentIcon />,
            url: "",
            subItems: [
                {
                    title: "Per Jam",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
                {
                    title: "Per Shift",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
                {
                    title: "Per Hari",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
                {
                    title: "Per Minggu",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
                {
                    title: "Per Bulan",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
            ]
        },
        {
            title: "Laporan AT",
            icon: <AssessmentIcon />,   
            url: "",
            subItems: [
                {
                    title: "AT1",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
                {
                    title: "AT2",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
                {
                    title: "AT3",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "",
                },
            ]
        },
        {
            title: "Settings",
            icon: <Settings />,
            url: "",
            subItems: [
                {
                    title: "Master Role",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "/role-master",
                },
                {
                    title: "Role Management User",
                    icon: <CircleIcon sx={{fontSize:10}} />,
                    url: "/role-management-user",
                },
            ]
        }
    ];

    return (
        <>
            <CHeader open={open} drawerWidth={drawerWidth} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Drawer variant="permanent" open={open}>
                    <DrawerHeader sx={{ backgroundColor: '#002D5F' }}>
                        {/* Mini variant drawer */}
                    </DrawerHeader>
                    <Divider />
                    <Box sx={{ padding: .5 }}>
                        <CLeftMenuItem isCollapse={open} menuItems={menuItems} />
                        {/* <MenuList sx={{ display: 'block' }}>
                            <MenuItem sx={MenuHover}>
                                <ListItemIcon>
                                    <Home fontSize="small" />
                                </ListItemIcon>
                                <Link to='/' style={{ textDecoration: 'none' }}>
                                    <ListItemText sx={{ opacity: open ? 1 : 0 }} >Home</ListItemText>
                                </Link>
                            </MenuItem>
                            <MenuItem sx={MenuHover}>
                                <ListItemIcon>
                                    <ArticleOutlined fontSize="small" />
                                </ListItemIcon>
                                <Link to='/laporan-pendapatan-lalin' style={{ textDecoration: 'none' }}>
                                    <ListItemText sx={{ opacity: open ? 1 : 0 }} >Laporan Pendapatan Lalin</ListItemText>
                                </Link>
                            </MenuItem>
                            <MenuItem sx={MenuHover}>
                                <ListItemIcon>
                                    <SummarizeOutlined fontSize="small" />
                                </ListItemIcon>
                                <Link to='/report-data' style={{ textDecoration: 'none' }}>
                                    <ListItemText sx={{ opacity: open ? 1 : 0 }} >Report Data</ListItemText>
                                </Link>
                            </MenuItem>
                            <Divider />
                            <MenuItem sx={MenuHover}>
                                <ListItemIcon>
                                    <Settings fontSize="small" />
                                </ListItemIcon>
                                <ListItemText sx={{ opacity: open ? 1 : 0 }} >Pengaturan</ListItemText>
                            </MenuItem>
                        </MenuList> */}
                    </Box>
                    {/* </Paper> */}
                </Drawer >
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                    <DrawerHeader />
                    <Container sx={{ backgroundColor: '#f5f5f5', borderRadius: 1, paddingLeft: 5, paddingTop: 2.5, paddingBottom: 2.5 }} maxWidth='xl'>
                        <Outlet />
                    </Container>
                </Box>
            </Box >
        </>
    );
}
