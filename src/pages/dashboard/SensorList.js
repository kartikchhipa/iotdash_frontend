import '../../hidescrollbar.css';
import { useState, useEffect } from 'react';

// @mui

import axios from 'axios';
import {
  Card,
  Table,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// hooks
import useSettings from '../../hooks/useSettings';
// _mock_
import { _userList } from '../../_mock';
// components
import Page from '../../components/Page';
import Scrollbar from '../../components/Scrollbar';
import HeaderBreadcrumbs from '../../components/HeaderBreadcrumbs';
// sections
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../sections/@dashboard/user/list';

// ----------------------------------------------------------------------

/* eslint-disable camelcase */
const django_app_host = 'http://10.6.0.56:8080'

const TABLE_HEAD = [
  { id: 'sensor_id', label: 'Sensor ID', alignRight: false },
  { id: 'device_id', label: 'Device ID', alignRight: false },
  { id: 'sensor_type', label: 'Sensor Type', alignRight: false },
  { id: 'value_type', label: 'Values Type', alignRight: false },
  { id: 'unit', label: 'Unit', alignRight: false },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function UserList() {


  useEffect(() => {

    const fetchData = async () => {
      try{
        const response = await axios.get(`http://10.6.0.56:8080/api/sensorData/`, {headers: {'Content-Type': 'application/json', withCredentials: true}});
        setUserList(response.data);
        return response.data;
      }catch(err){
        console.log(err);
      }
    }
    fetchData();
  }, []);
  const { themeStretch } = useSettings();
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  


  const handleDeleteUser = async(sensor_id) => {
    const deleteUser = userList.filter((sensor) => sensor.sensor_id !== sensor_id);
    setSelected([]);
    setUserList(deleteUser);

    
    const formData = {
      // eslint-disable-next-line object-shorthand
      sensor_id: sensor_id
    }
    const settings = {
      method: 'DELETE',
      headers: {
        Allow : 'GET, POST, HEAD, DELETE, OPTIONS',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(formData),
    };
    const response = await fetch('/api/sensorData/', settings);
    if(response.status === 200){
      console.log("Sensor Deleted");
    }else{
      console.log("Sensor Not Deleted");
      alert("Sensor Not Deleted");
    }
  };
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;
  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

  return (
    <Page title="User: List">
      <Container maxWidth={themeStretch ? false : 'lg'}>
        <HeaderBreadcrumbs
          heading="List of Sensors"
          links={[
            { name: 'Dashboard', href: PATH_DASHBOARD.root },
            { name: 'User', href: PATH_DASHBOARD.user.root },
            { name: 'Sensors' },
          ]}
        />

        <Card sx={{paddingTop: 1 }}>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  headLabel={TABLE_HEAD}
                />
                <TableBody>
                  {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    const { sensor_id, device_id, live_sensors_set, sensor_type, value_type, unit } = row;
                  
                    const isItemSelected = selected.indexOf(sensor_id) !== -1;

                    return (
                      <TableRow
                        hover
                        key={sensor_id}
                        tabIndex={-1}
                        role="checkbox"
                        selected={isItemSelected}
                        aria-checked={isItemSelected}
                      >
                        
                        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                        
                          <Typography variant="subtitle2" noWrap>
                            {sensor_id}
                          </Typography>
                        </TableCell>
                        <TableCell align="left">{device_id}</TableCell>
                        <TableCell align="left">{sensor_type}</TableCell>
                        <TableCell align="left">{value_type}</TableCell>
                        <TableCell align="left">{unit}</TableCell>
                        <TableCell align="right">
                          <UserMoreMenu onDelete={() => handleDeleteUser(sensor_id)} userName={sensor_id} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(e, page) => setPage(page)}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </Page>
  );
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return array.filter((_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}
