import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Stack, Box, Typography, Grid, TextField, TableContainer, Table, TablePagination, TableBody, TableRow, TableCell, Container } from '@mui/material';
import Scrollbar from '../../../../components/Scrollbar';
import { UserListHead } from '../../user/list';
// utils


// ----------------------------------------------------------------------

/* eslint-disable camelcase */
/* eslint-disable object-shorthand */

export default function BinaryData({ allData }) {
    const [sensorData, setSensorData] = useState([]);
    const [graphData, setGraphData] = useState([]);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filterName, setFilterName] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        setSensorData(allData);
    }, [allData]);


    useEffect(() => {
        if (sensorData.length !== 0) {
            const lst = []
            for (let i = 0; i < sensorData.length; i+=1) {
                const sensor_id = sensorData[i].sensor_id;
                const n = sensorData[i].live_sensors_set.length;
                const key = Object.keys(sensorData[i].live_sensors_set[n - 1].data);
                const data = sensorData[i].live_sensors_set[n - 1].data[key[0]];
                lst.push({ sensor_id: sensor_id, data: data })
            }
            setGraphData(lst);
        }
        else {
            setGraphData([]);
        }
    }, [sensorData]);
    console.log(sensorData)
    console.log(graphData)



    const TABLE_HEAD = [
        { id: 'sensor_id', label: 'Sensor ID', alignRight: false },
        { id: 'data', label: 'Status', alignRight: true },
    ];

    const [order, setOrder] = useState('asc');

    const [orderBy, setOrderBy] = useState('sensor_id');

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const [page, setPage] = useState(0);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };


    const emptyRows = page >= 0 ? Math.max(0, (1 + page) * rowsPerPage - graphData.length) : 0;
    console.log(emptyRows)
    

    return (
        <Card sx={{ height: 478 }} >
            <CardHeader title="Binary Data" />
            <Card sx={{ paddingTop: 4, paddingLeft: 1, paddingRight: 1, boxShadow: 0 }}>

                <Scrollbar>
                    <TableContainer >
                        <Table>
                            <UserListHead
                                // order={order}
                                // orderBy={orderBy}
                                headLabel={TABLE_HEAD}
                                // rowCount={userList.length}
                                // numSelected={selected.length}
                                onRequestSort={handleRequestSort}
                            // onSelectAllClick={handleSelectAllClick}
                            />
                            <TableBody>
                                {graphData.length>0 && graphData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    const { sensor_id, data } = row;
                                    
                                    // id, name, role,  company,  status, avatarUrl, isVerified
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
                                            <TableCell align="right">{data}</TableCell>

                                        </TableRow>

                                    );
                                })}
                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 53.5 * emptyRows }}>
                                        <TableCell colSpan={2} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Scrollbar>

                <TablePagination
                    rowsPerPageOptions={[5]}
                    component="div"
                    count={graphData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={(e, page) => setPage(page)}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Card>
        </Card>

    );
}


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

// ----------------------------------------------------------------------


