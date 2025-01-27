const express=require('express');

const {createBooking}=require('../controllers/bookingCtrl');

const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();


router.post('/',authMiddleWare,createBooking);




module.exports=router;