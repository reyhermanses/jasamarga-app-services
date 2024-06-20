'use client'

import * as React from 'react';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import CircleIcon from '@mui/icons-material/Circle';
import ListMenu from '../ListMenu';
import { BasicMenu } from '../ButtonMenu';
import ButtonAppBar from './HeaderBar';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PixOutlinedIcon from '@mui/icons-material/PixOutlined';
import { Typography } from '@mui/material';
import ContactsOutlinedIcon from '@mui/icons-material/ContactsOutlined';
import MapIcon from '@mui/icons-material/Map';
import MenuOpenRoundedIcon from '@mui/icons-material/MenuOpenRounded';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import RouteIcon from '@mui/icons-material/Route';
import DateRangeOutlinedIcon from '@mui/icons-material/DateRangeOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import AdUnitsOutlinedIcon from '@mui/icons-material/AdUnitsOutlined';
import HailOutlinedIcon from '@mui/icons-material/HailOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import DirectionsBusFilledOutlinedIcon from '@mui/icons-material/DirectionsBusFilledOutlined';
import GradingOutlinedIcon from '@mui/icons-material/GradingOutlined';
import OtherHousesOutlinedIcon from '@mui/icons-material/OtherHousesOutlined';


const drawerWidth = 250;

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

const DrawerHeader: any = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
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

type Props = {
  children: any;
}

export const AppLayout: React.FC<Props> = ({ children }) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const dashboard = [
    {
      id: 1,
      label: <Typography style={{ color: "#171A1C", fontSize: "15px" }} >Home</Typography>,
      url: "/home",
      icon: <OtherHousesOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: []
    },
  ]


  const master = [
    {
      id: 2,
      label: <Typography style={{ color: "#171A1C", fontSize: "15px" }} >Wilayah</Typography>,
      url: "#",
      icon: <MapIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: [
        {
          id: 3,
          label: <Typography style={{ color: "#9FA6AD", fontSize: "14px" }} >Provinsi</Typography>,
          url: "/admin/master/wilayah/provinsi",
          icon: <CircleIcon sx={{ width: 10, height: 10 }} />,
          child: []
        },
        {
          id: 4,
          label: <Typography style={{ color: "#9FA6AD", fontSize: "14px" }} >Kabupaten</Typography>,
          url: "/admin/master/wilayah/kabupaten",
          icon: <CircleIcon sx={{ width: 10, height: 10 }} />,
          child: []
        },
        {
          id: 5,
          label: <Typography style={{ color: "#9FA6AD", fontSize: "14px" }} >Kecamatan</Typography>,
          url: "/admin/master/wilayah/kecamatan",
          icon: <CircleIcon sx={{ width: 10, height: 10 }} />,
          child: []
        },
      ]
    },
    {
      id: 6,
      label: <Typography style={{ color: "#171A1C", fontSize: "15px" }} >Tanggal Mudik</Typography>,
      url: "/admin/master/tanggal-mudik",
      icon: <DateRangeOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: []
    },
    {
      id: 7,
      label: <Typography style={{ color: "#171A1C", fontSize: "15px" }} >Rute</Typography>,
      url: "#",
      icon: <RouteIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: [
        {
          id: 8,
          label: <Typography style={{ color: "#9FA6AD", fontSize: "14px" }} >Kota Tujuan Akhir</Typography>,
          url: "/admin/master/rute/kota-tujuan",
          icon: <CircleIcon sx={{ width: 10, height: 10 }} />,
          child: []
        },
        {
          id: 9,
          label: <Typography style={{ color: "#9FA6AD", fontSize: "14px" }} >Kota Tujuan</Typography>,
          url: "/admin/master/rute/kecamatan-tujuan",
          icon: <CircleIcon sx={{ width: 10, height: 10 }} />,
          child: []
        },
      ]
    },
    {
      id: 10,
      label: <Typography style={{ color: "#171A1C", fontSize: "15px" }} >Company</Typography>,
      url: "/admin/master/company",
      icon: <BusinessOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: []
    },
    // {
    //   id: 11,
    //   label: <Typography style={{ color: "#171A1C", fontSize: "15px" }} >Unit Kerja</Typography>,
    //   url: "/contact",
    //   icon: <AdUnitsOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
    //   child: []
    // },
  ]

  const feature = [
    {
      id: 11,
      label: (
        <Typography style={{ color: "#171A1C", fontSize: "15px" }}>
          Pic
        </Typography>
      ),
      url: "/admin/pic",
      icon: <HailOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: [],
    },
    {
      id: 12,
      label: (
        <Typography style={{ color: "#171A1C", fontSize: "14px" }}>
          Registrasi
        </Typography>
      ),
      url: "/admin/registrasi",
      icon: <AppRegistrationOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: [],
    },
    {
      id: 13,
      label: (
        <Typography style={{ color: "#171A1C", fontSize: "14px" }}>
          Bus
        </Typography>
      ),
      url: "/admin/bus",
      icon: <DirectionsBusFilledOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: [],
    },
    {
      id: 14,
      label: (
        <Typography style={{ color: "#171A1C", fontSize: "14px" }}>
          Check In
        </Typography>
      ),
      url: "/admin/checkin",
      icon: <GradingOutlinedIcon style={{ color: "#636B74", fontSize: "25px" }} />,
      child: [],
    },
  ];

  const [allResults, setAllResults] = React.useState<any[]>([]);

  React.useEffect(() => {
    // const allResults = [...items, ...items2];
    setAllResults([...dashboard, ...master, ...feature]);
  }, [])


  const StyledScrollBox = styled(Box)(({ theme }) => ({
    overflowY: 'auto', // Enable vertical scrolling
    maxHeight: '100vh', // Adjust as needed for content height
    // padding: theme.spacing(2), // Add some padding for aesthetics
    border: `1px ${theme.palette.divider}`, // Optional border styling
    '&.custom-scrollbar': {
      /* Inherit scrollbar styles from the custom CSS class */
    },
  }));

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        style={{ backgroundColor: "#364FC7" }}
        elevation={0}
        open={open}
      >
        <Toolbar>
          <IconButton
            // color="#212121"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuRoundedIcon style={{ color: "F8F9FA" }} />
          </IconButton>
          <IconButton
            // color="#212121"
            aria-label="close drawer"
            onClick={handleDrawerClose}
            edge="start"
            sx={{
              marginRight: 5,
              ...(!open && { display: "none" }),
            }}
          >
            <MenuOpenRoundedIcon style={{ color: "F8F9FA" }}  />
          </IconButton>
          <Typography variant="h6" width="100%" noWrap component="div">
            <ButtonAppBar />
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
        </DrawerHeader>
        {/* <Divider /> */}
        <StyledScrollBox className="custom-scrollbar">
          {!open ? (
            <div>
              <BasicMenu index={1} items={allResults} />
              {/* <BasicMenu index={1} items={allResults} />
              <BasicMenu index={1} items={allResults} /> */}
            </div>
          ) : (
            <div>
              <ListMenu
                items={dashboard}
                headerTitle={"Dashboard"}
                openParams={open}
              />
              <ListMenu
                items={master}
                headerTitle={"Master"}
                openParams={open}
              />
              <ListMenu
                items={feature}
                headerTitle={"Features"}
                openParams={open}
              />
              {/* <ListMenu
                items={items2}
                headerTitle={"Master Kompelka"}
                openParams={open}
              /> */}
            </div>
          )}
        </StyledScrollBox>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 5,
          backgroundColor: "#EEF2F6",
          minHeight: "100vh",
        }}
      >
        <DrawerHeader />
        {/* Child element 1 */}
        {children}
      </Box>
    </Box>
  );
}