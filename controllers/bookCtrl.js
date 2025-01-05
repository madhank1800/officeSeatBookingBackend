const asyncHandler = require("express-async-handler");
//const mongoose = require('mongoose');
const  Book=require('../models/bookModel');
const Seating=require('../models/seatingModel');
const User=require('../models/userModel');
const createBook= asyncHandler(async (req, res) => {
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

    const { seatId, bookingDate, startTime, endTime, shift, slot_time } = req.body;


 // Check if the booking already exists for the given seat, date, and time slot
 const existingBooking = await Book.findOne({
    seat: seatId,
    bookingDate: new Date(bookingDate),
    slot_time:slot_time
  });

  console.log("existing" ,existingBooking);
  if (existingBooking) {
    return res.status(400).json({ message: "This seat is already booked for the selected time slot." });
  }


  const currentDate = new Date();
  const dateOnly = currentDate.toISOString().split('T')[0];
    console.log("currentDate",dateOnly);

    if(new Date(req.body.bookingDate) > new Date(dateOnly)){

    const booking = new Book({
        employee: req.user._id,//employeeId, Replace with Employee ObjectId
        seat: req.body.seatId,         // Replace with Seat ObjectId
        bookingDate: new Date(req.body.bookingDate), 
        shiftstartTime: req.body.shiftstartTime,
        shiftendTime: req.body.shiftendTime,
        shift:req.body.shift,
        slot_time:req.body.slot_time
      });
      await booking.save();

     // await booking.save({ session });
    // const book=Booking.create(req.body);
    //res.json(booking);  
    res.status(201).json({ message: "Booking successfully created.", booking });
    }else{
      return   res.status(400).json({ message: "Mentioned booking day is already completed and try new diffrent days"});
    }
    // await session.commitTransaction();
} catch (error) {
    console.log("err",error); 
 // await session.abortTransaction();
 // throw error;
} finally {
 // session.endSession();
}




});


const bookingsOnParticularDay=asyncHandler(async(req,res)=>{

 try{


  const currentDate = new Date();
  const dateOnly = currentDate.toISOString().split('T')[0];
    console.log("currentDate",dateOnly);

console.log("req.body.bookingsOnDay",req.body.bookingsOnDay);
  const requestedDate = req.body.bookingsOnDay;

  // Validate if the requested date is not before the current date
  if (new Date(requestedDate) < new Date(dateOnly)) {
    return res.status(400).json({ message: "Invalid date: Bookings can only be retrieved for future dates." });
  }

  const getSeats = await Seating.find();
      console.log(getSeats);





    //updated code  from
     
    const updateSeatAvailability= (getSeats, bookData)=>{
      // Iterate over bookData to update matching seats in getSeats
               bookData.forEach((booking) => {
                getSeats.forEach((seat) => {
                // Check if the seat in getSeats matches the seat in bookData
                 if (seat.seatNumber === booking.seat.seatNumber) {
            // Update all matching slot_time values in availability array
                   seat.availability.forEach((slot) => {
                    if (slot.slot_time === booking.slot_time) {
                slot.isAvailable = false; // Set isAvailable to false
              }
            });
          }
        });
      });
      
               return getSeats; // Return the updated seats data
                     
                      }

           


      if(req.body.bookingsOnDay===dateOnly){
       
     
     
          const bookData=await Book.find({ 
           
           "bookingDate": { $eq:dateOnly}, // Filter by date
     
           //"startTime": { $gte: shiftStart.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift start
          // "endTime": { $lte: shiftEnd.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift end
                
           //"startTime":{$eq:'10:00'}
           }).populate('seat');
          console.log("book",bookData);
     
     
            if(bookData.length!=0){
               const updatedSeats =await updateSeatAvailability(getSeats, bookData);
             console.log(updatedSeats);
     
     
          res.status(200).json({ message: "sucess1", updatedSeats });
            }else{
              
          res.status(200).json({ message: "sucess2", getSeats });
            }

      }else{


        const bookData=await Book.find({ 
           
          "bookingDate": { $eq:requestedDate}, // Filter by date
    
          //"startTime": { $gte: shiftStart.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift start
         // "endTime": { $lte: shiftEnd.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift end
               
          //"startTime":{$eq:'10:00'}
          }).populate('seat');
         console.log("book",bookData);
         console.log("book1",bookData.length);
    
         if(bookData.length !=0){
          const updatedSeats =await updateSeatAvailability(getSeats, bookData);
          console.log("updatedSeats",updatedSeats);
          
        res.status(200).json({ message: "sucess3", updatedSeats });
         }else{
          res.status(200).json({ message: "sucess4", getSeats });
         }
    
             

      }

 }catch(error){
  throw new Error(error);
 }


})






const cancelBooking=asyncHandler(async(req,res)=>{
  const { employee, seat, bookingDate, slot_time } = req.body;

  try{
     
   
  const currentDate = new Date();
  const dateOnly = currentDate.toISOString().split('T')[0];
    console.log("currentDate",dateOnly);

 // Ensure all required fields are provided
 if (!employee || !seat || !bookingDate || !slot_time) {
  return res.status(400).json({ message: "All fields are required." });
}


if(new Date(bookingDate)> new Date(dateOnly)){
// Delete the record matching the criteria
const deletedBooking = await Book.findOneAndDelete({
  employee:employee,
  seat:seat,
  slot_time:slot_time,
  bookingDate:bookingDate,
});

if (!deletedBooking) {
  return res.status(404).json({ message: "No matching booking found." });
}

res.status(200).json({
  message: "Booking canceled successfully.",
  deletedBooking, 
});

}else{
  return res.status(200).json({ message: "canceling can be possible before booking day." });
}



    
  }catch(error){
    throw new Error(error);
  }


})





module.exports = {
    createBook,bookingsOnParticularDay,cancelBooking


}