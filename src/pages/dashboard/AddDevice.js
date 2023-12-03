//
import { useState, useEffect, useDispatch } from 'react';
// @mui
import { Card, Button, Container, DialogTitle, Box, Grid, TextField, FormControl, InputLabel, Select, Stack, MenuItem, Typography } from '@mui/material';
import axios from 'axios';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import Iconify from '../../components/Iconify';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';



// ----------------------------------------------------------------------


export default function AddDevice() {
  const { themeStretch } = useSettings();
  const [allUsers, setAllUsers] = useState(null);
  const [deviceList, setDeviceList] = useState("");


  // Add Device Fields
  const [deviceName, setDeviceName] = useState([]);
  const [deviceNameError, setDeviceNameError] = useState(false);
  const [deviceID, setdeviceID] = useState("");
  const [deviceIDError, setDeviceIDError] = useState(false);

  // Map Device Fields
  const [user, setuser] = useState("");
  const [userError, setuserError] = useState(false);
  const [device, setDevice] = useState("");
  const [deviceError, setDeviceError] = useState(false);
  const [deviceIDMap, setDeviceIDMap] = useState("");

  // Add Sensor Fields
  const [deviceNameSensor, setDeviceNameSensor] = useState("");
  const [deviceIDSensor, setDeviceIDSensor] = useState("");
  const [deviceIDSensorError, setDeviceIDSensorError] = useState(false);
  const [sensorType, setSensorType] = useState("");
  const [sensorTypeError, setSensorTypeError] = useState(false);
  const [sensorId, setSensorId] = useState("");
  const [sensorIdError, setSensorIdError] = useState(false);
  const [unit, setUnit] = useState("");
  const [unitError, setUnitError] = useState(false);
  const [sensorData, setSensorData] = useState("");
  const [sensorValueType, setSensorValueType] = useState("");
  const [sensorValueTypeError, setSensorValueTypeError] = useState(false);




  // function to add device to the database
  const submitEventAddDevice = async (e) => {
    
    e.preventDefault();
    setDeviceNameError(false);
    if (deviceName === "") {
      setDeviceNameError(true);
    }
    if (deviceID === "") {
      setDeviceIDError(true);
    }

    if (deviceName && deviceID) {
      


      const formData = new FormData();
      formData.append('device_name', deviceName);
      formData.append('device_id', deviceID);
      /* eslint-disable prefer-template */
      
      const response = await axios.post(
        '/api/devices/', formData, {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})

      if (response.status === 200) {
        alert("Device Added Succesfully!");
      } else {
        alert("Device Already Exists!");
        
      }
    }
  };

  const submitAddSensor = async (e) => {
    e.preventDefault();
    setDeviceIDSensorError(false);
    
    if (deviceIDSensor === "") {
      setDeviceIDSensorError(true);
    }
    if (sensorType === "") {
      setSensorTypeError(true);
    }
    if (sensorId === "") {
      setSensorIdError(true);
    }
    if (unit === "") {
      setUnitError(true);
    }
    if (sensorValueType === "") {
      setSensorValueTypeError(true);
    }

    if (deviceIDSensor && sensorType && sensorId && unit && sensorValueType) {
      const formData = new FormData();
      formData.append('sensor_id', sensorId);
      formData.append('sensor_type', sensorType);
      formData.append('unit', unit);
      formData.append('device_id', deviceIDSensor);
      formData.append('value_type', sensorValueType);
      /* eslint-disable prefer-template */
      
      const response = await axios.post(
        '/api/addSensor/', formData, {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})

      if (response.status === 200) {
        alert("Sensor Added Succesfully!");
      } else {
        alert("Sensor Already Exists!");
        
      }
    }

  };

  // function to map device to the user
  const submitEventMapDevice = async (e) => {
    e.preventDefault();
    if (user === "") {
      setuserError(true);
    }
    if (device === "") {
      setDeviceError(true);
    }



    const formData = new FormData();
      formData.append('userID', user);
      formData.append('device_id', device);
      /* eslint-disable prefer-template */
      
      const response = await axios.post(
        '/api/deviceAllocation/', formData, {headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }})

    if (response.status === 200) {
      alert("Device Mapped Succesfully!");
    } else if(response.status === 208){
      alert("Device already Mapped!");
    }
    else{
      alert("Device Does not Exist!");
    }
  };

  // function to fetch the user details from the database
  useEffect(() => {
    fetch("/accounts/getAllUsers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setAllUsers(data);
        return data;
      });
  }, []);


  // function to get the list of sensors already present in the database
  useEffect(() => {
    fetch("/api/sensorData", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setSensorData(data);
        return data;
      });
  }, []);


  // function to get the list of devices already present in the database
  useEffect(() => {
    fetch("/api/devices", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setDeviceList(data);
        return data;
      });
  }, []);

  // function to check the number of sensors of a particular type with the given device id 
  // present in the database and return the new unique sensor id
  const getSensorId = (deviceID, sensorType) => {
    let count = 0;
    sensorData.forEach((sensor) => {
      if (sensor.sensor_type === sensorType && sensor.device_id === deviceID) {
        count+=1;
      }
    });
    count+=1;
    // eslint-disable-next-line prefer-template
    return sensorType + "_" + count + "_" + deviceID;
  }


  return (
    <Page title="Add Device">

      {/* Add Device Form */}
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <HeaderBreadcrumbs
          heading="Add Device"
          links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Add Device' }]}
        />
        <form
          action=""
          noValidate
          autoComplete="off"
          onSubmit={submitEventAddDevice}
        >
          
          <Typography variant="subtitle2" paddingBottom={2}>Fill either Add Device or Add Sensor</Typography>
          <Card >
            <Typography variant='h5' paddingLeft={3} paddingTop={2}>Add Device</Typography>
            <div style={{ padding: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    onChange={(e) => setDeviceName(e.target.value)}
                    label="Device Name"
                    variant="outlined"
                    fullWidth
                    error={deviceNameError}
                    value={deviceName}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    onChange={(e) => setdeviceID(e.target.value)}
                    label="Device ID"
                    variant="outlined"
                    fullWidth
                    error={deviceIDError}
                    value={deviceID}
                    required
                  />
                </Grid>
              </Grid>
            </div>
            <div style={{ paddingRight: 20, paddingBottom: 20 }}>
              <Grid container spacing={2} display={'flex'} justifyContent={'right'}>
                <Grid item >
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon={'healthicons:no-outline'} width={20} height={20} />}
                    onClick={
                      () => {
                        setDeviceName("");
                        setdeviceID("");
                        setDeviceNameError(false);
                        setDeviceIDError(false);
                      }
                    }
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item >
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Card>
        </form>
      </Container>

      {/* Map Device Form */}
      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ paddingTop: 3 }}>
        <form
          action=""
          noValidate
          autoComplete="off"
          onSubmit={submitEventMapDevice}
        >
          <Card>
            <Typography variant='h5' paddingLeft={3} paddingTop={2}>Map Device</Typography>
            <div style={{ padding: '20px' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required
                    error = {userError}
                  >
                    <InputLabel>User</InputLabel>
                    <Select label="User" value={user} onChange={
                      (e) => { setuser(e.target.value) }
                    }>
                      {allUsers &&
                        allUsers.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name} - {user.email}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl
                    variant="outlined"
                    fullWidth
                    required
                    error = {deviceError}
                  >
                    <InputLabel>Device Name</InputLabel>
                    <Select label="Device Name" value={device} onChange={
                      (e) => { setDevice(e.target.value); setDeviceIDMap(e.target.value) }
                    }>
                      {deviceList &&
                        deviceList.map((device) => (
                          <MenuItem key={device.device_id} value={device.device_id}>
                            {device.device_name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Device ID"
                    variant="outlined"
                    fullWidth
                    value={deviceIDMap}
                    aria-readonly
                    disabled
                  />
                </Grid>
              </Grid>
            </div>
            <div style={{ paddingRight: 20, paddingBottom: 20 }}>
              <Grid container spacing={2} display={'flex'} justifyContent={'right'}>
                <Grid item >
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon={'healthicons:no-outline'} width={20} height={20} />}
                    onClick={
                      () => {
                        setuser("");
                        setDevice("");
                        setDeviceIDMap("");
                        setuserError(false);
                        setDeviceError(false);
                      }
                    }
                  >
                    Clear
                  </Button>
                </Grid>
                <Grid item >
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                    type="submit"
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Card>
        </form>
      </Container>

      {/* Add Sensor Form */}
      <Container maxWidth={themeStretch ? false : 'xl'} sx={{ paddingTop: 3 }}>
        <div>
          <form
            action=""
            noValidate
            autoComplete="off"
           onSubmit={submitAddSensor}
          >
            <Card >
              <div style={{ padding: 20 }}>
                <Grid container spacing={2}>

                  {/* Location Drop Down */}
                  <Grid item xs={6}>
                    <FormControl
                      variant="outlined"

                      fullWidth
                      required
                      error={deviceIDSensorError}

                    >
                      <InputLabel>Device Name</InputLabel>
                      <Select label="Device Name" value={deviceNameSensor} onChange={
                        (e) => {
                          if (sensorType !== "") {
                            setSensorId("");
                            setSensorType("");
                          }
                          setDeviceNameSensor(e.target.value);
                          setDeviceIDSensor(e.target.value);
                        }
                      }>

                        {deviceList &&
                          deviceList.map((device) => (
                            <MenuItem key={device.device_id} value={device.device_id}>
                              {device.device_name}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl
                      variant="outlined"

                      fullWidth
                      required
                    // error={locationIDError}

                    >
                      <InputLabel>Device ID</InputLabel>
                      <Select label="Device ID" value={deviceIDSensor} onChange={
                        (e) => {
                          setDeviceNameSensor(e.target.value);
                          setDeviceIDSensor(e.target.value);
                        }
                      }>

                        {deviceList &&
                          deviceList.map((device) => (
                            <MenuItem key={device.device_id} value={device.device_id}>
                              {device.device_id}
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Sensor Type Field */}
                  <Grid item xs={6}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                      error={sensorTypeError}
                    >
                      <InputLabel>Sensor Type</InputLabel>
                      <Select label="Sensor Type" value={sensorType} onChange={
                        (e) => {
                          if (deviceIDSensor === "" && deviceNameSensor === "") {
                            alert("Select a device first");
                            return;
                          }
                          setSensorId(getSensorId(deviceIDSensor, e.target.value));
                          
                          setSensorType(e.target.value)
                        }
                      }>
                        <MenuItem value={"Accelerometer"}> Accelerometer </MenuItem>
                        <MenuItem value={"Gyroscope"}> Gyroscope </MenuItem>
                        <MenuItem value={"Magnetometer"}> Magnetometer </MenuItem>
                        <MenuItem value={"Temperature"}> Temperature </MenuItem>
                        <MenuItem value={"Humidity"}> Humidity </MenuItem>
                        <MenuItem value={"Pressure"}> Pressure </MenuItem>
                        <MenuItem value={"Light"}> Light </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  {/* Sensor ID Field */}
                  <Grid item xs={6}>
                    <TextField
                      label="Sensor Id"
                      disabled
                      variant="outlined"
                      fullWidth
                      error={sensorIdError}
                      value={sensorId}
                      required
                      aria-readonly
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      onChange={(e) => setUnit(e.target.value)}
                      label="Sensor Unit"
                      variant="outlined"
                      fullWidth
                      error={unitError}
                      value={unit}
                      required
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <FormControl
                      variant="outlined"
                      fullWidth
                      required
                      error={sensorValueTypeError}
                    >
                      <InputLabel>Sensor Data Type</InputLabel>
                      <Select label="Sensor Data Type" value={sensorValueType} onChange={
                        (e) => {
                          setSensorValueType(e.target.value)
                        }
                      }>
                        <MenuItem value={"Accelerometer"}> Numerical </MenuItem>
                        <MenuItem value={"Gyroscope"}> Image </MenuItem>
                        <MenuItem value={"Magnetometer"}> Binary </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                </Grid>
              </div>
              <div style={{ paddingRight: 20, paddingBottom: 20 }}>
                <Grid container spacing={2} display={'flex'} justifyContent={'right'}>
                  <Grid item >
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                      onClick={
                        () => {
                          setSensorValueTypeError(false);
                          setSensorValueType("");
                          setUnitError(false);
                          setUnit("");
                          setSensorIdError(false);
                          setSensorId("");
                          setSensorTypeError(false);
                          setSensorType("");
                          setDeviceIDSensorError(false);
                          setDeviceIDSensor("");
                          setDeviceNameSensor("");

                        }
                      }
                    >
                      Clear
                    </Button>
                  </Grid>
                  <Grid item >
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                      type="submit"
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </div>
            </Card>
          </form>
        </div>
      </Container>
    </Page>
  );
}
