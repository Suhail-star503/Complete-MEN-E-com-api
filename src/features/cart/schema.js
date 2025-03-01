import mongoose from "mongoose";
const cartSchema=new mongoose.Schema({
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Product'
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    quantity:{
        type:Number,
        required:true
    }
})
const cartModel=mongoose.model('Cart',cartSchema);
export default cartModel;