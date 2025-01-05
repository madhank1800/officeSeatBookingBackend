


const updateSeatAvailability= async(getSeats, bookData)=>{
 // Create a map to group bookings by seat ID and slot time for quick lookup
 const bookingsMap = new Map();
  
 bookData.forEach(({ seat, slot_time }) => {
   if (!bookingsMap.has(seat._id)) {
     bookingsMap.set(seat._id, new Set());
   }
   bookingsMap.get(seat._id).add(slot_time);
 });

 // Update getSeats data based on the bookingsMap
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