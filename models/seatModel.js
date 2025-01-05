

const mongoose=require('mongoose');

var seatSchema= new mongoose.Schema({
    seatNumber:{
        type:String,
        required:true,unique:true
    },
    floor:{
        type:String,default:"1"
    },
    location:{
     type:String
    },
    isAvailable:{
        type:Boolean,required:true
    },shift:{  
        type:String,required:true
    }, 
    createdAt: { type: Date, default: Date.now },

})


module.exports=mongoose.model('Seat',seatSchema);