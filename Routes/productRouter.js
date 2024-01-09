const express=require('express');
const { createProduct ,getaProduct,getAllProucts,updateProduct,deleteProduct} = require('../controllers/productCtrl');
const { authMiddleWare ,isAdmin} = require('../middlewares/authMiddleware');
const router=express();
authMiddleWare
router.post('/',authMiddleWare ,isAdmin,createProduct);
router.put('/:id',authMiddleWare ,isAdmin,updateProduct);
router.get('/:id',getaProduct);
router.get('/',getAllProucts);
router.delete('/:id',authMiddleWare ,isAdmin,deleteProduct);

module.exports=router;
