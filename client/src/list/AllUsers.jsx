import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users');
      if (response.status === 200 && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error('Unexpected API response:', response);
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };
  fetchUsers();
}, []);

  const handleModify = (userId) => {
    // Implement user modification logic here
    console.log(`Modify user: ${userId}`);
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleCancelRoom = (userId) => {
    // Implement room cancellation logic here
    console.log(`Cancel room for user: ${userId}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Serial No</TableCell>
            <TableCell>Reg No</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Modify</TableCell>
            <TableCell>Delete</TableCell>
            <TableCell>Cancel Room</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Array.isArray(users) && users.map((user, index) => (
            <TableRow key={user._id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{user.regNo}</TableCell>
              <TableCell>{`${user.firstName} ${user.initial} ${user.lastName}`}</TableCell>
              <TableCell>{user.room || 'N/A'}</TableCell>
              <TableCell>
                <Button
                  sx={{ margin: 1 }}
                  variant="contained"
                  color="primary"
                  onClick={() => handleModify(user._id)}
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
                  onClick={() => handleCancelRoom(user._id)}
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
  );
};

export default AllUsers;
