const asyncHandler = require("express-async-handler");
//const mongoose = require('mongoose');
const  Book=require('../models/bookModel');
const Seating=require('../models/seatingModel');
const User=require('../models/userModel');
const createBook= asyncHandler(async (req, res) => {
 
     console.log("nssn",req.body);


 



try {
    
  

    const { seatId, bookingDate, startTime, endTime, shift, slot_time } = req.body;


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
        employee: req.user._id,
        seat: req.body.seatId,      
        bookingDate: new Date(req.body.bookingDate), 
        shiftstartTime: req.body.shiftstartTime,
        shiftendTime: req.body.shiftendTime,
        shift:req.body.shift,
        slot_time:req.body.slot_time,
        seatName:req.body.seatName, 
        email:req.body.email,
        firstName:req.body.firstName,
        lastName:req.body.lastName
      });
      await booking.save();

     
    res.status(201).json({ message: "Booking successfully created.", booking });
    }else{
      return   res.status(400).json({ message: "Mentioned booking day is already completed and try new diffrent days"});
    }

} catch (error) {
    console.log("err",error); 

} finally {

}




});


const bookingsOnParticularDay=asyncHandler(async(req,res)=>{

 try{


  const currentDate = new Date();
  const dateOnly = currentDate.toISOString().split('T')[0];
    console.log("currentDate",dateOnly);

console.log("req.body.bookingsOnDay",req.body.bookingsOnDay);
  const requestedDate = req.body.bookingsOnDay;

  if (new Date(requestedDate) < new Date(dateOnly)) {
   return res.status(200).json({ message: "Invalid date: Bookings can only be retrieved for future dates." });
  }

  const getSeats = await Seating.find();
      console.log(getSeats);





     
    const updateSeatAvailability= (getSeats, bookData)=>{
               bookData.forEach((booking) => {
                getSeats.forEach((seat) => {
                
                 if (seat.seatNumber === booking.seat.seatNumber) {
        
                   seat.availability.forEach((slot) => {
                    if (slot.slot_time === booking.slot_time) {
                slot.isAvailable = false; 
              }
            });
          }
        });
      });
      
               return getSeats; 
                     
                      }

           


      if(req.body.bookingsOnDay===dateOnly){
       
     
     
          const bookData=await Book.find({ 
           
           "bookingDate": { $eq:dateOnly}, 
     
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
           
          "bookingDate": { $eq:requestedDate}, 
    
   
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
  console.log("error in booking a day",error);
  throw new Error(error);
 }


})






const cancelBooking=asyncHandler(async(req,res)=>{
  const { employee, seat, bookingDate, slot_time } = req.body;

  try{
     
   
  const currentDate = new Date();
  const dateOnly = currentDate.toISOString().split('T')[0];
    console.log("currentDate",dateOnly);


 if (!employee || !seat || !bookingDate || !slot_time) {
  return res.status(400).json({ message: "All fields are required." });
}


if(new Date(bookingDate)> new Date(dateOnly)){

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


const getEmployeeBooking=asyncHandler(async(req,res)=>{
const booktutu=req.body.employeeDetail;

console.log("booktutu",booktutu);
  try{
   const response =await Book.find({ "employee": { $eq:req.body.employeeDetail},});

     if (!response || response.length === 0) {
      return res.status(200).json({ message: "No bookings found for this employee" });
    }

    res.status(200).json({
      success: true,
      bookings: response,
    });

  





  }catch(error){
    console.log(error);
  }
})




module.exports = {
    createBook,bookingsOnParticularDay,cancelBooking,getEmployeeBooking


}