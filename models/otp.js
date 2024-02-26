const mongoose=require('mongoose')

const otpSchema=new mongoose.Schema({

    email:{
        type:String,
        required:true
    }, 
    otp:{
        type:Number,
        required:true
    },
    createdAt:{type:Date,
        expires:'60s',
        default:Date.now}
})

module.exports=mongoose.model("otps",otpSchema)

