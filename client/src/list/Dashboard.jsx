import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import KeyIcon from '@mui/icons-material/Key';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import StorageIcon from '@mui/icons-material/Storage';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { format } from 'date-fns';

const DashboardCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  backgroundColor: '#fff',
  borderRadius: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'translateY(-1px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '150px',
  position: 'relative',
}));

const IconContainer = styled('div')({
  position: 'absolute',
  top: '10px',
  left: '10px',
  display: 'flex',
  alignItems: 'center',
});

const DataText = styled(Typography)(({ color }) => ({
  position: 'absolute',
  bottom: '10px',
  right: '10px',
  fontSize: '24px',
  fontWeight: 'bold',
  color: color,
}));

const TitleText = styled(Typography)(({ color }) => ({
  position: 'absolute',
  top: '10px',
  right: '10px',
  fontSize: '14px',
  fontWeight: 'normal',
  color: color,
}));

const PaymentDetailsTable = styled('table')({
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '20px',
  '& th, & td': {
    border: '1px solid #ddd',
    padding: '8px',
    textAlign: 'left',
  },
  '& th': {
    backgroundColor: '#f2f2f2',
    fontWeight: 'bold',
  },
  '& td': {
    backgroundColor: '#f9f9f9',
  },
});

const Dashboard = () => {
  const [data, setData] = useState({
    residence: 0,
    rooms: 0,
    totalCapacity: 0,
    vacancy: 0,
  });
  const [notBackYetData, setNotBackYetData] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPayment, setCurrentPayment] = useState({
    regNo: '',
    roomNo: '',
    paidAmt: '',
    newPaidAmt: '',
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/dashboard-data');
        setData(res.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchNotBackYet = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/not-returned-logs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotBackYetData(res.data);
      } catch (error) {
        console.error('Error fetching not-back-yet data:', error);
      }
    };

    const fetchPaymentDetails = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/payment-details');
        setPaymentDetails(res.data);
      } catch (error) {
        console.error('Error fetching payment details:', error);
      }
    };

    fetchDashboardData();
    fetchNotBackYet();
    fetchPaymentDetails();
  }, []);

  const handleEditClick = (payment) => {
    setCurrentPayment({
      regNo: payment.regNo,
      roomNo: payment.roomNo,
      paidAmt: payment.paidAmt,
      newPaidAmt: '', // Initialize with an empty string for the new amount
    });
    setEditDialogOpen(true);
  };

  const handleDialogClose = () => {
    setEditDialogOpen(false);
    setCurrentPayment({
      regNo: '',
      roomNo: '',
      paidAmt: '',
      newPaidAmt: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPayment((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdatePayment = async () => {
    try {
      const updatedPaidAmt = (parseFloat(currentPayment.paidAmt) || 0) + parseFloat(currentPayment.newPaidAmt || 0);
      const paymentDetail = paymentDetails.find(payment => payment.regNo === currentPayment.regNo);
      const totalAmount = paymentDetail?.totalAmt || 0;

      if (updatedPaidAmt > totalAmount) {
        alert('Cannot update payment. Paid amount exceeds the total amount.');
        return;
      }

      const newDueAmt = Math.max(0, totalAmount - updatedPaidAmt);

      const payload = { newPaidAmt: currentPayment.newPaidAmt };

      await axios.put(`http://localhost:5000/api/payment-details/${currentPayment.regNo}`, payload);
      setPaymentDetails((prev) =>
        prev.map((payment) =>
          payment.regNo === currentPayment.regNo
            ? { ...payment, paidAmt: updatedPaidAmt, dueAmt: newDueAmt }
            : payment
        )
      );
      setEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating payment details:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <GroupAddIcon fontSize="large" style={{ fontSize: 40, color: '#f44336' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#f44336">Residence</TitleText>
            <DataText variant="h4" color="#f44336">{data.residence}</DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <KeyIcon fontSize="large" style={{ fontSize: 40, color: '#2196f3' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#2196f3">Rooms</TitleText>
            <DataText variant="h4" color="#2196f3">{data.rooms}</DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <StorageIcon fontSize="large" style={{ fontSize: 40, color: '#4caf50' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#4caf50">Total Capacity</TitleText>
            <DataText variant="h4" color="#4caf50">{data.totalCapacity}</DataText>
          </DashboardCard>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard>
            <IconContainer>
              <HourglassEmptyIcon fontSize="large" style={{ fontSize: 40, color: '#ff9800' }} />
            </IconContainer>
            <TitleText variant="subtitle1" color="#ff9800">Vacancy</TitleText>
            <DataText variant="h4" color="#ff9800">{data.vacancy}</DataText>
          </DashboardCard>
        </Grid>

        {/* Not Back Yet Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Not Back Yet
            </Typography>
            {notBackYetData.length > 0 ? (
              <PaymentDetailsTable>
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Room No</th>
                    <th>Out Date & Time</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {notBackYetData.map((log) => (
                    <tr key={log._id}>
                      <td>{log.regNo}</td>
                      <td>{log.roomNo}</td>
                      <td>{format(new Date(log.outTime), 'MM/dd/yyyy hh:mm a')}</td>
                      <td>{log.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </PaymentDetailsTable>
            ) : (
              <Typography variant="body1">All residents have returned.</Typography>
            )}
          </Paper>
        </Grid>

        {/* Due Table */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Due Payments 
            </Typography>
            {paymentDetails.length > 0 ? (
              <PaymentDetailsTable>
                <thead>
                  <tr>
                    <th>Reg No</th>
                    <th>Room No</th>
                    <th>Total Amount</th>
                    <th>Paid Amount</th>
                    <th>Due Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentDetails.map((payment) => (
                    <tr key={payment.regNo}>
                      <td>{payment.regNo}</td>
                      <td>{payment.roomNo}</td>
                      <td>{payment.totalAmt}</td>
                      <td>{payment.paidAmt}</td>
                      <td>{payment.dueAmt}</td>
                      <td>
                        <Button variant="contained" color="primary" onClick={() => handleEditClick(payment)}>
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </PaymentDetailsTable>
            ) : (
              <Typography variant="body1">No Due Payments Available.</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Edit Payment Dialog */}
      <Dialog open={editDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Edit Payment</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Registration No"
            type="text"
            fullWidth
            value={currentPayment.regNo}
            disabled
          />
          <TextField
            margin="dense"
            label="Room No"
            type="text"
            fullWidth
            value={currentPayment.roomNo}
            disabled
          />
          <TextField
            margin="dense"
            label="Total Amount"
            type="number"
            fullWidth
            value={paymentDetails.find(payment => payment.regNo === currentPayment.regNo)?.totalAmt || 0}
            disabled
          />
          <TextField
            margin="dense"
            label="Paid Amount"
            type="number"
            fullWidth
            value={currentPayment.paidAmt}
            disabled
          />
          <TextField
            margin="dense"
            label="New Amount Paid"
            type="number"
            name="newPaidAmt"
            fullWidth
            value={currentPayment.newPaidAmt}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePayment} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard;
