
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { FC } from 'react';
import { Box, Container, IconButton, Toolbar, Typography } from '@mui/material';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CRightBarIconHeader from '../CLeftMenuItem/CRightBarIconHeader';
import Logo from '/wlogo.png'

interface Props {
    open?: boolean;
    drawerWidth?: number;
    handleDrawerOpen?: () => void;
    handleDrawerClose?: () => void;
}

interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const CHeader: FC<Props> = (props): JSX.Element => {

    const AppBar = styled(MuiAppBar, {
        shouldForwardProp: (prop) => prop !== 'open',
    })<AppBarProps>(({ theme, open }) => ({
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        ...(open && {
            marginLeft: props.drawerWidth,
            // width: `calc(100% - ${props.drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
            }),
        }),
    }));

    return (
        <>
            <AppBar position="fixed" open={props.open} elevation={4}>
                {/* <Container maxWidth="xl"> */}
                <Toolbar sx={{ backgroundColor: '#002D5F' }}>
                    <img width='200' height='70' src={Logo} /> &nbsp;&nbsp;&nbsp;
                    <Box sx={{ flexGrow: 1 }}>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={props.handleDrawerOpen}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(props.open && { display: 'none' }),
                                color: 'yellow'
                            }}
                        >
                            <ArrowForwardIosIcon />
                        </IconButton>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={props.handleDrawerClose}
                            edge="start"
                            sx={{
                                marginRight: 5,
                                ...(!props.open && { display: 'none' }),
                                color: 'yellow'
                            }}
                        >
                            <ArrowBackIosIcon />
                        </IconButton>
                    </Box>
                    {/* {props.open ? <ChevronRightIcon /> : <ChevronLeftIcon />} */}
                    <Box position='relative' justifyContent={"flex-start"}>
                        <CRightBarIconHeader />
                    </Box>
                </Toolbar>
                {/* </Container> */}
            </AppBar>
        </>
    )
}

export default CHeader