/* eslint-disable camelcase */
// @mui
import { Container, Grid, Typography, Card, Box, TextField } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
// import css 
import '../../hidescrollbar.css';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

// sections
import {
  AppWelcome,
  AppFeatured,
  AppAreaInstalled,
  HeatMapComponent,
  PercentageData,
  BinaryData
} from '../../sections/@dashboard/general/app';

// ----------------------------------------------------------------------

export default function GeneralApp() {

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.6.0.56:8080/api/devices/', {withCredentials: true});
        setDevices(response.data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const [data, setData] = useState([]);
  const { user } = useAuth();
  const { themeStretch } = useSettings();
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');


  useEffect(() => {
    if(selectedDevice !== '' && selectedDevice !== ' '){
      const fetchData = async () => {
        try{
          const formData = new FormData();
          formData.append('device_id', selectedDevice);
          const response = await axios.post('http://10.6.0.56:8080/api/sensorData/', formData, {withCredentials: true})
            setData(response.data);
            return response.data;
        } catch (err) {
          console.log(err);
        }
      }
      const interval = setInterval(fetchData, 4000);
      return () => {
        clearInterval(interval);
      };
    }
    setData([]);
  }, [selectedDevice]);

  return (
    <div >
      <Page title="General: App">
        <Container maxWidth={themeStretch ? false : 'xl'}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <AppWelcome displayName={user?.displayName} />
            </Grid>
            <Grid item xs={12} md={4}>
              <AppFeatured />
            </Grid>
            <Grid item xs={12} md={3}>
              <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">Choose Device</Typography>
                  <TextField
                    select
                    fullWidth
                    SelectProps={{ native: true }}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    sx={{
                      paddingTop: 2,
                      '& fieldset': { border: '0 !important' },
                      '& select': {
                        pl: 1,
                        py: 0.5,
                        pr: '24px !important',
                        typography: 'subtitle1',
                      },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 0.75,
                        bgcolor: 'background.neutral',
                      },
                      '& .MuiNativeSelect-icon': {
                        top: 4,
                        right: 0,
                        width: 20,
                        height: 20,
                      },
                    }}
                  >
                    <option  value=" " key="Choose A Device">{}</option>
                    {devices.map((option) => (
                    <option   key={option.device_id} value={option.device_id}>
                      {option.device_id}
                    </option> 
                  ))}
                  </TextField>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={3} >
              <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">Device ID</Typography>
                  <Typography variant="h5">{
                    selectedDevice === '' || selectedDevice === ' ' ? '---' : devices.filter((option) => option.device_id === selectedDevice)[0]?.device_id
                  }</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} >
              <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">Device Name</Typography>
                  <Typography variant="h5">{
                    selectedDevice ==='' || selectedDevice === ' ' ? '---':devices.filter((option) => option.device_id === selectedDevice)[0]?.device_name
                  }</Typography>
                </Box>
              </Card>
            </Grid>
            <Grid item xs={12} md={3} >
            <Card sx={{ display: 'flex', alignItems: 'center', p: 3, height: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle2">Number of Sensors</Typography>
                  <Typography variant="h5">{
                    data.length ===0 || selectedDevice ==='' || selectedDevice === ' ' ? '---':(data.filter((option) => option.device_id === selectedDevice))?.length
                  }</Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} lg={4}>
              <PercentageData allData={data.filter((item) => item.device_id === selectedDevice && item.value_type === 'Percentage')}/>
            </Grid>

            <Grid item xs={12} md={6} lg={8}>
              <AppAreaInstalled allData = {data.filter((item) => item.device_id === selectedDevice && item.value_type === 'Numerical')}/>
            </Grid>
            <Grid item xs={12} md={6} lg={7}>
              <HeatMapComponent allData = {data.filter((item) => item.device_id === selectedDevice && item.value_type === 'Matrix')}/>
            </Grid>

            <Grid item xs={12} md={6} lg={5}>
              <BinaryData allData = {data.filter((item) => item.device_id === selectedDevice && item.value_type === 'Numerical' )}/>
            </Grid>
          </Grid>
        </Container>
      </Page>
    </div>
  );
}
