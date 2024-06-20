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
  fetchData: () => void;
}

const Form:React.FC<Props> = ({handleClose, fetchData}) => {
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const [active, setActive] = React.useState<boolean | null> (false);
  //company
  const [dataCompany, setDataCompany ] = React.useState<any[]>([]);
  const [ companyName, setCompanyName ] = React.useState<string | null> ("");

  const handleActive = () => {
    setActive(!active)
  }

  const onSubmit = async (data:any) => {

    try{

      const postData = {
        "company_name" : data.selectedCompany.name,
        "kd_comp": data.selectedCompany.kd_comp,
        "muatan" : data.quota,
        "priority" : data.level,
        "is_show": `${!active}`
      }

      axios.post(`${process.env.JM_MUDIK_BACKEND_URL}/api/pic`, postData)
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

  const fetchCompany = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/company`)
      .then(async(response) => {
        const convertData:any =  (await response.data)
        setDataCompany(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
  }

  React.useEffect(() => {
    fetchCompany();
  },[])

  const handleAutocompleteChange = (event:any, value:any) => {
    if (value) {
      setValue('selectedCompany', value)
      setValue("kdComp", value ? value.kd_comp : "");
      // setValue(value.id); // Assuming 'id' is the property holding the ID of the selected rute
    } else {
      setValue('selectedCompany', null)
    }
  };

  return (
    <div>
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Controller
              name="selectedCompany"
              control={control}
              // defaultValue={{ name: '', kdComp: '' }}
              rules={{ required: 'Company Name is required' }} // Add validation rule for required field
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="combo-box-demo"
                  options={dataCompany}
                  getOptionLabel={(option) => option.name}
                  // onChange={(event, value) => setValue('selectedCompany', value) } // Update form value on selection
                  onChange={handleAutocompleteChange}
                  renderInput={(params) => (
                    <TextField {...params} label="Company Name" variant="outlined" error={Boolean(errors.selectedCompany)} />
                  )}
                />
              )}
            />
            {errors.selectedCompany && <span><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>Company Name is required</Typography></span>} {/* Display error message */}
          </Grid>
          <Grid item xs={12}>
          <Controller
            name="kdComp"
            control={control}
            rules={{ required: 'KD Comp is required' }} // Add validation rule for required field
            render={({ field }) => (

                <TextField
                    {...field}
                    variant="outlined"
                    value={field.value} // Display KD Comp value
                    InputProps={{
                      readOnly: true, // Make the TextField read-only
                    }}
                    sx={{ mt: 1 }} // Add some margin to separate from the previous TextField
                />
            )}
          />
          {errors.kdComp && (
            <span>
              <Typography variant="caption" display="block" sx={{ color: "red" }} gutterBottom>
                KD Comp is required {/* Display error message */}
              </Typography>
            </span>
          )}
        </Grid>
          <Grid item xs={12}>
          <Controller
            name="quota"
            control={control}
            rules={{ required: 'Quota is required' }} // Add validation rule for required field
            render={({ field }) => (

                <TextField
                    {...field}
                    label="Quota"
                    variant="outlined"
                    value={field.value} // Display KD Comp value
                    sx={{ mt: 1 }} // Add some margin to separate from the previous TextField
                />
            )}
          />
          {errors.quota && (
            <span>
              <Typography variant="caption" display="block" sx={{ color: "red" }} gutterBottom>
                Quota is required {/* Display error message */}
              </Typography>
            </span>
          )}
        </Grid>
          <Grid item xs={12}>
          <Controller
            name="level"
            control={control}
            rules={{ required: 'Level is required' }} // Add validation rule for required field
            render={({ field }) => (

                <TextField
                    {...field}
                    label="Level"
                    variant="outlined"
                    value={field.value} // Display KD Comp value
                    sx={{ mt: 1 }} // Add some margin to separate from the previous TextField
                />
            )}
          />
          {errors.level && (
            <span>
              <Typography variant="caption" display="block" sx={{ color: "red" }} gutterBottom>
                Level is required {/* Display error message */}
              </Typography>
            </span>
          )}
        </Grid>
        <Grid item xs={12}>
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}> {/* Added mt: 2 for vertical space */}
          {/* Active section */}
          <Stack direction="row" spacing={2}>
            { !active ? (
              <CheckBoxRoundedIcon onClick={handleActive} />
            ) : (
              <CheckBoxOutlineBlankRoundedIcon onClick={handleActive} />
            ) }
            { !active ? "Aktif" : "Tidak Aktif" }
          </Stack>
          </Box>
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
