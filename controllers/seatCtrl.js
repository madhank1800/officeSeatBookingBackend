const asyncHandler = require("express-async-handler");
const Seat=require('../models/seatModel');
const Booking=require('../models/bookingModel');

//create a product
const createSeat = asyncHandler(async (req, res) => {
  try {
    // if (req.body.title) {
    //   req.body.slug = slugify(req.body.title);
    // }
    const newProduct = await Seat.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});


//get a seat
const getaSeat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findSeat = await Seat.findById(id);

    res.json(findSeat);
  } catch (error) {
    throw new Error(error);
  }
});


// get all seats
const getallSeats = asyncHandler(async (req, res) => {
  try {
    const getSeats = await Seat.find();
    console.log(getSeats);



     // Get the current date and time
     const currentDate = new Date();
     const dateOnly = currentDate.toISOString().split('T')[0];
       console.log("currentDate",dateOnly);


  

     const seatsOnDay=await Booking.find({ 
      
      "bookingDate": { $eq:dateOnly}, // Filter by date

      //"startTime": { $gte: shiftStart.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift start
     // "endTime": { $lte: shiftEnd.toLocaleTimeString('en-US', { hour12: false }) }, // Filter by shift end
           
      //"startTime":{$eq:'10:00'}
      }).populate('seat');
     console.log("book",seatsOnDay);


      // // Map of booked seat IDs for quick lookup
      // const bookedSeatIds = new Set(seatsOnDay.map((booking) => booking.seat._id.toString()));

      // // Update availability in getSeats
      // const updatedSeats = getSeats.map((seat) => {
      //   if (bookedSeatIds.has(seat._id.toString())) {
      //     return { ...seat.toObject(), isAvailable: false }; // Mark booked seats as unavailable
      //   }
      //   return { ...seat.toObject(), isAvailable: true }; // Ensure unbooked seats remain available
      // });
  
      // console.log("updated seats",updatedSeats)
      // res.json(updatedSeats);









if(seatsOnDay.length!==0){



// Transform `seatsOnDay` to include shift details
const bookedSeatsWithShifts = seatsOnDay.map((booking) => {
  return {
    ...booking.seat.toObject(),
    isAvailable: false, // Mark as unavailable
    shiftStartTime: booking.startTime,
    shiftEndTime: booking.endTime,
  };
});

// Combine normal seats with booked seats (with shift details)
const combinedSeats = [
  ...getSeats.map((seat) => {
    const isBooked = bookedSeatsWithShifts.some(
      (bookedSeat) => bookedSeat._id.toString() === seat._id.toString()
    );
    if (!isBooked) {
      return { ...seat.toObject(), isAvailable: true };
    }
    return null; // Exclude seats already accounted for in bookings
  }).filter(Boolean), // Remove null entries
  ...bookedSeatsWithShifts,
];

   res.json(combinedSeats);


}else{
  res.json(getSeats);

}
























    //res.json(getSeats);
  } catch (error) {
    throw new Error(error);
  }
});





//update products
const updateSeat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {


    // if (req.body.title) {
    //   req.body.slug = slugify(req.body.title);
    // }


    // const updateProduct =await Product.findOneAndUpdate({id},req.body,{
    //     new:true
    // })

    const updatedSeat = await Seat.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          seatNumber: req.body.seatNumber,
          //slug: slugify(req.body.title),
        },
      },
      {
        new: true,
      }
    );
    res.json(updatedSeat);
  } catch (error) {
    throw new Error(error);
  }
});





// delete a product
const deleteSeat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const deletedSeat = await Seat.findByIdAndDelete(id);
    res.json(deletedSeat);
  } catch (error) {
    throw new Error(error);
  }
});




module.exports = {
    createSeat,getaSeat,getallSeats,updateSeat,deleteSeat


}