


const updateSeatAvailability= async(getSeats, bookData)=>{

 const bookingsMap = new Map();
  
 bookData.forEach(({ seat, slot_time }) => {
   if (!bookingsMap.has(seat._id)) {
     bookingsMap.set(seat._id, new Set());
   }
   bookingsMap.get(seat._id).add(slot_time);
 });


 getSeats.forEach((seat) => {
   if (bookingsMap.has(seat._id)) {
     const bookedSlots = bookingsMap.get(seat._id);

     seat.availability.forEach((slot) => {
       if (bookedSlots.has(slot.slot_time)) {
         slot.isAvailable = false;
       }
     });
   }
 });

 return getSeats;

}

module.exports={updateSeatAvailability}