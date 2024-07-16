// AllUsers.jsx
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import EditUser from './EditUser';
import { SearchContext } from '../components/SearchContext';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userBookings, setUserBookings] = useState({});
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        if (response.status === 200 && Array.isArray(response.data)) {
          setUsers(response.data);
          response.data.forEach(user => fetchUserBooking(user.regNo));
        } else {
          console.error('Unexpected API response:', response);
          setUsers([]);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        setUsers([]);
      }
    };

    const fetchUserBooking = async (regNo) => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bookings/${regNo}`);
        if (response.status === 200 && response.data) {
          setUserBookings(prevBookings => ({
            ...prevBookings,
            [regNo]: response.data.roomNo,
          }));
          console.log(`Booking fetched for ${regNo}:`, response.data); // Add this log
        } else {
          console.error('Unexpected API response:', response);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setUserBookings(prevBookings => ({
            ...prevBookings,
            [regNo]: 'N/A',
          }));
        } else {
          console.error('Error fetching booking:', error);
        }
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    console.log('User Bookings:', userBookings); // Add this log to verify user bookings
  }, [userBookings]);

  const handleModify = (user) => {
    setSelectedUser(user);
    setOpen(true);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCancelRoom = async (regNo) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/bookings/${regNo}`);
      if (response.status === 200) {
        setUserBookings(prevBookings => ({
          ...prevBookings,
          [regNo]: 'N/A',
        }));
      } else {
        console.error('Error canceling room:', response);
      }
    } catch (error) {
      console.error('Error canceling room:', error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  // Filter users based on search query from SearchContext
  const filteredUsers = users.filter(user =>
    user.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${user.firstName} ${user.initial} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Reg No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Room No</TableCell>
              <TableCell>Modify</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Cancel Room</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Array.isArray(filteredUsers) && filteredUsers.map((user, index) => (
              <TableRow key={user._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{user.regNo}</TableCell>
                <TableCell>{`${user.firstName} ${user.initial} ${user.lastName}`}</TableCell>
                <TableCell>{userBookings[user.regNo] || 'N/A'}</TableCell> {/* Ensure roomNo is displayed */}
                <TableCell>
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="primary"
                    onClick={() => handleModify(user)}
                    startIcon={<EditIcon />}
                  >
                    MODIFY
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton
                    sx={{ margin: 1 }}
                    color="secondary"
                    onClick={() => handleDelete(user._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <Button
                    sx={{ margin: 1 }}
                    variant="contained"
                    color="warning"
                    onClick={() => handleCancelRoom(user.regNo)}
                    startIcon={<CancelIcon />}
                  >
                    CANCEL
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {selectedUser && (
        <EditUser
          open={open}
          handleClose={handleClose}
          user={selectedUser}
          setUsers={setUsers}
        />
      )}
    </>
  );
};

export default AllUsers;
