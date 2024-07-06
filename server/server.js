const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User'); // Ensure this path is correct
const Admin = require('./models/Admin'); // Ensure this path is correct
const Room = require('./models/Room'); // Ensure this path is correct

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hostel', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Middleware to parse JSON
app.use(express.json());



// User login
app.post('/api/user/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.role !== 'user') return res.status(400).json('User not found or role mismatch');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json('Invalid credentials');

    const token = jwt.sign({ id: user._id, role: user.role }, 'jwtSecret', { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});

// Admin login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.role !== 'admin') return res.status(400).json('Admin not found or role mismatch');

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json('Invalid credentials');

    const token = jwt.sign({ id: admin._id, role: admin.role }, 'jwtSecret', { expiresIn: '1h' });
    res.json({ token, role: admin.role });
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});



// Add a new room
app.post('/api/rooms', async (req, res) => {
  const { roomNo, roomType, roomCapacity, floor, price } = req.body;

  try {
    const newRoom = new Room({ roomNo, roomType, roomCapacity, floor, price });
    await newRoom.save();
    res.status(201).json('Room added!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Fetch all rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// Update a room
app.put('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;
  const { roomNo, roomType, roomCapacity, floor, price } = req.body;

  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { roomNo, roomType, roomCapacity, floor, price },
      { new: true }
    );
    res.json(updatedRoom);
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Delete a room
app.delete('/api/rooms/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Room.findByIdAndDelete(id);
    res.json('Room deleted!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Admin creates a new user
app.post('/api/admin/create-user', async (req, res) => {
  const { firstName, initial, lastName, phoneNo, email, dateOfBirth, course, year, dateOfJoining, address, gender, regNo, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName, initial, lastName, phoneNo, email, dateOfBirth, course, year, dateOfJoining, address, gender, regNo,
      password: hashedPassword,
      role: 'user' // Default role set to 'user'
    });

    await newUser.save();
    res.status(201).json('User registered!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Server is running on port ${PORT});
});