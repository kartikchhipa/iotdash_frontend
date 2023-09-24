import merge from 'lodash/merge';
import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField, Grid,Typography } from '@mui/material';
// components
import { BaseOptionChart } from '../../../../components/chart';
// ----------------------------------------------------------------------


export default function AppAreaInstalled({allData}) {

  const [seriesData, setSeriesData] = useState('');
  const [sensorData,setSensorData] = useState([]);
  const [graphData,setGraphData] = useState([]);

  useEffect(()=> {
    setSensorData(allData.filter((item) => item.sensor_id === seriesData));
  }, [seriesData,allData]);

  useEffect(() => {
    if(sensorData.length !== 0){
        const n = sensorData[0].live_sensors_set.length; 
        if(n>0){
            const lines = Object.keys(sensorData[0].live_sensors_set[0].data);
            const gData = [];
            for(let i=0;i<lines.length;i+=1){
                const lst2 = [];
                for(let j=n-1;j>=n-50 && j>=0;j-=1){ 
                    lst2.push([new Date(sensorData[0].live_sensors_set[j].timestamp).getTime(),parseFloat(sensorData[0].live_sensors_set[j].data[lines[i]])])
                }
                const dict = { name: lines[i], data: lst2.reverse()}
                gData.push(dict);
            }
            setGraphData(gData);
        }
        else{
            setGraphData([]);
        }
    }
    else{
        setGraphData([]);
    }
  }, [sensorData]);

  



  const handleChangeSeriesData = (event) => {
    setSeriesData(event.target.value);
  };

  
  const chartOptions = merge(BaseOptionChart(), {
  });

  return (
    <Card sx={{height: 480}} >
      <Grid container spacing={2}>
        <Grid item xs={6} md={6}>
          <CardHeader
            title="Graphical Data"
            subheader="Choose the sensor ID"
          />
        </Grid>
        <Grid item xs={6} md={6}>
          {allData.length !==0 && <TextField
            select
            fullWidth
            value={seriesData}
            SelectProps={{ native: true }}
            onChange={handleChangeSeriesData}
            sx={{
              paddingTop: 5,
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
            <option key="" value="">{}</option>
            {allData.map((option) => (
              <option key={option.sensor_id} value={option.sensor_id}>
                {option.sensor_id}
              </option>
            ))}
          </TextField>}
        </Grid>
      </Grid>
      
      {graphData.length!==0?<ReactApexChart series={graphData} options={chartOptions} height={350} />:<Box sx={{flexDirection: "column"}}><Typography align='center' paddingTop={19}>No Data</Typography></Box>}
      
        

        

        
        
    </Card>
  );
}
