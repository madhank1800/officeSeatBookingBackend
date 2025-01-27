const mongoose = require('mongoose');

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
  
  },
  shiftendTime: { 
    type: String, 
     
  },
  shift:{
    type:String,
 
  },
  slot_time:{
type:String,required:true
  },
  seatName:{type:String},
  email:{
    type:String
  },
  firstName:{
type:String
  },
  lastName:{
    type:String
  },
  createdAt: { type: Date, default: Date.now },
});



module.exports = mongoose.model('Book', BookSchema);
