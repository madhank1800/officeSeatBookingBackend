const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const cors = require("cors");
const authRouter = require("./Routes/authRouter");
//const productRouter = require("./Routes/productRouter");
const seatRouter=require('./Routes/seatRouter');
const seatingRouter=require('./Routes/seatingRouter');
const bookingRouter=require('./Routes/bookingRoute');
const bookRouter=require('./Routes/bookRoute');


const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errorHandler, notFound } = require("./middlewares/errorhandling");

const dotenv = require("dotenv").config();
const morgan = require("morgan");

dbConnect();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  AccessControlAllowOrigin: "http://localhost:3001/",
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));   
app.use(morgan("dev"));




app.use("/api/user", authRouter);

app.use('/api/seat',seatRouter);
app.use('/api/seating',seatingRouter);
app.use('/api/booking',bookingRouter);
app.use('/api/book',bookRouter);


app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running  on on port ${PORT}`);
});
