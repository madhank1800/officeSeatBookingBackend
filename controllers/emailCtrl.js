const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const emailSender = asyncHandler(async (data, req, res) => {
    

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {

    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PWD,
  },
});
    
    
    
    
    const info = await transporter.sendMail({
      from: '"hey 👻" <abc@gmail.com>', 
      to: data.to, 
      subject: data.subject, 
      text: data.text, 
      html: data.htm, 
    });
    info();

})

module.exports = { emailSender };