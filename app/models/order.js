const mongoose=require('mongoose')
const User = require('./user')
const Schema=mongoose.Schema

const orderSchema=new Schema({
    customerId:{type:mongoose.Schema.Types.ObjectId,
    ref:User,
    required:true},
    FarmerId:{type:mongoose.Schema.Types.ObjectId,
    ref:User,
    required:true
},
    items:{type:Object,required:true},
    phone:{type:String,required:true},
    address:{type:String,required:true},
    status:{type:String,default:'Accepted'}
   
},{timestamps:true})

const order=mongoose.model('Order',orderSchema)
module.exports=order