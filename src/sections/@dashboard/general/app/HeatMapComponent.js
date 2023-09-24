import { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box, TextField, Grid,Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';



export default function HeatMapComponent({allData}) {

  const theme = useTheme();
  const [seriesData, setSeriesData] = useState('');
  const [sensorData,setSensorData] = useState([]);
  const [graphData,setGraphData] = useState([]);

  useEffect(()=> {
    setSensorData(allData.filter((item) => item.sensor_id === seriesData));
  }, [seriesData,allData]);

  useEffect(() => {
    if(sensorData.length!==0){
      const n = sensorData[0].live_sensors_set.length;
      if(n>0){
        const data = sensorData[0].live_sensors_set[n-1].data;
        
        const lst = []
        let k=1;
        for(let i =0;i<8;i+=1){
          const lst2 = []
          for(let j=0;j<8;j+=1){
            lst2.push({x: '',y: parseFloat(data[`pixel${k}`])})
            k+=1
          }
          lst.push({name:'',data: lst2})
        }
        setGraphData(lst);
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


  const options1 = {
    chart: {
      height: 350,
    },
    dataLabels: {
      enabled: true
    },
    colors: [
      theme.palette.primary.main,

    ],

    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
      }
    }
  }

  return (
    <Card >
      <Grid container spacing={2}>
        <Grid item xs={6} md={6}>
          <CardHeader
            title="Heat Map Data"
            subheader="Select the sensor ID"
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
      <Box sx = {{height: 400}} paddingTop={4} paddingBottom={2} paddingRight={2} paddingLeft={2}>
      {graphData.length!==0?<ReactApexChart options={options1} height={350} series={graphData} type='heatmap'/>:<Typography paddingTop={20} align='center'>No Data</Typography>}
      </Box>   
    </Card>
  );
}
