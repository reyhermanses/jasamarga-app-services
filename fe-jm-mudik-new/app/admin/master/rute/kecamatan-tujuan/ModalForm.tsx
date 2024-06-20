import * as React from 'react';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Backdrop from "@mui/material/Backdrop";
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Form from './Form'

import moment from "moment"

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

type Props = {
  fetchData: any;
}

const ModalForm:React.FC<Props> = ({fetchData}) => {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState<boolean | null> (false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null); // Initialize state for selected date
  const [validate, setValidate] = React.useState<boolean | null> (true);
  
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false)
    setActive(null)
    setSelectedDate(null)
    setValidate(true)
  };

  const handleDateChange = (date: Date | null) => {
    const d_date = moment(date).format('YYYY-MM-DD')
    console.log(d_date)
    setSelectedDate(date);
  };

  const handleActive = () => {
    console.log(active)
    setActive(!active)
  }

  const onSubmit = () => {
    if(!selectedDate) 
    setValidate(false)
    return
  }

  const handleBackdropClick = (event:any) => {
    if (event.target !== event.currentTarget) {
      setOpen(false); // Close modal when clicking outside
    }
  };

  return (
    <div>
      <Button style={{ backgroundColor: "#20C997", color: "#fff" }} onClick={handleOpen}>Buat baru</Button>
      <Modal
        keepMounted
        open={open}
        onClose={handleClose}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
        BackdropComponent={Backdrop}
        BackdropProps={{ onClick: handleBackdropClick }} // Handle outside clicks
      >
        <Box sx={style}>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Form Kota Tujuan
        </DialogTitle>
        <DialogContent dividers>
        <Form fetchData={fetchData} handleClose={handleClose}/>
        </DialogContent>
            {/* <DialogActions>
            <Button autoFocus onClick={handleClose}>
                Batal
            </Button>
            <Button autoFocus onClick={onSubmit}>
                Simpan
            </Button>
            </DialogActions> */}
        </Box>
      </Modal>
    </div>
  );
}


export default ModalForm