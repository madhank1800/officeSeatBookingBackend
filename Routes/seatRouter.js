const express=require('express');

const {createSeat,getaSeat,getallSeats,updateSeat,deleteSeat}=require('../controllers/seatCtrl');

const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();


router.post('/',authMiddleWare ,isAdmin,createSeat);
router.put('/:id', authMiddleWare, isAdmin, updateSeat);

router.get('/:id',getaSeat);
router.get('/',getallSeats);
router.delete('/:id',authMiddleWare ,isAdmin,deleteSeat);


module.exports=router;
