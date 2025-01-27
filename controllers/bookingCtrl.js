const asyncHandler = require("express-async-handler");

const  Booking=require('../models/bookingModel');


const createBooking= asyncHandler(async (req, res) => {

     console.log("nssn",req.body);




try {

  

    const booking = new Booking({
        employee: req.user._id,
        seat: req.body.seatId,        
        bookingDate: new Date('2024-12-29'), 
        startTime: '08:00',
        endTime: '23:00',
        shift:'morning'
      });
      await booking.save();

    
    res.json(booking);  


} catch (error) {
    console.log("err",error); 

} finally {

}




});







module.exports = {
    createBooking


}