import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

import KeyIcon from '@mui/icons-material/Key';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StorageIcon from '@mui/icons-material/Storage';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: '#fff',
  borderRadius: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '150px',
  position: 'relative'
}));

const IconContainer = styled('div')({
  position: 'absolute',
  top: '10px',
  left: '10px',
  display: 'flex',
  alignItems: 'center'
});

const DataText = styled(Typography)({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  fontSize: '24px',
  fontWeight: 'bold'
});

const TitleText = styled(Typography)({
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '14px',
  fontWeight: 'normal'
});

const Dashboard = () => {
  const [data, setData] = useState({
    residence: 0,
    rooms: 0,
    totalCapacity: 0,
    vacancy: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard-data');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <GroupAddIcon fontSize="large" style={{ fontSize: 40 }} />
            </IconContainer>
            <TitleText variant="subtitle1">Residence</TitleText>
            <DataText variant="h4">{data.residence}</DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <KeyIcon fontSize="large" style={{ fontSize: 40 }} />
            </IconContainer>
            <TitleText variant="subtitle1">Rooms</TitleText>
            <DataText variant="h4">{data.rooms}</DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <StorageIcon fontSize="large" style={{ fontSize: 40 }} />
            </IconContainer>
            <TitleText variant="subtitle1">Total Capacity</TitleText>
            <DataText variant="h4">{data.totalCapacity}</DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <HourglassEmptyIcon fontSize="large" style={{ fontSize: 40 }} />
            </IconContainer>
            <TitleText variant="subtitle1">Vacancy</TitleText>
            <DataText variant="h4">{data.vacancy}</DataText>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
