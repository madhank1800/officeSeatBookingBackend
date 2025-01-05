const asyncHandler = require("express-async-handler");
const Book=require('../models/bookModel')
const Seating=require('../models/seatingModel');
//import { updateSeatAvailability } from "./updateSeatAvailability";
//const updateSeatAvailability=require('./updateSeatAvailability');
//create a product
const createSeating = asyncHandler(async (req, res) => {
  try {
    // if (req.body.title) {
    //   req.body.slug = slugify(req.body.title);
    // }
    const newProduct = await Seating.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});





// get all seats
const getallSeats = asyncHandler(async (req, res) => {
  try {
    const getSeats = await Seating.find();
    console.log(getSeats);



     // Get the current date and time
     const currentDate = new Date();
     const dateOnly = currentDate.toISOString().split('T')[0];
       console.log("currentDate",dateOnly);



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


     const bookData=await Book.find({ 
      
      "bookingDate": { $eq:dateOnly}, // Filter by date

      //"startTime": { $gte: shiftStart.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift start
     // "endTime": { $lte: shiftEnd.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift end
           
      //"startTime":{$eq:'10:00'}
      }).populate('seat');
     console.log("book",bookData);



          const updatedSeats =await updateSeatAvailability(getSeats, bookData);
        console.log(updatedSeats);


     res.status(200).json({ message: "sucess", updatedSeats });



// if(seatsOnDay.length!==0){



// // Transform `seatsOnDay` to include shift details
// const bookedSeatsWithShifts = seatsOnDay.map((booking) => {
//   return {
//     ...booking.seat.toObject(),
//     isAvailable: false, // Mark as unavailable
//     shiftStartTime: booking.startTime,
//     shiftEndTime: booking.endTime,
//   };
// });

// // Combine normal seats with booked seats (with shift details)
// const combinedSeats = [
//   ...getSeats.map((seat) => {
//     const isBooked = bookedSeatsWithShifts.some(
//       (bookedSeat) => bookedSeat._id.toString() === seat._id.toString()
//     );
//     if (!isBooked) {
//       return { ...seat.toObject(), isAvailable: true };
//     }
//     return null; // Exclude seats already accounted for in bookings
//   }).filter(Boolean), // Remove null entries
//   ...bookedSeatsWithShifts,
// ];

//    res.json(combinedSeats);


// }else{
//   res.json(getSeats);

// }
























    //res.json(getSeats);
  } catch (error) {
    throw new Error(error);
  }

  
});










module.exports = {
    createSeating,getallSeats


}