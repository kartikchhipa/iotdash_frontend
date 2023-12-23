import { useEffect, useState } from 'react';
// @mui
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { Input, Slide, Button, InputAdornment, ClickAwayListener, Container, Typography, Grid } from '@mui/material';
// utils
import cssStyles from '../../../utils/cssStyles';
// components
import Iconify from '../../../components/Iconify';
import { IconButtonAnimate } from '../../../components/animate';
/* eslint-disable camelcase */

// ----------------------------------------------------------------------

const APPBAR_MOBILE = 92;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled('div')(({ theme }) => ({
  ...cssStyles(theme).bgBlur(),
  top: 0,
  left: 0,
  zIndex: 99,
  width: '100%',
  display: 'flex',
  position: 'absolute',
  alignItems: 'center',
  height: APPBAR_MOBILE,
  padding: theme.spacing(0, 3),
  boxShadow: theme.customShadows.z8,
  [theme.breakpoints.up('md')]: {
    height: APPBAR_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));

// ----------------------------------------------------------------------

export default function Searchbar({device_id}) {

  const [startTime, setStartTime] = useState(dayjs('2022-04-17T15:30'));
  const [endTime, setEndTime] = useState(dayjs('2022-04-17T15:30'));

  const [isOpen, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };

  const exportData = (data) => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `data${startTime}-${endTime}.json`;

    link.click();
  };

  const handleClose = () => {
    setOpen(false);
  };


  const download = async () => {
    const fetchData = async () => {
      try{
        const formData = new FormData();
        formData.append('device_id', device_id);
        formData.append('start_time', startTime.format('YYYY-MM-DD HH:MM:ss.SSSSSSZ'));
        formData.append('end_time', endTime.format('YYYY-MM-DD HH:MM:ss.SSSSSSZ'));
        const response = await axios.post('/api/sensorData/', formData, {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`}})
        exportData(response.data);
        return response.data;
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
    setOpen(false);
  }

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <div>
        {!isOpen && (
          <IconButtonAnimate onClick={handleOpen}>
            <Iconify icon={'ic:round-download'} width={20} height={20} />
          </IconButtonAnimate>
        )}
        <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
          <SearchbarStyle>
              <Grid container spacing={2}>
                <Grid item xs={5} md={5} >
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="Start Date & Time"
                        value={startTime}
                        onChange={(newValue) => setStartTime(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={5} md={5}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker
                        label="End Date & Time"
                        value={endTime}
                        onChange={(newValue) => setEndTime(newValue)}
                      />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>  
              </Grid>
              <Button variant="contained" onClick={download}>
                    Download
              </Button>    
          </SearchbarStyle>
        </Slide>
      </div>
    </ClickAwayListener>
  );
}