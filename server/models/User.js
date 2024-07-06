const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true },
  initial: { type: String, trim: true },
  lastName: { type: String, required: true, trim: true },
  phoneNo: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  dateOfBirth: { type: Date, required: true },
  course: { type: String, required: true },
  year: { type: Number, required: true },
  dateOfJoining: { type: Date, required: true },
  address: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  regNo: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' }, // Default role set to 'user'
}, {
  timestamps: true,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
