
const asyncHandler = require('express-async-handler');
const Product=require('../models/productModel');
const slugify=require('slugify');


//create a product
const createProduct=asyncHandler(async(req,res)=>{

    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title);
        }
    const  newProduct=await Product.create(req.body);
     res.json(newProduct);
    }
    catch(error){
        throw new Error(error);
    }
});



//get a product

const getaProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    try{
    const findProduct=await Product.findById(id);


    res.json(findProduct);
    }catch(error){
        throw new Error(error);
    }
});



//get all products

const getAllProucts =asyncHandler(async(req,res)=>{
    try{
   const findAllProducts= await Product.find();

//const findAllProducts=await Product.where('category').equals('req.query.category');
//const findAllProducts=await Product.find({
   //brand:req.query.brand,
   //category:req.query.category
//});

   res.json(findAllProducts);
    }catch(error){
        throw new Error(error);
    }
});

//update products
const updateProduct = asyncHandler(async (req,res)=>{

    const {id}=req.params;
    try{
    if(req.body.title){
        req.body.slug=slugify(req.body.title);
    }
    // const updateProduct =await Product.findOneAndUpdate({id},req.body,{
    //     new:true
    // })
   
    const updatedProduct =await Product.findOneAndUpdate({_id:id},{$set:{
        title:req.body.title,
        slug:slugify(req.body.title)
    }},{
        new:true
    })
    res.json(updatedProduct);
   

    }catch(error){
   throw new Error(error);
    }
    

    })

    

// delete a product
const deleteProduct = asyncHandler(async (req,res)=>{

    const {id}=req.params;
    try{
    const deletedProduct =await Product.findByIdAndDelete(id);
    res.json(deletedProduct);
    }catch(error){
   throw new Error(error);
    }
    });


module.exports={createProduct,getaProduct,getAllProucts,updateProduct,deleteProduct}