import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Modal, Box, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [regNo, setRegNo] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/rooms');
        setRooms(response.data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast.error('Failed to fetch rooms');
      }
    };
    fetchRooms();
  }, []);

  const handleBook = (room) => {
    setSelectedRoom(room);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRoom(null);
    setRegNo('');
    setAmount('');
  };

  const handleSubmit = async () => {
    if (!selectedRoom) return;

    try {
      const bookingPayload = {
        regNo,
        roomNo: selectedRoom.roomNo,
        dateOfBooking: new Date(),
        payment: amount
      };

      await axios.post('http://localhost:5000/api/bookings', bookingPayload);

      const paymentPayload = {
        roomNo: selectedRoom.roomNo,
        regNo,
        paidAmt: amount
      };

      await axios.post('http://localhost:5000/api/payDetails', paymentPayload);

      toast.success('Booking and payment processed successfully');
      handleClose();
    } catch (error) {
      console.error('Error processing booking:', error);
      toast.error('Failed to process booking');
    }
  };

  const handleDelete = async (roomId) => {
    try {
      await axios.delete(`http://localhost:5000/api/rooms/${roomId}`);
      setRooms(rooms.filter(room => room._id !== roomId));
      toast.success('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      toast.error('Failed to delete room');
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Serial No</TableCell>
              <TableCell>Room No</TableCell>
              <TableCell>Floor</TableCell>
              <TableCell>Room Type</TableCell>
              <TableCell>Vacancy</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Book</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room, index) => (
              <TableRow key={room._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{room.roomNo}</TableCell>
                <TableCell>{room.floor}</TableCell>
                <TableCell>{room.roomType}</TableCell>
                <TableCell>{room.roomCapacity}</TableCell>
                <TableCell>{room.price}</TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => handleBook(room)}>
                    Book
                  </Button>
                </TableCell>
                <TableCell>
                  <IconButton color="secondary" onClick={() => handleDelete(room._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          <h2>Book Room {selectedRoom?.roomNo}</h2>
          <TextField
            label="Reg No"
            value={regNo}
            onChange={(e) => setRegNo(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" color="primary" onClick={handleSubmit} fullWidth>
            Confirm Booking
          </Button>
        </Box>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default Rooms;
