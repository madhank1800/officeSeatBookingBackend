const asyncHandler = require("express-async-handler");
const Seat=require('../models/seatModel');
const Booking=require('../models/bookingModel');


const createSeat = asyncHandler(async (req, res) => {
  try {
   
    const newProduct = await Seat.create(req.body);
    res.json(newProduct);
  } catch (error) {
    throw new Error(error);
  }
});


const getaSeat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const findSeat = await Seat.findById(id);

    res.json(findSeat);
  } catch (error) {
    throw new Error(error);
  }
});



const getallSeats = asyncHandler(async (req, res) => {
  try {
    const getSeats = await Seat.find();
    console.log(getSeats);



     const currentDate = new Date();
     const dateOnly = currentDate.toISOString().split('T')[0];
       console.log("currentDate",dateOnly);


  

     const seatsOnDay=await Booking.find({ 
      
      "bookingDate": { $eq:dateOnly}, 

      }).populate('seat');
     console.log("book",seatsOnDay);


     









if(seatsOnDay.length!==0){


const bookedSeatsWithShifts = seatsOnDay.map((booking) => {
  return {
    ...booking.seat.toObject(),
    isAvailable: false, 
    shiftStartTime: booking.startTime,
    shiftEndTime: booking.endTime,
  };
});


const combinedSeats = [
  ...getSeats.map((seat) => {
    const isBooked = bookedSeatsWithShifts.some(
      (bookedSeat) => bookedSeat._id.toString() === seat._id.toString()
    );
    if (!isBooked) {
      return { ...seat.toObject(), isAvailable: true };
    }
    return null; 
  }).filter(Boolean), 
  ...bookedSeatsWithShifts,
];

   res.json(combinedSeats);


}else{
  res.json(getSeats);

}
























  } catch (error) {
    throw new Error(error);
  }
});





const updateSeat = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {



    const updatedSeat = await Seat.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          seatNumber: req.body.seatNumber,
         
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