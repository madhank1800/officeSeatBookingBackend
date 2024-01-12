const express=require('express');
const {
  createProduct,
  getaProduct,
  getAllProucts,
  updateProduct,
  deleteProduct,
  addToWishlist,
  rating,
} = require("../controllers/productCtrl");
const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();
authMiddleWare
router.post('/',authMiddleWare ,isAdmin,createProduct);
router.put('/:id', authMiddleWare, isAdmin, updateProduct);
router.put("/rating",authMiddleWare, rating);
router.get('/:id',getaProduct);
router.get('/',getAllProucts);
router.delete('/:id',authMiddleWare ,isAdmin,deleteProduct);
router.put("/wishlist", addToWishlist);
module.exports=router;
