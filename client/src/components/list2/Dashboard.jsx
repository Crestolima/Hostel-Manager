import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import RoomIcon from '@mui/icons-material/Room';
import PaymentIcon from '@mui/icons-material/Payment';

const MainCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'left',
  color: theme.palette.text.primary,
  backgroundColor: theme.palette.background.paper,
  borderRadius: 12,
  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  },
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  fontWeight: 'bold',
  fontSize: '1.6rem',
  color: theme.palette.primary.main,
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const UDashboard = () => {
  const location = useLocation();
  const regNo = location.state?.regNo;

  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (regNo) {
      const fetchUserDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:5000/api/student-details/${regNo}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.status === 200 && response.data) {
            setUserDetails(response.data);
          } else {
            console.error('Unexpected API response:', response);
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [regNo]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userDetails) {
    return (
      <Typography variant="h6" textAlign="center" mt={4}>
        No user details found for the provided registration number.
      </Typography>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {/* Row 1: Personal Info and Room Details */}
        <Grid item xs={12} md={6}>
          <MainCard>
            <SectionTitle variant="h5"><PersonIcon /> Personal Info</SectionTitle>
            <Typography variant="body1" gutterBottom><strong>Reg No:</strong> {userDetails.user.regNo}</Typography>
            <Typography variant="body1" gutterBottom><strong>Name:</strong> {`${userDetails.user.firstName} ${userDetails.user.initial} ${userDetails.user.lastName}`}</Typography>
            <Typography variant="body1" gutterBottom><strong>Email:</strong> {userDetails.user.email}</Typography>
            <Typography variant="body1" gutterBottom><strong>Phone Number:</strong> {userDetails.user.phoneNo}</Typography>
            <Typography variant="body1" gutterBottom><strong>Course:</strong> {userDetails.user.course}</Typography>
            <Typography variant="body1" gutterBottom><strong>Year:</strong> {userDetails.user.year}</Typography>
            <Typography variant="body1" gutterBottom><strong>Address:</strong> {userDetails.user.address}</Typography>
          </MainCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <MainCard>
            <SectionTitle variant="h5"><RoomIcon /> Room Details</SectionTitle>
            <Typography variant="body1" gutterBottom><strong>Room No:</strong> {userDetails.room.roomNo}</Typography>
            <Typography variant="body1" gutterBottom><strong>Floor:</strong> {userDetails.room.floor}</Typography>
            <Typography variant="body1" gutterBottom><strong>Room Type:</strong> {userDetails.room.roomType}</Typography>
          </MainCard>
        </Grid>

        {/* Row 2: Payment Details */}
        <Grid item xs={12}>
          <MainCard>
            <SectionTitle variant="h5"><PaymentIcon /> Payment Details</SectionTitle>
            <Typography variant="body1" gutterBottom><strong>Total Amount:</strong> {userDetails.payDetails.totalAmt}</Typography>
            <Typography variant="body1" gutterBottom><strong>Paid Amount:</strong> {userDetails.payDetails.paidAmt}</Typography>
            <Typography variant="body1" gutterBottom><strong>Due Amount:</strong> {userDetails.payDetails.dueAmt}</Typography>
          </MainCard>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UDashboard;
