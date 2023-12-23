import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui

import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, TextField, Grid } from '@mui/material';
import axios from 'axios';
// hooks
import useOffSetTop from '../../../hooks/useOffSetTop';
import useResponsive from '../../../hooks/useResponsive';
// utils
import cssStyles from '../../../utils/cssStyles';
// config
import { HEADER, NAVBAR } from '../../../config';
// components
import Logo from '../../../components/Logo';
import Iconify from '../../../components/Iconify';
import { IconButtonAnimate } from '../../../components/animate';
//
import Searchbar from './Searchbar';
import AccountPopover from './AccountPopover';



// ----------------------------------------------------------------------

const RootStyle = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'isCollapse' && prop !== 'isOffset' && prop !== 'verticalLayout',
})(({ isCollapse, isOffset, verticalLayout, theme }) => ({
  ...cssStyles(theme).bgBlur(),
  boxShadow: 'none',
  height: HEADER.MOBILE_HEIGHT,
  zIndex: theme.zIndex.appBar + 1,
  transition: theme.transitions.create(['width', 'height'], {
    duration: theme.transitions.duration.shorter,
  }),
  [theme.breakpoints.up('lg')]: {
    height: HEADER.DASHBOARD_DESKTOP_HEIGHT,
    width: `calc(100% - ${NAVBAR.DASHBOARD_WIDTH + 1}px)`,
    ...(isCollapse && {
      width: `calc(100% - ${NAVBAR.DASHBOARD_COLLAPSE_WIDTH}px)`,
    }),
    ...(isOffset && {
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
    }),
    ...(verticalLayout && {
      width: '100%',
      height: HEADER.DASHBOARD_DESKTOP_OFFSET_HEIGHT,
      backgroundColor: theme.palette.background.default,
    }),
  },
}));

// ----------------------------------------------------------------------

DashboardHeader.propTypes = {
  onOpenSidebar: PropTypes.func,
  isCollapse: PropTypes.bool,
  verticalLayout: PropTypes.bool,
};

export default function DashboardHeader({ onOpenSidebar, isCollapse = false, verticalLayout = false }) {



  const isOffset = useOffSetTop(HEADER.DASHBOARD_DESKTOP_HEIGHT) && !verticalLayout;

  const isDesktop = useResponsive('up', 'lg');
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      try{
        const response = await axios.get('/api/devices/', {headers : {Authorization: `Bearer ${localStorage.getItem('accessToken')}`}});
        setDevices(response.data);
        return response.data;
      }
      catch(err){
        console.log(err);
      }
    }
    fetchDevices();
  }, []);

  return (
    <RootStyle isCollapse={isCollapse} isOffset={isOffset} verticalLayout={verticalLayout}>
      <Toolbar
        sx={{
          minHeight: '100% !important',
          px: { lg: 5 },
        }}
      >
        {isDesktop && verticalLayout && <Logo sx={{ mr: 2.5 }} />}

        {!isDesktop && (
          <IconButtonAnimate onClick={onOpenSidebar} sx={{ mr: 2, color: 'text.primary' }}>
            <Iconify icon="eva:menu-2-fill"/>
          </IconButtonAnimate>
        )}

        <TextField
          select
          label="Select Device"
          SelectProps={{ native: true }}
          onChange={(e) => setSelectedDevice(e.target.value)}
          sx={{

            paddingTop: 2,
            '& label': { top: 8, left: 0, typography: 'subtitle1' },
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
          
        
        

        
        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" alignItems="center" spacing={{ xs: 0.5, sm: 1.5 }}>
          <Searchbar device_id={selectedDevice}/>
          <AccountPopover />
        </Stack>
      </Toolbar>
    </RootStyle>
  );
}
