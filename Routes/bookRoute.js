const express=require('express');

const {createBook,bookingsOnParticularDay,cancelBooking}=require('../controllers/bookCtrl');

const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();


router.post('/',authMiddleWare,createBook);
router.post('/bookingsOnDay',authMiddleWare,bookingsOnParticularDay);

router.delete('/cancelbooking',authMiddleWare,cancelBooking);
// router.put('/:id', authMiddleWare, isAdmin, updateSeat);

// router.get('/:id',getaSeat);
// router.get('/',getallSeats);
// router.delete('/:id',authMiddleWare ,isAdmin,deleteSeat);


module.exports=router;