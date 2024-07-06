import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper
} from '@mui/material';
import axios from 'axios';

const AddRoom = () => {
  const [roomNo, setRoomNo] = useState('');
  const [roomType, setRoomType] = useState('');
  const [roomCapacity, setRoomCapacity] = useState('');
  const [floor, setFloor] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const roomData = {
      roomNo,
      roomType,
      roomCapacity,
      floor,
      price,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/rooms', roomData);
      console.log(response.data);
      alert('Room added successfully!');
    } catch (error) {
      console.error('There was an error adding the room!', error);
      alert('Failed to add room!');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add Rooms
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Room No"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            required
          />
          <TextField
            select
            label="Room Type"
            value={roomType}
            onChange={(e) => setRoomType(e.target.value)}
            required
          >
            <MenuItem value="Single">Single</MenuItem>
            <MenuItem value="Double">Double</MenuItem>
            <MenuItem value="Suite">Suite</MenuItem>
          </TextField>
          <TextField
            label="Room Capacity"
            type="number"
            value={roomCapacity}
            onChange={(e) => setRoomCapacity(e.target.value)}
            required
          />
          <TextField
            label="Floor"
            type="number"
            value={floor}
            onChange={(e) => setFloor(e.target.value)}
            required
          />
          <TextField
            label="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddRoom;
