import * as React from 'react';

import { useForm, Controller, FormProvider } from 'react-hook-form';
import { TextField, Button, Grid } from '@mui/material';

import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
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
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel'
import FormHelperText from '@mui/material/FormHelperText'
import moment from 'moment'

let allFormData:any = { dataTiket: {}, dataParentKeluarga: {}, dataKeluarga: []}

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const steps = ['Tiket', 'Data Penumpang', 'Konfirmasi'];

function RegistrasiForm({ handleNext }: { handleNext: () => void }) {
  // const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  // const { control, handleSubmit, formState, errors setValue, getValues } = useForm();
  const methods = useForm(); // Using useForm to access form methods
  const { control, handleSubmit, formState: { errors }, setValue, getValues } = methods;
  const [active, setActive] = React.useState<boolean | null> (false);

  const [dataPic, setDataPic] = React.useState<any[]>([])
  const [dataRute, setDataRute ] = React.useState<any[]>([])
  const [dataChildRute, setDataChildRute] = React.useState<any[]>([])
  const [dataKecamatan, setDataKecamatan ] = React.useState<any[]>([])
  const [dataTanggal, setDataTanggal] = React.useState<any[]>([])

  const [valueJM, setJM ] = React.useState<string|null>("")
  const [kabId, setKabId] = React.useState<number | null>(null);
  const [ruteId, setRuteId] = React.useState<number | null>(null);
  const [picId, setPicId] = React.useState<number | null>(null);
  const [childRuteId, setChildRuteId] = React.useState<number | null>(null)
  const [noTiket, setNoTiket] = React.useState<string | null> (null)
  const [registerPlace, setRegisterPlace] = React.useState<string | null> (null)

  const [paymentMethod, setPaymentMethod] = React.useState('cash');

  const [formDataTiket, setFormDataTiket] = React.useState<any>({});

  const handlePaymentMethodChange = (event:any) => {
    setPaymentMethod(event.target.value);
  };

  const fetchPic = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/api/pic?mode=select`)
    .then(async(response) => {
      const convertData:any =  (await response.data)
      console.log('data pic')
      console.log(convertData.data);
      setValue('noTiket', convertData.data.no_ticket);
      setValue('tempatDaftar', `KANTOR ${convertData.data.kd_comp}`)
      setPicId(convertData.data.id);
      setDataPic(convertData.data);
      setNoTiket(convertData.data.no_ticket)
      setRegisterPlace(`KANTOR ${convertData.data.kd_comp}`)
    })
    .catch(error => {
      // Handle error
      console.error('Error:', error);
  });
  }

  const fetchRute = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/rute?route=${valueJM}`)
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
        setDataKecamatan(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  const fetchChildRute = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/child-rute?rute_id=${ruteId}`)
      .then(async(response) => {
        const convertData:any =  (await response.data)
        setDataChildRute(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  const fetchTanggalBerangkat = async () => {
    axios.get(`${process.env.JM_MUDIK_BACKEND_URL}/master/tanggal`)
      .then(async(response) => {
        const convertData:any =  (await response.data)
        setDataTanggal(convertData.data);
      })
      .catch(error => {
        // Handle error
        console.error('Error:', error);
      });
  }

  const saveFormDataTiket = () => {
    const formData = getValues();
    setFormDataTiket(formData);
  }


  React.useEffect(() => {
    fetchPic();
    fetchTanggalBerangkat();
    if(valueJM){
        console.log('ada nilai')
        fetchRute();
    }
    
    if(kabId) {
        fetchKecamantan();
    }

    if(ruteId) {
        fetchChildRute();
    }

  }, [formDataTiket, valueJM, kabId, ruteId])

  const handleActive = () => setActive(!active)

  const handleClose = () => {}

  const onSubmit = async (data:any) => {
    try {
        const postData = {
            "pic_id": picId,
            "master_rute_id": ruteId,
            "master_child_rute_id": childRuteId,
            "master_tanggal_mudik_id": 1,
            "registration_number": noTiket,
            "registration_place": registerPlace
        }

         // Call handleSubmit with a callback function to trigger form validation
        handleSubmit((formData) => {
          // Check if the form is valid
          if (Object.keys(errors).length === 0) {
            // If form is valid, call handleNext to move to the next step

            allFormData.dataTiket = postData;

            handleNext();
          }
        })(data);

    }catch(e){
        console.log(e)
    }
  }

  const handleAutocompleteChange = (event:any, value:any) => {
    console.log(value)
    if (value) {
        setKabId(value.kabupaten_id)
        setValue('selectedRute', value)
        setRuteId(value.id)
    } else {
        setKabId(null)
        setValue('selectedRute', null)
        setRuteId(null)
    }
  };
  
  const handleAutocompleteChildRute = (event:any, value:any) => {
    if (value) {
        setValue('selectedChildRute', value)
        setChildRuteId(value.id)
    } else {
        setValue('selectedChildRute', null)
        setChildRuteId(null)
    }
  };

  const selectChange = (e: any) => {
    console.log(e.target.value)
    setJM(e.target.value)
  }

  return (
    // <FormProvider {...methods}>
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
          <Stack direction="row" spacing={2}alignItems="center">
          <Typography sx={{ minWidth: 150 }}>No Tiket</Typography>
          <Controller
            name="noTiket"
            control={control}
            rules={{ required: 'Ticket number is required' }} // Add validation rule for required field
            render={({ field }) => (
                <TextField
                  {...field}
                  variant="outlined"
                  InputProps={{ readOnly: true }}
                  value={field.value} // Display KD Comp value
                  sx={{ mt: 1, width: '450px' }} // Add some margin to separate from the previous TextField
                  />
                )}
            />
            </Stack>
        </Grid>
          <Grid item xs={12}>
          <Stack direction="row" spacing={2}alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Tempat Pendaftaran</Typography>
          <Controller
            name="tempatDaftar"
            control={control}
            rules={{ required: 'Ticket number is required' }} // Add validation rule for required field
            render={({ field }) => (
                <TextField
                    {...field}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                    value={field.value} // Display KD Comp value
                    sx={{ mt: 1, width: '450px' }} // Add some margin to separate from the previous TextField
                />
            )}
          />
          </Stack>
          </Grid>
          <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ minWidth: 150 }}>Jalur Mudik</Typography>
            <Controller
              name="region"
              control={control}
              defaultValue=""
              rules={{ required: 'Jalur mudik is required' }}
              render={({ field }) => (
                <FormControl fullWidth error={Boolean(errors.region)}>
                  <InputLabel id="select-region-label">Jenis Mudik</InputLabel>
                  <Select
                    {...field}
                    labelId="select-region-label"
                    label="Jalur Mudik"
                    variant="outlined"
                    value={field.value}
                    fullWidth
                    onChange={(e) => {
                      field.onChange(e);
                      selectChange(e);
                    }}
                    sx={{ mt: 1, width: '450px' }}
                  >
                    <MenuItem value="">
                      <em>Pilih Jalur Mudik</em>
                    </MenuItem>
                    <MenuItem value="UTARA">Utara</MenuItem>
                    <MenuItem value="SELATAN">Selatan</MenuItem>
                  </Select>
                  {/* {errors.region && (
                    <FormHelperText>{errors.region.message}</FormHelperText>
                  )} */}
                  {/* {errors.region && <FormHelperText><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>{errors.region.message}</Typography></FormHelperText>}  */}
                  {errors.region?.message ? (<FormHelperText><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>{String(errors.region.message)}</Typography></FormHelperText>) : null } </FormControl>
              )}
            />
          </Stack>
        </Grid>
          <Grid item xs={12}>
          <Stack direction="row" spacing={2}alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Kota Tujuan Akhir</Typography>
          <FormControl fullWidth>
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
                    <TextField {...params} label="Kota Tujuan Akhir" variant="outlined" error={Boolean(errors.selectedRute)} sx={{ width: '450px' }} />
                  )}
                />
              )}
            />
          {errors.selectedRute?.message ? (<FormHelperText><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>{String(errors.selectedRute.message)}</Typography></FormHelperText>) : null } </FormControl>
           </Stack>
          </Grid>
          <Grid item xs={12}>
          <Stack direction="row" spacing={2}alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Kota Tujuan</Typography>
          <FormControl fullWidth>
          <Controller
              name="selectedChildRute"
              control={control}
              rules={{ required: 'Kota tujuan is required' }} // Add validation rule for required field
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  id="combo-box-demo"
                  options={dataChildRute}
                  getOptionLabel={(option) => option.kecamatan.name}
                  onChange={handleAutocompleteChildRute} // Update form value on selection
                  renderInput={(params) => (
                    <TextField sx={{ width: '450px' }} {...params} label="Kota Tujuan" variant="outlined" error={Boolean(errors.selectedChildRute)} />
                  )}
                />
              )}
            />
            {errors.selectedChildRute?.message ? (<FormHelperText><Typography variant="caption" display="block" sx={{color:"red"}} gutterBottom>{String(errors.selectedChildRute.message)}</Typography></FormHelperText>) : null }
          </FormControl>
          </Stack>
          </Grid>
          <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ minWidth: 150 }}>Tanggal Berangkat</Typography>
            <FormControl component="fieldset" error={Boolean(errors.tanggalBerangkat)}>
              <RadioGroup
                aria-label="tanggal-berangkat-method"
                name="tanggalBerangkat"
                value={paymentMethod}
                onChange={handlePaymentMethodChange}
              >
                {dataTanggal.map((e, index) => (
                  <FormControlLabel
                    key={e.id}
                    value={e.tanggal}
                    control={<Radio checked={index === 0} />}
                    label={moment(e.tanggal).format('YYYY-MM-DD')}
                  />
                ))}
              </RadioGroup>
              {errors.tanggalBerangkat && (
                <FormHelperText>Tanggal Berangkat required</FormHelperText>
              )}
            </FormControl>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Active</Typography>
            { !active ? (<CheckBoxRoundedIcon onClick={handleActive}/>) : (<CheckBoxOutlineBlankRoundedIcon onClick={handleActive}/>) }
          </Stack>
        </Grid>
        <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button type="submit" variant="contained" onClick={async(e) => {
            await onSubmit(e);
          }} color="primary">
            Next
          </Button>
          </Stack>
        </Grid>
      </Grid>
    </form>
    </div>
    // </FormProvider>
  );
}

function FamilyMemberForm({ index, onSubmit }: { index:number, onSubmit: (data: any) => void}) {
  const { control, handleSubmit, formState: { errors } } = useForm();
  const [active, setActive] = React.useState<boolean | null> (false);
  const [isSave, setIsSave ] = React.useState<boolean | null> (false);

  const handleActive = () => setActive(!active);

  const handleFormSubmit = (data: any) => {
    data.status = !active
    setIsSave(!isSave);
    onSubmit(data); // Pass the form data to the parent component
    // onPopUp(index);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
    <Grid container spacing={2} direction="row">
      <Grid item xs={12}>
      <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Nama Lengkap</Typography>
          <Controller
            name="namaLengkap"
            control={control}
            rules={{ required: 'Nama Lengkap is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nama Lengkap"
                variant="outlined"
                value={field.value}
                sx={{ mt: 1, width: '450px' }}
                error={Boolean(errors.namaLengkap)}
                helperText={errors.namaLengkap && errors.namaLengkap.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>No KTP</Typography>
          <Controller
            name="no_ktp"
            control={control}
            // rules={{ required: 'Nomor Ktp is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nomor Ktp"
                variant="outlined"
                value={field.value}
                sx={{ mt: 1, width: '450px' }}
                error={Boolean(errors.no_ktp)}
                // helperText={errors.no_ktp && errors.no_ktp.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Alamat</Typography>
          <Controller
            name="alamat"
            control={control}
            // rules={{ required: 'Alamat is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Alamat"
                variant="outlined"
                value={field.value}
                sx={{ mt: 1, width: '450px' }}
                error={Boolean(errors.alamat)}
                // helperText={errors.alamat && errors.alamat.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>No Handphone</Typography>
          <Controller
            name="no_hp"
            control={control}
            // rules={{ required: 'Nomor Handphone is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="No Handphone"
                variant="outlined"
                value={field.value}
                sx={{ mt: 1, width: '450px' }}
                error={Boolean(errors.no_hp)}
                // helperText={errors.no_hp && errors.no_hp.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Jenis Kelamin</Typography>
          <FormControl fullWidth>
            <InputLabel id="select-region-label" sx={{ minWidth: 150 }}>Jenis Kelamin</InputLabel>
          <Controller
            name="jk"
            control={control}
            rules={{ required: 'Jenis Kelamin is required' }}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                label="Jenis Kelamin"
                variant="outlined"
                value={field.value}
                sx={{ width: '450px' }}
                inputProps={{ id: 'select-jk' }}
                onChange={(e) => {
                  field.onChange(e);
                }}
                error={Boolean(errors.jk)}
              >
                <MenuItem value="">
                  <em>Pilih Jenis Kelamin</em>
                </MenuItem>
                <MenuItem value="Laki-Laki">Laki-Laki</MenuItem>
                <MenuItem value="Perempuan">Perempuan</MenuItem>
              </Select>
            )}
          />
          {errors.jk && (
            <span>
              <Typography variant="caption" display="block" sx={{ color: "red" }} gutterBottom>
                Jenis Kelamin is required
              </Typography>
            </span>
          )}
          </FormControl>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Active</Typography>{!active ? <CheckBoxRoundedIcon onClick={handleActive} /> : <CheckBoxOutlineBlankRoundedIcon onClick={handleActive} />}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          {!isSave ? (<Button type="submit" variant="contained" onClick={(data:any) => {
            console.log('data')
            console.log(data)
          }} color="primary">
            Save
          </Button>) : <Button type="button" sx={{backgroundColor: "#FF922B"}} variant="contained">Submitted</Button>}
        </Stack>
      </Grid>
      </Grid>
    </form>
  )
}

function DataPenumpangForm({ handleNext, handleBack }: { handleNext: () => void; handleBack: () => void }) {
  
const { control, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
const [active, setActive] = React.useState<boolean | null> (false);
const [countFam, setCountFam] = React.useState<number> (0);
const [currentFormIndex, setCurrentFormIndex] = React.useState(0);
const [formData, setFormData] = React.useState([]);
  
  const handleActive = () => setActive(!active)

  const onSubmit = async (data:any) => {
    try{
       // Call handleSubmit with a callback function to trigger form validation
       handleSubmit((formData) => {
        // Check if the form is valid
        if (Object.keys(errors).length === 0) {
          // If form is valid, call handleNext to move to the next step
          allFormData.dataParentKeluarga = data
          handleNext();
        }
      })(data);
    }catch(e){
      console.log(e)
    }
  }

  const handleFormSubmit = (data: any) => {
    const updatedFormData: FormData[] = [...formData, data]; // Add the submitted form data to the existing data
    setFormData(updatedFormData);
    if (updatedFormData.length === countFam) {
      console.log('All forms submitted:');
    }
    allFormData.dataKeluarga.push(data)
  };

  const FamilyMemberForms = () => {
    return Array.from({ length: countFam }, (_, index) => (
      <FamilyMemberForm
        index={index}
        onSubmit={handleFormSubmit} // Pass onSubmit function to the FamilyMemberForm component
        // onPopUp={() => removeFormAtIndex(index)}
      />
    ));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Grid container spacing={2}>
    <Stack direction="column" spacing={2} alignItems="center">
          <form onSubmit={handleSubmit(onSubmit)}>
    <Grid container spacing={2} justifyContent="center">
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Nama Lengkap</Typography>
          <Controller
            name="namaLengkap"
            control={control}
            rules={{ required: 'Nama Lengkap is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nama Lengkap"
                variant="outlined"
                value={field.value}
                sx={{ mt: 1, width: '450px' }}
                error={Boolean(errors.namaLengkap)}
                helperText={errors.namaLengkap && errors.namaLengkap.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>No KTP</Typography>
          <Controller
            name="no_ktp"
            control={control}
            rules={{ required: 'Nomor Ktp is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nomor Ktp"
                variant="outlined"
                value={field.value}
                sx={{ mt: 1, width: '450px' }}
                error={Boolean(errors.no_ktp)}
                helperText={errors.no_ktp && errors.no_ktp.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Alamat</Typography>
          <Controller
            name="alamat"
            control={control}
            rules={{ required: 'Alamat is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Alamat"
                variant="outlined"
                value={field.value}
                sx={{ mt: 1, width: '450px' }}
                error={Boolean(errors.alamat)}
                helperText={errors.alamat && errors.alamat.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>No Handphone</Typography>
          <Controller
            name="no_hp"
            control={control}
            rules={{ required: 'Nomor Handphone is required' }}
            render={({ field }) => (
              <TextField
                {...field}
                label="No Handphone"
                variant="outlined"
                value={field.value}
                sx={{
                  mt: 1,
                  width: { xs: '100%', sm: '450px' }, // Adjust according to your breakpoints
                }}
                error={Boolean(errors.no_hp)}
                helperText={errors.no_hp && errors.no_hp.message?.toString()}
              />
            )}
          />
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Jenis Kelamin</Typography>
          <FormControl fullWidth>
            <InputLabel id="select-region-label" sx={{ minWidth: 150 }}>Jenis Kelamin</InputLabel>
          <Controller
            name="jk"
            control={control}
            rules={{ required: 'Jenis Kelamin is required' }}
            defaultValue=""
            render={({ field }) => (
              <Select
                {...field}
                label="Jenis Kelamin"
                variant="outlined"
                value={field.value}
                sx={{ width: '450px' }}
                inputProps={{ id: 'select-jk' }}
                onChange={(e) => {
                  field.onChange(e);
                }}
                error={Boolean(errors.jk)}
              >
                <MenuItem value="">
                  <em>Pilih Jenis Kelamin</em>
                </MenuItem>
                <MenuItem value="Laki-Laki">Laki-Laki</MenuItem>
                <MenuItem value="Perempuan">Perempuan</MenuItem>
              </Select>
            )}
          />
          {errors.jk && (
            <span>
              <Typography variant="caption" display="block" sx={{ color: "red" }} gutterBottom>
                Jenis Kelamin is required
              </Typography>
            </span>
          )}
          </FormControl>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography sx={{ minWidth: 150 }}>Active</Typography>{!active ? <CheckBoxRoundedIcon onClick={handleActive} /> : <CheckBoxOutlineBlankRoundedIcon onClick={handleActive} />}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" spacing={2}>
          <Button type="button" variant="contained" onClick={handleBack} color="primary">
            Back
          </Button>
          <Button type="button" variant="contained" onClick={() => {
            if(countFam < 5 ){
              console.log(`jumlah form : ${countFam}`);
              setCountFam(countFam + 1)
            }
          }} color="primary">
            Tambah Keluarga
          </Button>
          <Button type="submit" variant="contained" onClick={()=>{
            console.log(allFormData);
          }} color="primary">
            Next
          </Button>
          </Stack>
        </Grid>
      </Grid>
        </form>
      {FamilyMemberForms()}
    </Stack>
    </Grid>
  </div>
  );
}

function KeluargaForm({ handleNext, handleBack }: { handleNext: () => void; handleBack: () => void }) {
  const [jumlahAnggota, setJumlahAnggota] = React.useState(0);

  const handleJumlahAnggotaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJumlahAnggota(parseInt(event.target.value, 10));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography>Keluarga Form</Typography>
      <TextField
        type="number"
        label="Jumlah Anggota Keluarga"
        value={jumlahAnggota}
        onChange={handleJumlahAnggotaChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <Button variant="contained" onClick={handleBack}>Back</Button>
      <Button variant="contained" onClick={handleNext}>Next</Button>
    </div>
  );
}

function KonfirmasiForm({ handleBack }: { handleBack: () => void }) {

  const handlerFinish = () => {

    // const jsonData = JSON.parse(JSON.stringify(allFormData));
    const visitedObjects:any = new WeakSet();

    const jsonData = JSON.stringify(allFormData, function (key, value) {
      if (typeof value === 'object' && value !== null) {
          if (visitedObjects.has(value)) {
              // Circular reference found, return a placeholder
              return '[Circular]';
          }
          // Store visited objects to detect circular references
          visitedObjects.add(value);
      }
      return value;
  });

  let convData = {
    dataTiket: allFormData.dataTiket,
    dataParentKeluarga: allFormData.dataParentKeluarga,
    dataKeluarga: allFormData.dataKeluarga
  }

    axios.post(`${process.env.JM_MUDIK_BACKEND_URL}/api/transaction/collection_insert`, { data : convData})
    .then(response => {
        console.log('Successful POST response:', response.data);
        allFormData.dataTiket = {}
        allFormData.dataParentKeluarga = {}
        allFormData.dataKeluarga = []
    })
    .catch(error => {
        console.error('Error:', error);
        // Handle errors (e.g., display error message)
    });
  }

  return (
    <div>
      <Typography>Konfirmasi Form</Typography>
      <Button variant="contained" onClick={() => {
        allFormData.dataKeluarga = []
        handleBack()
      }}>Back</Button>
      <Button type="submit" variant="contained" onClick={handlerFinish}>Finish1</Button>
    </div>
  );
}

export default function StepperForm() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  const renderForm = (step: number) => {
    switch (step) {
      case 0:
        return <RegistrasiForm handleNext={handleNext} />;
      case 1:
        return <DataPenumpangForm handleNext={handleNext} handleBack={handleBack} />;
      // case 2:
      //   return <KeluargaForm handleNext={handleNext} handleBack={handleBack} />;
      case 2:
        return <KonfirmasiForm handleBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%', display: "flex", flexDirection: "column", alignItems: 'center', marginTop: '20px', padding: '20px' }}>
    <Stepper activeStep={activeStep}>
        {steps.map((label, index) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps} sx={{ marginBottom: '10px' }}>
              <StepLabel {...labelProps} style={{ paddingLeft: '50px', paddingRight: '50px' }}>
                {label}
              </StepLabel>
          </Step>
          );
        })}
    </Stepper>
      <div>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>Step {activeStep + 1}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              {/* <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button> */}
              <Box sx={{ flex: '1 1 auto' }} />
              {renderForm(activeStep)}
            </Box>
          </React.Fragment>
        )}
      </div>
    </Box>
  );
}
