const User=require('../models/userModel');
const jwt=require('jsonwebtoken');
const asyncHandler=require('express-async-handler');

const authMiddleWare=asyncHandler(async(req,res,next)=>{

    let token;
    if(req?.headers?.authorization?.startsWith('Bearer')){
        token=req.headers.authorization.split(" ")[1];
        try{


            if(token){
                const decoded=jwt.verify(token,process.env.SECRET_KEY);
                console.log("..////=",decoded);
                const user=await User.findById(decoded?.id);
                console.log("user",user);
                req.user=user;
                console.log("us",req.user);
                next();
            }
        }catch(error){
            throw new Error("not authorized token expired,please login again");
        }
    }else{
        throw new Error("there is no token attached to header");
    }
})


const isAdmin=asyncHandler(async(req,res,next)=>{
  const {email}=req.user;
  const adminUser=await User.findOne({email});
  console.log("adminUser",adminUser);
  if(adminUser.role!=="admin"){
  throw new Error("you are not a admin");
  }else{
    next();
  }
 

})

module.exports={authMiddleWare,isAdmin}