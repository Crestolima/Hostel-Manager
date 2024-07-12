import React, { useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Grid, Paper, Typography, Table, TableBody, TableCell, TableContainer, TableRow, CircularProgress } from '@mui/material';
import { AuthContext } from '../../components/AuthContext';

const UDashboard = () => {
  const { authState } = useContext(AuthContext);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axios.get(`/api/student-details/${authState.regNo}`);
        setDetails(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching details');
        console.error('Error fetching details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (authState.isAuthenticated && authState.regNo) {
      fetchDetails();
    }
  }, [authState]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!details) {
    return <Typography>No details found.</Typography>;
  }

  const { user, room, payDetails } = details;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h5">{`${user.firstName || ''} ${user.initial || ''} ${user.lastName || ''}`}</Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Register No:</TableCell>
                    <TableCell>{user.regNo || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Course:</TableCell>
                    <TableCell>{user.course || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Year:</TableCell>
                    <TableCell>{user.year || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Phone:</TableCell>
                    <TableCell>{user.phoneNo || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email:</TableCell>
                    <TableCell>{user.email || 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Paper elevation={3} sx={{ padding: 2 }}>
            <Typography variant="h6">Room Details</Typography>
            <TableContainer>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>Room No:</TableCell>
                    <TableCell>{room.roomNo || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Room Type:</TableCell>
                    <TableCell>{room.roomType || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Floor:</TableCell>
                    <TableCell>{room.floor || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Fees:</TableCell>
                    <TableCell>{payDetails.totalAmt || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Paid Fees:</TableCell>
                    <TableCell>{payDetails.paidAmt || 'N/A'}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fees Due:</TableCell>
                    <TableCell>{payDetails.dueAmt || 'N/A'}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UDashboard;
