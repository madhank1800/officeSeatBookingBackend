const express = require("express");
const dbConnect = require("./config/dbConnect");
const app = express();
const cors = require("cors");
const authRouter = require("./Routes/authRouter");
const productRouter = require("./Routes/productRouter");
const seatRouter=require('./Routes/seatRouter');
const seatingRouter=require('./Routes/seatingRouter');
const bookingRouter=require('./Routes/bookingRoute');
const bookRouter=require('./Routes/bookRoute');

const categoryRouter = require("./Routes/prodcategoryRouter");
const blogRouter = require("./Routes/blogRouter");
const blogcategoryRouter = require("./Routes/blogCatRoute");
const brandRouter = require("./Routes/brandRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const { errorHandler, notFound } = require("./middlewares/errorhandling");
const couponRouter = require("./Routes/couponRoute");
const dotenv = require("dotenv").config();
const morgan = require("morgan");

dbConnect();
const PORT = process.env.PORT || 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

const corsOptions = {
  AccessControlAllowOrigin: "http://localhost:3000/",
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};
app.use(cors(corsOptions));
app.use(morgan("dev"));




app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use('/api/seat',seatRouter);
app.use('/api/seating',seatingRouter);
app.use('/api/booking',bookingRouter);
app.use('/api/book',bookRouter);

app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use(notFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server running  on on port ${PORT}`);
});
