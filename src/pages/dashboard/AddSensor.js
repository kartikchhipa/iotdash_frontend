import { useEffect, useState } from 'react';
// @mui
import { Card, Container, Grid, Button, Stack, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
// redux
import { useDispatch } from '../../redux/store';
import { getConversations, getContacts } from '../../redux/slices/chat';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

export default function Chat() {

  // initial states
  const [sensorId, setSensorId] = useState("");
  const [allDevice, setAllDevice] = useState(null);
  const [deviceID, setdeviceID] = useState("");
  const [sensorType, setSensorType] = useState("");
  const [unit, setUnit] = useState("");
  const [locationID, setLocationID] = useState("");

  // errors
  const [sensorIdError, setSensorIdError] = useState(false);
  const [unitError, setUnitError] = useState(false);
  const [locationIDError, setLocationIDError] = useState(false);
  const [deviceError , setDeviceError] = useState(false);
  const [sensorTypeError, setSensorTypeError] = useState(false);

  function findDeviceIdByLocId(locId) {
    for (let i = 0; i < allDevice.length; i+=1) {
        if (allDevice[i].locId === locId) {
            return allDevice[i].deviceID;
        }
    }
    return null; // Return null if no matching locId is found
  }

  const handleChangeSetLocationID = (event) => {
    setLocationID(event.target.value);
    setdeviceID(findDeviceIdByLocId(event.target.value));
    if(sensorId !== ""){
      setSensorId("");
      setSensorType("");
    }
  };

  const handleChangeSensorType = (event) => {
    if(deviceID === ""){
      alert("Please select a location first");
      return;
    }
    setSensorType(event.target.value);
    setSensorId(event.target.value + deviceID);
  };



  useEffect(() => {
    fetch("/api/device", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        setAllDevice(data);
        return data;
      });
  }, []);

  const clearText = () => {

    // fields
    setSensorId("");
    setUnit("");
    setLocationID("");
    setdeviceID("");
    setSensorType("");
    setSensorIdError(false);
    setUnitError(false);
    setLocationIDError(false);
    setDeviceError(false);
    setSensorTypeError(false);
  };
  
  const handleSubmitEvent = async (e) => {
    e.preventDefault();
    setSensorIdError(false);
    if (sensorId === "") {
      setSensorIdError(true);
    }

    if (unit === "") {
      setUnitError(true);
    }

    if (locationID === "") {
      setLocationIDError(true);
    }

    if(sensorType === ""){
      setSensorTypeError(true);
    }

    if(deviceID === ""){
      setDeviceError(true);
    }

    if (sensorId && unit && locationID && deviceID && sensorType) {
      

      const formData = {
        // eslint-disable-next-line object-shorthand
        name: sensorId,
        // eslint-disable-next-line object-shorthand
        sensor_id: sensorId,
        // eslint-disable-next-line object-shorthand
        unit: unit,
        // eslint-disable-next-line object-shorthand
        locationID: locationID,
      };
      const settings = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      };
      const response = await fetch(
        "/api/sensorDataAPI/",
        settings
      );
      
      if (response.status === 200) {
        const data = await response.json();
        alert(data);
        clearText();
      } else {
        alert("Invalid Credentials");
      }
    }
  };



  const { themeStretch } = useSettings();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConversations());
    dispatch(getContacts());
  }, [dispatch]);

  return (
    <Page title="Add Sensor">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <div>
          <form
            action=""
            noValidate
            autoComplete="off"
            onSubmit={handleSubmitEvent}
          >
            <HeaderBreadcrumbs
              heading="Add Sensor"
              links={[{ name: 'Dashboard', href: PATH_DASHBOARD.root }, { name: 'Add Sensor' }]}
              action={
                <div>
                  <Grid container spacing={2} >
                    <Grid item >
                      <Button
                        variant="outlined"
                        startIcon={<Iconify icon={'eva:plus-fill'} width={20} height={20} />}
                        onClick={clearText}
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
              }
            />
            <Card >
              <div style={{ padding: 20 }}>
                <Grid container spacing={2}>

                  {/* Location Drop Down */}
                  <Grid item xs={6}>
                    <FormControl
                      variant="outlined"
                      
                      fullWidth
                      required
                     error={locationIDError}

                    >
                      <InputLabel>Location ID</InputLabel>
                      <Select label="Location ID" value={locationID} onChange={handleChangeSetLocationID}>
                        {allDevice &&
                        allDevice.map((device) => (
                          <MenuItem key={device.locId} value={device.locId}>
                            {device.locId}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField

                      label="Device ID"
                      disabled
                      variant="outlined"
                      fullWidth
                      error={deviceError}
                      value={deviceID}
                      required
                      aria-readonly
                    />
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
                      <Select label="Sensor Type" value={sensorType} onChange={handleChangeSensorType}>
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
                </Grid>
              </div>
            </Card>

          </form>
        </div>


      </Container>
    </Page>
  );
}
