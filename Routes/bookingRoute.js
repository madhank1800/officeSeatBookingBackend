const express=require('express');

const {createBooking}=require('../controllers/bookingCtrl');

const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();


router.post('/',authMiddleWare,createBooking);


// router.put('/:id', authMiddleWare, isAdmin, updateSeat);

// router.get('/:id',getaSeat);
// router.get('/',getallSeats);
// router.delete('/:id',authMiddleWare ,isAdmin,deleteSeat);


module.exports=router;