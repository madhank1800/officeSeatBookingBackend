const mongoose = require('mongoose');
//const User=require('./userModel');
//const Seat=require('./seatModel');
const BookingSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  seat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seat', 
    required: true 
  },
  bookingDate: { 
    type: Date, 
   required: true 
  },
  startTime: { 
    type: String, 
    required: true 
  },
  endTime: { 
    type: String, 
    required: true 
  },
  shift:{
    type:String,required:true
  },
  createdAt: { type: Date, default: Date.now },
});

//Ensure no overlapping bookings for the same seat and time slot
BookingSchema.index(
  { seat: 1, date: 1, startTime: 1, endTime: 1,shift:1 },
  { unique: true }
);

// Ensure an employee cannot double-book within overlapping time slots
BookingSchema.index(
  { employee: 1, date: 1, startTime: 1, endTime: 1,shift:1 },
  { unique: true }
);

module.exports = mongoose.model('Booking', BookingSchema);
