const asyncHandler = require("express-async-handler");
//const mongoose = require('mongoose');
const  Booking=require('../models/bookingModel');


const createBooking= asyncHandler(async (req, res) => {
    //console.log("us123", req.user);
    //console.log("madhan")
     console.log("nssn",req.body);


// const session = await mongoose.startSession();
// session.startTransaction(); 



try {

    // const existingBooking = await Booking.findOne({
    //   seat: seatId,
    //   date,
    //   $or: [
    //     { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
    //   ],
    // }).session(session);
  
    // if (existingBooking) {
    //   throw new Error('This seat is already booked for the selected time slot.');
    // }


    const booking = new Booking({
        employee: req.user._id,//employeeId, Replace with Employee ObjectId
        seat: req.body.seatId,         // Replace with Seat ObjectId
        bookingDate: new Date('2024-12-29'), 
        startTime: '08:00',
        endTime: '23:00',
        shift:'morning'
      });
      await booking.save();

     // await booking.save({ session });
    // const book=Booking.create(req.body);
    res.json(booking);  


    // await session.commitTransaction();
} catch (error) {
    console.log("err",error); 
 // await session.abortTransaction();
 // throw error;
} finally {
 // session.endSession();
}




});







module.exports = {
    createBooking


}