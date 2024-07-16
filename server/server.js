const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User');
const Admin = require('./models/Admin');
const Room = require('./models/Room');
const Booking = require('./models/Booking');
const PayDetails = require('./models/PayDetails');

const app = express();

// Enable CORS
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/hostel', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected To MongoDB Sucessfully!'))
  .catch(err => console.log('MongoDB connection error:', err));

// Middleware to parse JSON
app.use(express.json());

// JWT secret key
const jwtSecret = 'your_jwt_secret_key';

// Middleware to authenticate JWT token
const authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Auth Error: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Auth Error: Invalid token format' });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (e) {
    console.error('JWT verification error:', e);
    res.status(500).json({ message: 'Invalid Token' });
  }
};

// User login
app.post('/api/user/login', async (req, res) => {
  const { regNo, password } = req.body;

  try {
    const user = await User.findOne({ regNo });
    if (!user || user.role !== 'user') {
      return res.status(400).json('User not found or role mismatch');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '1h' });
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});

app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.role !== 'admin') {
      return res.status(400).json('Admin not found or role mismatch');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json('Invalid credentials');
    }

    const token = jwt.sign({ id: admin._id, role: admin.role, username: admin.username }, jwtSecret, { expiresIn: '1h' });
    res.json({ token, role: admin.role, username: admin.username });
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});

// Add a new room (Protected route)
app.post('/api/rooms', authenticateJWT, async (req, res) => {
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

// Update a room (Protected route)
app.put('/api/rooms/:id', authenticateJWT, async (req, res) => {
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

// Delete a room (Protected route)
app.delete('/api/rooms/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await Room.findByIdAndDelete(id);
    res.json('Room deleted!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Admin creates a new user (Protected route)
app.post('/api/admin/create-user', authenticateJWT, async (req, res) => {
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

// Fetch all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Update a user
app.put('/api/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});

// Delete a user
app.delete('/api/users/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json('User deleted!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Add booking
app.post('/api/bookings', async (req, res) => {
  const { regNo, roomNo, dateOfBooking, payment } = req.body;

  try {
    const newBooking = new Booking({ regNo, roomNo, dateOfBooking, payment });
    await newBooking.save();
    res.status(201).json('Booking added!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Fetch booking details by user's registration number (regNo)
app.get('/api/bookings/:regNo', async (req, res) => {
  const { regNo } = req.params;

  try {
    const booking = await Booking.findOne({ regNo }).populate('roomNo').populate('regNo');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});

// Add payment details
app.post('/api/payDetails', async (req, res) => {
  const { roomNo, regNo, paidAmt } = req.body;

  try {
    const room = await Room.findOne({ roomNo });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const totalAmt = room.price;
    const dueAmt = totalAmt - parseFloat(paidAmt);

    const newPayDetails = new PayDetails({
      roomNo,
      regNo,
      totalAmt,
      paidAmt: parseFloat(paidAmt),
      dueAmt,
    });

    await newPayDetails.save();
    res.status(201).json('Payment details added!');
  } catch (err) {
    res.status(400).json('Error: ' + err.message);
  }
});

// Fetch dashboard data
app.get('/api/dashboard-data', async (req, res) => {
  try {
    const residence = await User.countDocuments({});
    const rooms = await Room.countDocuments({});
    const totalCapacity = await Room.aggregate([{ $group: { _id: null, total: { $sum: "$roomCapacity" } } }]);
    const totalBookings = await Booking.countDocuments({});
    const vacancy = totalCapacity[0].total - totalBookings;

    const data = {
      residence,
      rooms,
      totalCapacity: totalCapacity[0].total,
      vacancy,
    };

    res.json(data);
  } catch (err) {
    res.status(500).json('Error fetching dashboard data: ' + err.message);
  }
});

app.get('/api/bookings/:regNo', async (req, res) => {
  const { regNo } = req.params;

  try {
    const booking = await Booking.findOne({ regNo });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});

// Cancel a booking
app.delete('/api/bookings/:regNo', async (req, res) => {
  const { regNo } = req.params;

  try {
    const booking = await Booking.findOneAndDelete({ regNo });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking canceled' });
  } catch (err) {
    res.status(500).json('Error: ' + err.message);
  }
});

app.get('/api/student-details/:regNo', async (req, res) => {
  const { regNo } = req.params;

  try {
    const user = await User.findOne({ regNo });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const booking = await Booking.findOne({ regNo });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const room = await Room.findOne({ roomNo: booking.roomNo });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const payDetails = await PayDetails.findOne({ regNo });
    if (!payDetails) {
      return res.status(404).json({ message: 'Payment details not found' });
    }

    const details = {
      user,
      room,
      payDetails
    };

    res.json(details);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching details: ' + err.message });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
