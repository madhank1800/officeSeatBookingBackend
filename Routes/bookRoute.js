const express=require('express');

const {createBook,bookingsOnParticularDay,cancelBooking,getEmployeeBooking}=require('../controllers/bookCtrl');

const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();


router.post('/seat',authMiddleWare,createBook);
router.post('/bookingsOnDay',authMiddleWare,bookingsOnParticularDay);
router.post('/getEmployeeOrders',authMiddleWare,getEmployeeBooking);

router.delete('/cancelbooking',authMiddleWare,cancelBooking);


module.exports=router;              