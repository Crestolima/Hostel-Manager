const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  regNo: { 
    type: String, 
    required: true, 
    ref: 'User'  // Assuming regNo corresponds to a user's registration number
  },
  roomNo: { 
    type: String, 
    required: true, 
    ref: 'Room'  // Assuming roomNo corresponds to a room's number
  },
  dateOfBooking: { 
    type: Date, 
    default: Date.now 
  },
  payment: { 
    type: String, 
    default: null 
  }
});

module.exports = mongoose.model('Booking', BookingSchema);
