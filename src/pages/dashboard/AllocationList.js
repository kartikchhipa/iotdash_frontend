import { useState, useEffect } from 'react';
import { format } from 'date-fns';
// @mui
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


const TABLE_HEAD = [
    { id: 'id', label: 'ID', alignRight: false },
    { id: 'deviceID', label: 'Device ID', alignRight: false },
    { id: 'name', label: 'Device Name', alignRight: false },
    { id: 'user', label: 'User ID', alignRight: false },
    { id: 'username', label: 'User Name', alignRight: false },
    { id: 'allocated_at', label: 'Allocated At', alignRight: false },
    
];

// ----------------------------------------------------------------------

export default function UserList() {


    useEffect(() => {
        fetch("/api/deviceAllocation", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((res) => res.json()).then((data) => {
            setUserList(data);
            console.log(data);
            return data;
        }).catch((err) => {
            console.log(err);
        })
    }, []);

    const { themeStretch } = useSettings();
    const [userList, setUserList] = useState([]);
    const [page, setPage] = useState(0);
    const [order, setOrder] = useState('asc');
    const [selected, setSelected] = useState([]);
    const [orderBy, setOrderBy] = useState('name');
    const [filterName, setFilterName] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [open, setOpen] = useState(false);

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteUser = async (sensor_id) => {
        const deleteUser = userList.filter((sensor) => sensor.sensor_id !== sensor_id);
        setSelected([]);
        setUserList(deleteUser);
    };

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

    const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Page title="User: List">
                <Container maxWidth={themeStretch ? false : 'lg'}>
                    <HeaderBreadcrumbs
                        heading="List of Devices"
                        links={[
                            { name: 'Dashboard', href: PATH_DASHBOARD.root },
                            { name: 'User', href: PATH_DASHBOARD.user.root },
                            { name: 'Devices' },
                        ]}
                    />

                    <Card sx={{ paddingTop: 1 }}>
                        <Scrollbar>
                            <TableContainer sx={{ minWidth: 800 }}>
                                <Table>
                                    <UserListHead
                                        headLabel={TABLE_HEAD}
                                        onRequestSort={handleRequestSort}
                                    />
                                    <TableBody>
                                        {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                            const { id, device, user, username, allocated_at } = row;
                                            // id, name, role,  company,  status, avatarUrl, isVerified
                                            const isItemSelected = selected.indexOf(id) !== -1;
                                            return (
                                                <TableRow
                                                    hover
                                                    key={id}
                                                    tabIndex={-1}
                                                    role="checkbox"
                                                    selected={isItemSelected}
                                                    aria-checked={isItemSelected}
                                                >
                                                    <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography variant="subtitle2" noWrap>
                                                            {id}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="left">{device.deviceID}</TableCell>
                                                    <TableCell align="left">{device.name}</TableCell>
                                                    <TableCell align="left">{user}</TableCell>
                                                    <TableCell align="left">{username}</TableCell>
                                                    
                                                    <TableCell align="left">{format(Date.parse(allocated_at), 'MMMM do yyyy, h:mm:ss a')}</TableCell>

                                                </TableRow>
                                            );
                                        })}
                                        
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
        </div>
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
