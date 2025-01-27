
const mongoose=require('mongoose');
const options = {
    useNewUrlParser: true,
  useUnifiedTopology: true,
  };
const dbConnect=()=>{
  try {
    mongoose.connect(process.env.MONGODB_URI, options);
    
  } catch (err) {
    throw new Error("database error");
  }
    const con = mongoose.connection;
con.on("open", (req, res) => {
  console.log("connected");
});
}

module.exports=dbConnect;