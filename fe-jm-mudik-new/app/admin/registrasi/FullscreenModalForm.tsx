import * as React from 'react';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import StepperForm from './StepperForm'
import { Box, Stack, Container } from '@mui/material';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// type Props = {
//     passingSetOpen : boolean;
// }

const FullscreenModalForm = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('lg'));
  const [open, setOpen] = React.useState(false);

  const FormDataContext = React.createContext<any>({});

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button style={{ backgroundColor: "#20C997", color: "#fff" }} onClick={handleClickOpen}>
        Create
      </Button>
      <Dialog
        // fullScreen={fullScreen}
        fullScreen
        open={open}
        onClose={handleClose}
        // TransitionComponent={Transition}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: "#364FC7" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
          <Stack direction="column" spacing={2} alignItems="center" style={{display: 'flex'}}> {/* Center vertically and stack elements */}
            <Box  sx={{
             padding: '20px',
             width: ['100%', '80%'],
             // width: '300px',
             // height: '200px',
             // backgroundColor: 'lightblue',
             display: 'flex',
             alignItems: 'center',
             justifyContent: 'center',
             borderRadius: 5,
             boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)', 
            }}>
              <StepperForm />
            </Box>
          </Stack>
      </Dialog>
    </React.Fragment>
  );
}

export default FullscreenModalForm;