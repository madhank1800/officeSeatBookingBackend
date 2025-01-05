const mongoose = require('mongoose');
//const User=require('./userModel');
//const Seat=require('./seatModel');
const BookSchema = new mongoose.Schema({
  employee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  seat: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Seating', 
    required: true 
  },
  bookingDate: { 
    type: Date, 
   required: true 
  },
  shiftstartTime: { 
    type: String, 
    required: true 
  },
  shiftendTime: { 
    type: String, 
    required: true 
  },
  shift:{
    type:String,required:true
  },
  slot_time:{
type:String,required:true
  },
  createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Book', BookSchema);
