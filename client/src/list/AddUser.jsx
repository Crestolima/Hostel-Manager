import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  MenuItem,
  Select
} from '@mui/material';
import axios from 'axios';

const AddUser = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    initial: '',
    lastName: '',
    phoneNo: '',
    email: '',
    dateOfBirth: '',
    course: '',
    year: '',
    dateOfJoining: '',
    address: '',
    gender: '',
    regNo: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/admin/create-user', formData);
      console.log(response.data);
      alert('User added successfully!');
    } catch (error) {
      console.error('There was an error adding the user!', error);
      alert('Failed to add user!');
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Add User
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Initial"
            name="initial"
            value={formData.initial}
            onChange={handleChange}
            required
          />
          <TextField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          <TextField
            label="Phone Number"
            name="phoneNo"
            value={formData.phoneNo}
            onChange={handleChange}
            required
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControl required>
            <FormLabel>Gender</FormLabel>
            <RadioGroup
              row
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel value="female" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>
          <FormControl required>
            <FormLabel>Course</FormLabel>
            <Select
              name="course"
              value={formData.course}
              onChange={handleChange}
            >
              <MenuItem value="Computer Science">Computer Science</MenuItem>
              <MenuItem value="Electrical Engineering">Electrical Engineering</MenuItem>
              <MenuItem value="Mechanical Engineering">Mechanical Engineering</MenuItem>
              <MenuItem value="Civil Engineering">Civil Engineering</MenuItem>
              <MenuItem value="Business Administration">Business Administration</MenuItem>
            </Select>
          </FormControl>
          <FormControl required>
            <FormLabel>Year</FormLabel>
            <Select
              name="year"
              value={formData.year}
              onChange={handleChange}
            >
              <MenuItem value="1">1</MenuItem>
              <MenuItem value="2">2</MenuItem>
              <MenuItem value="3">3</MenuItem>
              <MenuItem value="4">4</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Date of Joining"
            name="dateOfJoining"
            type="date"
            value={formData.dateOfJoining}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
          <TextField
            label="Registration Number"
            name="regNo"
            value={formData.regNo}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Add User
          </Button>
        </Box>
      </form>
    </Paper>
  );
};

export default AddUser;
