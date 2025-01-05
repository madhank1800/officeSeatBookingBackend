const express=require('express');

const {createSeating,getallSeats}=require('../controllers/seatingCtrl');

const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();


router.post('/',authMiddleWare ,isAdmin,createSeating);
router.get('/allseats',authMiddleWare,getallSeats);


module.exports=router;
