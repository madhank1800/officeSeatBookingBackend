const mongoose = require('mongoose'); // Erase if already required

const bcrypt=require('bcrypt');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
      
    },
    lastname:{
        type:String,
        required:true,
      
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    mobile:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        default:"user"
    },
    cart:{
        type:Array,
        default:[]
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    address:[{type:mongoose.SchemaTypes.ObjectId,ref:"Address"}],
    wishlist:[{type:mongoose.SchemaTypes.ObjectId,ref:"Product"}],
    refreshToken :{
        type:String
    }
   
}, {
    timestamps:true
   });


userSchema.pre('save',async function(next){
    const salt=bcrypt.genSaltSync(10);
    this.password=await bcrypt.hash(this.password,salt);
})

userSchema.methods.isPasswordMatched=function(enteredPassword){
return bcrypt.compare(enteredPassword,this.password)
}
//Export the model
module.exports = mongoose.model('User', userSchema);