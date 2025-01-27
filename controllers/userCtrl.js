const { generateToken } = require("../config/jwtToken");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const Book=require('../models/bookModel');
const { validateMongodbId } = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshToken");
const jwt = require("jsonwebtoken");
const { emailSender } = require("./emailCtrl");

const createUSer = asyncHandler(async (req, res) => {
  const email = req.body.email;

  const findUser = await User.findOne({ email: email });

  if (!findUser) {

    const newUser = await User.create(req.body);
    res.json(newUser);
  } else {
    throw new Error("user already existed");
  }
});


const loginUserCtrl = asyncHandler(async (req, res) => {
  const { email, password } = req.body;


  const findUser = await User.findOne({ email });
  if (findUser && (await findUser.isPasswordMatched(password))) {
    const refreshToken = await generateRefreshToken(findUser?._id);
    const updateuser = await User.findByIdAndUpdate(
      findUser.id,
      {
        refreshToken: refreshToken,
      },
      { new: true }
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 72 * 60 * 60 * 1000,
    });
    res.json({
      _id: findUser?._id,
      firstname: findUser?.firstname,
      lastname: findUser?.lastname,
      email: findUser?.email,
     
      role:findUser?.role,
      token: generateToken(findUser?._id),
    });
  } else {
    throw new Error("Invalid Credentials");
  }
});



const updatePassword = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { password } = req.body;
  validateMongodbId(_id);
  const user = await User.findById(_id);
  if (password) {
    user.password = password;
    console.log("pass", user.password);
    const updatedPassword = await user.save();
    res.json(updatedPassword);
  } else {
    res.json(user);
  }
});



const forgetPasswordToken = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw new Error("user not found with this email");
  try {
    const token = await user.createPasswordResetToken();
    await user.save();
    const reset_url = `hi please follow this link to reser your password.this link is valid for ten minutes now. <a href='http://localhost:5000/api/user/reset-password/${token}'>Click Here</>`;
    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      htm: reset_url,
    };
    emailSender(data);
    res.json(token);
  } catch (error) {
    throw new Error(error);
  }
});




const resetPassword = asyncHandler(async (req, res) => {
   const { password } = req.body;
   const { token } = req.params;
   const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
   const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
   })
      
   if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
   res.json(user);

   })




const handlerefreshToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  console.log("test:-", cookie);
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  console.log("refreshtoken", refreshToken);
  const user = await User.findOne({ refreshToken });
  console.log("user1", user);
  if (!user) throw new Error("NO refrsh token present in db or not matched");

  jwt.verify(refreshToken, process.env.SECRET_KEY, (err, decoded) => {
    console.log("decoded:", decoded);
    if (err && user._id !== decoded.id) {
      throw new Error("There is something wrong with refresh token");
    }

    const accessToken = generateToken(user?._id);
    res.json({ accessToken });
  });
});



const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken) throw new Error("no refresh token in cookies");
  const refreshToken = cookie.refreshToken;
  const user = await User.findOne({ refreshToken });
  console.log("usss:", user);
  if (!user) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });
    return res.sendStatus(204);
  }


  await User.findOneAndUpdate(
    { refreshToken: refreshToken },
    { $set: { refreshToken: "" } },
    { new: true }
  );

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
  });
  res.sendStatus(204);
});


const getallUsers = asyncHandler(async (req, res) => {
  try {
    const getUsers = await User.find().lean();
  

 
























    const getBookings=await Book.find({"bookingDate":{$eq:req.body.BookingDate}}).populate('seat');


const processBookingData = (getBookings, getUsers) => {
  
   const usersMap = getUsers.map(user => ({
 
    ...user,

    bookings: [], 
}));

  console.log("usersMAp", usersMap);

  getBookings.forEach(booking => {
    const employeeId = booking.employee.toString(); 
    const seatId = booking.seat._id.toString(); 
    const seatNumber = booking.seat.seatNumber; 
    const slotTime = booking.slot_time; 


console.log("employeeId",employeeId);
console.log("seatId",seatId);
console.log("seatNumber",seatNumber);
console.log("slotTime",slotTime);


    const user = usersMap.find(user => user._id.toString() === employeeId);
    console.log("user",user);
    if (user) {
     
      user.bookings.push({
        seatId,
        seatNumber,
        slotTime,
      });
    }
  });

  return usersMap; 
};


const enrichedUsers = processBookingData(getBookings, getUsers);

console.log("enrichedUsers",enrichedUsers); 
console.log("getBookings",getBookings);

    res.json(enrichedUsers);
    

  } catch (error) {
    throw new Error(error);
  }
}); 


const getaUser = asyncHandler(async (req, res) => {

  console.log("madhan kumar madhan kumar");
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const getuser = await User.findById(id);
    res.json(getuser);
  } catch (error) {
    throw new Error(error);
  }
});


const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const deleteuser = await User.findByIdAndDelete(id);
    res.json({ deleteuser });
  } catch (error) {
    throw new Error(error);
  }
});



const updatedUser = asyncHandler(async (req, res) => {

  const { _id } = req.user;
  validateMongodbId(_id);
  try {
    const updateuser = await User.findByIdAndUpdate(
      _id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,

        mobile: req?.body?.mobile,
      },

      {
        new: true,
      }
    );
    res.json(updateuser);
  } catch (error) {
    throw new Error(error);
  }
});

const blockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error(error);
  }
  res.json({
    message: "user Blocked",
  });
});

const unblockUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  validateMongodbId(id);
  try {
    const block = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );
  } catch (error) {
    throw new Error(error);
  }

  res.json({
    message: "user Blocked",
  });
});

module.exports = {
  createUSer,
  loginUserCtrl,
  getallUsers,
  getaUser,
  deleteUser,
  updatedUser,
  blockUser,
  unblockUser,
  handlerefreshToken,
  logout,
  updatePassword,forgetPasswordToken,
resetPassword 
};
