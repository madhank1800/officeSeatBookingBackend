
const { generateToken } = require('../config/jwtToken');
const User=require('../models/userModel');
const asyncHandler = require('express-async-handler');

const {validateMongodbId}=require('../utils/validateMongodbId');
const { generateRefreshToken } = require('../config/refreshToken');
const  jwt  = require('jsonwebtoken');
const  createUSer= asyncHandler( async (req,res)=>
{

   const email=req.body.email;
    
   const findUser=await User.findOne({email:email});

   if(!findUser){
//create a new user
   const newUser=await User.create(req.body);
   res.json(newUser);
   }else{
    throw new Error("user not existed");
   }

})




//login functionality
const loginUserCtrl= asyncHandler( async (req,res)=>{
const {email,password}=req.body;
//check if user exist or not

const findUser=await User.findOne({email});
if(findUser && await findUser.isPasswordMatched(password)){
   const refreshToken= await generateRefreshToken(findUser?._id);
   const updateuser=await User.findByIdAndUpdate(findUser.id,{
      refreshToken:refreshToken
   },{new:true});
   res.cookie("refreshToken",refreshToken,{
      httpOnly:true,
      maxAge:72*60*60*1000
   })
   res.json({
      _id:findUser?._id,
      firstname:findUser?.firstname,
      lastname:findUser?.lastname,
      email:findUser?.email,
      mobile:findUser?.mobile,
      token:generateToken(findUser?._id)

      
   });
}else{
   throw new Error("Invalid Credentials");
}


}
)


//handle refresh token

const handlerefreshToken=asyncHandler(async(req,res)=>{
   const cookie=req.cookies;
   console.log("test:-",cookie);
   if(!cookie?.refreshToken) throw new Error("no refresh token in cookies");
   const refreshToken=cookie.refreshToken;
   console.log("refreshtoken",refreshToken);
  const user= await User.findOne({refreshToken});
  console.log("user1",user);
  if(!user) throw new Error("NO refrsh token present in db or not matched");
  
jwt.verify(refreshToken,process.env.SECRET_KEY,(err,decoded)=>{
   console.log("decoded:",decoded)
   if(err&& user._id!==decoded.id){
      throw new Error("There is something wrong with refresh token");
   }

   const accessToken=generateToken(user?._id);
   res.json({accessToken});
})

})




//log out functionality

const logout=asyncHandler(async(req,res)=>{
   const cookie=req.cookies;
if(!cookie?.refreshToken) throw new Error("no refresh token in cookies");
const refreshToken=cookie.refreshToken;
const user=await User.findOne({refreshToken});
console.log("usss:",user);
if(!user){
   res.clearCookie("refreshToken",{
      httpOnly:true,
      secure:true
   });
  return res.sendStatus(204);
}

// await User.findOneAndUpdate(refreshToken,{
//    refreshToken:""
// });

await User.findOneAndUpdate( { refreshToken: refreshToken },
   { $set: { refreshToken: "" } },
   { new: true });

res.clearCookie("refreshToken",{
   httpOnly:true,
   secure:true
});
 res.sendStatus(204);

});





//get-all users
const getallUsers=asyncHandler(async(req,res)=>{
   try{

      const getUsers=await User.find();
      res.json(getUsers);

   }catch(error){
  throw new Error(error);
   }


})





// get a user by Id
const getaUser=asyncHandler(async(req,res)=>{
  // console.log(req.params);
  console.log("madhan kumar madhan kumar");
   const {id}=req.params;
   validateMongodbId(id);
   try{
   const getuser=await User.findById(id);
res.json(
   getuser
)
   }catch(error){
      throw new Error(error);
   }
})



//delete a user by id
const deleteUser=asyncHandler(async(req,res)=>{
   const {id}=req.params;
   validateMongodbId(id);
   try{
      const deleteuser=await User.findByIdAndDelete(id);
      res.json({deleteuser});

   }catch(error){
      throw new Error(error);
   }
})



//update a user by id

const updatedUser=asyncHandler(async(req,res)=>{
  // const {id}=req.params;
  const {_id}=req.user;
  validateMongodbId(_id);
   try{
const updateuser=await User.findByIdAndUpdate(_id,{
   firstname:req?.body?.firstname,
   lastname:req?.body?.lastname,
   email:req?.body?.email,

   mobile:req?.body?.mobile
},

{
   new:true
}
)
res.json(updateuser);
   }catch(error){
      throw new Error(error);
   }
})



const blockUser=asyncHandler(async(req,res)=>{
   
   const {id}=req.params;
   validateMongodbId(id);
   try{
const block=await User.findByIdAndUpdate(id,{
   isBlocked:true
},{
   new:true
})
   }catch(error){
      throw new Error(error);
   }
res.json({
   message:"user Blocked"
});

})


const unblockUser=asyncHandler(async(req,res)=>{
   const {id}=req.params;
   validateMongodbId(id);
   try{
const block=await User.findByIdAndUpdate(id,{
   isBlocked:false
},{
   new:true
})
   }catch(error){
      throw new Error(error);
   }

   res.json({
      message:"user Blocked"
   });
})



module.exports={createUSer,loginUserCtrl,getallUsers,getaUser,deleteUser,updatedUser,blockUser,unblockUser,handlerefreshToken,logout};