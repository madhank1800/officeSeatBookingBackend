

const mongoose=require('mongoose');
var subSeatslotSchema=new mongoose.Schema({
  slot_time:{ 
    type:String,required:true
  },
  isAvailable:{
    type:Boolean,required:true
  },

})


var seatingSchema= new mongoose.Schema({

    seatNumber:{type:Number,required:true,unique:true},
    seatName:{
        type:String,
        required:true,unique:true
    },
    floor:{
        type:String,default:"1"
    },
    location:{
     type:String
    },
    
    seatType:{
   type:String,required:true
    },
    availability:[

      subSeatslotSchema
      
 


],
    createdAt: { type: Date, default: Date.now },

})


module.exports=mongoose.model('Seating',seatingSchema);