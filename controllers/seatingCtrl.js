const asyncHandler = require("express-async-handler");
const Book=require('../models/bookModel')
const Seating=require('../models/seatingModel');

const createSeating = asyncHandler(async (req, res) => {
  try {
   
    const newProduct = await Seating.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});





const getallSeats = asyncHandler(async (req, res) => {
  try {
    const getSeats = await Seating.find();
    console.log(getSeats);


     const currentDate = new Date();
     const dateOnly = currentDate.toISOString().split('T')[0];
       console.log("currentDate",dateOnly);



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


     const bookData=await Book.find({ 
      
      "bookingDate": { $eq:dateOnly}, 

     
      }).populate('seat');
     console.log("book",bookData);



          const updatedSeats =await updateSeatAvailability(getSeats, bookData);
        console.log(updatedSeats);


     res.status(200).json({ message: "sucess", updatedSeats });


  

























  } catch (error) {
    throw new Error(error);
  }

  
});










module.exports = {
    createSeating,getallSeats


}