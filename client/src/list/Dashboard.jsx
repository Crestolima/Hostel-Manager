import React from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const Dashboard = () => {
  const data = {
    residence: 12,
    rooms: 8,
    totalCapacity: 20,
    vacancy: 18,
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h4">{data.residence}</Typography>
            <Typography variant="subtitle1">Residence</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h4">{data.rooms}</Typography>
            <Typography variant="subtitle1">Rooms</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h4">{data.totalCapacity}</Typography>
            <Typography variant="subtitle1">Total Capacity</Typography>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <Typography variant="h4">{data.vacancy}</Typography>
            <Typography variant="subtitle1">Vacancy</Typography>
          </DashboardCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
