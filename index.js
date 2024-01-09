const express=require('express');
const dbConnect = require('./config/dbConnect');
const app=express();
const authRouter=require('./Routes/authRouter');
const productRouter=require('./Routes/productRouter');
const bodyParser = require('body-parser');
const cookieParser=require('cookie-parser');
const { errorHandler, notFound } = require('./middlewares/errorhandling');
const dotenv=require('dotenv').config()
const morgan=require('morgan');

dbConnect();
const PORT=process.env.PORT||4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser());

app.use(morgan("dev"));

app.use('/api/user',authRouter);
app.use('/api/product',productRouter);

app.use(notFound);

app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`server running  on on port ${PORT}`)
})
