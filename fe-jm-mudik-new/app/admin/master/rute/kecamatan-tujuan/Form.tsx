import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Grid } from '@mui/material';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import CheckBoxRoundedIcon from '@mui/icons-material/CheckBoxRounded';
import CheckBoxOutlineBlankRoundedIcon from '@mui/icons-material/CheckBoxOutlineBlankRounded';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

type Props = {
  handleClose: () => void;
  handleSubmit?: any;
  buttonCancel?: any;
  buttonSubmit?: any;
  fetchData?: any;
}

const Form:React.FC<Props> = ({handleClose, fetchData}) => {
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const [active, setActive] = React.useState<boolean | null> (false);
  const [dataRute, setDataRute ] = React.useState<any[]>([])
  const [dataKecamatan, setDataKecamatan ] = React.useState<any[]>([])
  const [kabId, setKabId] = React.useState<number | null>(null);

  const handleActive = () => {
    console.log(active)
    setActive(!active)
  }

  const onSubmit = async (data:any) => {

    try{

      const postData = {
        "rute_id": data.selectedRute.id,
        "kecamatan_id": data.selectedKec.id,
        "is_show": `${!active}`
      }

      axios.post(`${process.env.JM_MUDIK_BACKEND_URL}/master/child-rute`, postData)
      .then(response => {
          console.log('Successful POST response:', response.data);
          // Handle successful response (e.g., display success message)
          fetchData();
          handleClose();
      })
      .catch(error => {
          console.error('Error:', error);
          // Handle errors (e.g., display error message)
      });

    }catch(e){
      console.log(e)
    }
  };

  const fetchRute = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/rute`)
      .then(async(response) => {
        const convertData:any =  (await response.data)
        setDataRute(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  const fetchKecamantan = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/wilayah/kecamatan?kabupaten_id=${kabId}`)
      .then(async(response) => {
        const convertData:any =  (await response.data)
        console.log('data kec')
        console.log(convertData.data);
        setDataKecamatan(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  React.useEffect(() => {
    fetchRute();
    if(kabId) {
      fetchKecamantan();
    }
  },[kabId])

  const handleAutocompleteChange = (event:any, value:any) => {
    if (value) {
      setValue('selectedRute', value)
      setKabId(value.kabupaten_id)
      // setValue(value.id); // Assuming 'id' is the property holding the ID of the selected rute
    } else {
      setValue('selectedRute', null)
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Controller
              name="selectedRute"
              control={control}
              rules={{ required: 'Kota tujuan akhir is required' }} // Add validation rule for required field
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="combo-box-demo"
                  options={dataRute}
                  getOptionLabel={(option) => option.kabupaten.name}
                  // onChange={(event, value) => setValue('selectedRute', value) } // Update form value on selection
                  onChange={handleAutocompleteChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Kota Tujuan Akhir" variant="outlined" error={Boolean(errors.selectedRute)} />
                  )}
                />
              )}
            />
            {errors.selectedRute && <span><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>Kota Tujuan Akhir required</Typography></span>} {/* Display error message */}
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="selectedKec"
              control={control}
              rules={{ required: 'Kota tujuan is required' }} // Add validation rule for required field
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="combo-box-demo"
                  options={dataKecamatan}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => setValue('selectedKec', value)} // Update form value on selection
                  renderInput={(params) => (
                    <TextField {...params} label="Kota Tujuan" variant="outlined" error={Boolean(errors.selectedKec)} />
                  )}
                />
              )}
            />
            {errors.selectedKec && <span><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>Kota tujuan required</Typography></span>} {/* Display error message */}
          </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2}>
            { !active ? (<CheckBoxRoundedIcon onClick={handleActive}/>) : (<CheckBoxOutlineBlankRoundedIcon onClick={handleActive}/>) }
            { !active ? "Aktif" : "Tidak Aktif" }
          </Stack>
        </Grid>
        <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
        <Button type="reset" variant="contained" onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
    </div>
  );
};

export default Form;
