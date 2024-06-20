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
  fetchData: any;
}

const Form:React.FC<Props> = ({handleClose, fetchData}) => {
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const [active, setActive] = React.useState<boolean | null> (false);
  const [dataKabupaten, setDataKabupaten ] = React.useState<any[]>([])

  const handleActive = () => {
    console.log(active)
    setActive(!active)
  }

  const onSubmit = async (data:any) => {

    try{

      const postData = {
        route: data.selectedOption,
        kabupaten_id: data.selectedFilm.id,
        is_show: `${!active}`
      }

      console.log(postData);

      console.log(process.env.JM_MUDIK_BACKEND_URL)

      axios.post(`${process.env.JM_MUDIK_BACKEND_URL}/master/rute`, postData)
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

  const handleChange = (age:number) => {
    console.log(age);
  }

  const postKabupaten = async () => {
    
  }

  const fetchKabupaten = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/wilayah/kabupaten`)
      .then(async(response) => {
        const convertData:any =  (await response.data)
        console.log(convertData.data);
        setDataKabupaten(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  React.useEffect(() => {
    fetchKabupaten();
  },[])

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Controller
              name="selectedFilm"
              control={control}
              rules={{ required: 'Kota tujuan akhir is required' }} // Add validation rule for required field
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="combo-box-demo"
                  options={dataKabupaten}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, value) => setValue('selectedFilm', value)} // Update form value on selection
                  renderInput={(params) => (
                    <TextField {...params} label="Kota Tujuan Akhir" variant="outlined" error={Boolean(errors.selectedFilm)} />
                  )}
                />
              )}
            />
            {errors.selectedFilm && <span><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>Kota Tujuan Akhir required</Typography></span>} {/* Display error message */}
          </Grid>
        <Grid item xs={12}>
          <Controller
            name="selectedOption"
            control={control}
            defaultValue=""
            rules={{ required: 'Rute is required' }}
            render={({ field }) => (
              <FormControl fullWidth variant="outlined" error={Boolean(errors.selectedOption)}>
                <InputLabel id="select-label">Pilih Rute</InputLabel>
                <Select
                  {...field}
                  labelId="select-label"
                  label="Select Option"
                  onChange={(e) => setValue('selectedOption', e.target.value)}
                >
                  <MenuItem value="">Pilih...</MenuItem>
                  <MenuItem value="SELATAN">SELATAN</MenuItem>
                  <MenuItem value="UTARA">UTARA</MenuItem>
                </Select>
              </FormControl>
            )}
          />
          {errors.selectedOption && <span><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>Rute required</Typography></span>}
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
