import PropTypes from 'prop-types';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { useEffect, useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, CardHeader, Stack, Box, Typography,Grid,TextField } from '@mui/material';
// utils
import { fNumber } from '../../../../utils/formatNumber';
//
import { BaseOptionChart } from '../../../../components/chart';

// ----------------------------------------------------------------------

export default function PercentageData({ allData }) {
    const theme = useTheme();

    const [seriesData, setSeriesData] = useState('');
    const [sensorData, setSensorData] = useState([]);
    const [graphData, setGraphData] = useState(0);

    useEffect(() => {
        setSensorData(allData.filter((item) => item.sensor_id === seriesData));
    }, [seriesData, allData]);

    useEffect(() => {
        if (sensorData.length !== 0) {
            const n = sensorData[0].live_sensors_set.length;
            if (n > 0) {
                const data = sensorData[0].live_sensors_set[n - 1].data;
                setGraphData(data.Percentage.toFixed(2));
            }
            else {
                setGraphData(0);
            }
        }
        else {
            setGraphData(0);
        }
    }, [sensorData]);

    const CHART_DATA = [graphData];
    const PERCENTAGE = graphData;
    
    const handleChangeSeriesData = (event) => {
        setSeriesData(event.target.value);
    };

    const chartOptions = merge(BaseOptionChart(), {
        legend: { show: false },
        grid: {
            padding: { top: -32, bottom: -32 },
        },
        fill: {
            type: 'gradient',
            gradient: {
                colorStops: [
                    [
                        { offset: 0, color: theme.palette.primary.light },
                        { offset: 100, color: theme.palette.primary.main },
                    ],
                ],
            },
        },
        plotOptions: {
            radialBar: {
                hollow: { size: '64%' },
                dataLabels: {
                    name: { offsetY: -16 },
                    value: { offsetY: 8 },
                    total: {
                        label: 'Percentage',
                    },
                },
            },
        },
    });

    return (
        <Card>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={6}>
                    <CardHeader title="Data In Percentage" sx={{ mb: 8 }} subheader="Choose the Sensor ID"/>
                </Grid>
                <Grid item xs={12} sm={6} md={6}>
                    {allData.length !== 0 && <TextField
                        select
                        fullWidth
                        value={seriesData}
                        SelectProps={{ native: true }}
                        onChange={handleChangeSeriesData}
                        sx={{
                            paddingTop: 6,
                            paddingRight: 5,
                            '& fieldset': { border: '0 !important' },
                            '& select': {
                                pl: 1,
                                py: 0.5,
                                pr: '24px !important',
                                typography: 'subtitle2',
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
                        <option key="" value="">{ }</option>
                        {allData.map((option) => (
                            <option key={option.sensor_id} value={option.sensor_id}>
                                {option.sensor_id}
                            </option>
                        ))}
                    </TextField>}
                </Grid>
                
            </Grid>
            {graphData!==0?<ReactApexChart type="radialBar" series={CHART_DATA} options={chartOptions} height={320}/>:<Box sx={{flexDirection: "column"}}><Typography align='center' paddingTop={11} paddingBottom={15}>No Data</Typography></Box>}
            <Stack spacing={2} sx={{ p: 5 }}>
                {graphData!==0?<Legend label="Humidity" number={Number(graphData)} />:<Legend label='---' number={0}/>}
            </Stack>
        </Card>
    );
}

// ----------------------------------------------------------------------

Legend.propTypes = {
    label: PropTypes.string,
    number: PropTypes.number,
};

function Legend({ label, number }) {
    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Stack direction="row" alignItems="center" spacing={1}>
                <Box
                    sx={{
                        width: 16,
                        height: 16,
                        bgcolor: 'grey.50016',
                        borderRadius: 0.75,
                        ...(label === 'Sold out' && {
                            bgcolor: 'primary.main',
                        }),
                    }}
                />
                <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    {label}
                </Typography>
            </Stack>
            <Typography variant="subtitle1">{number}%</Typography>
        </Stack>
    );
}
