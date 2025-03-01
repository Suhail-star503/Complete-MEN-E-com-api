import mongoose from "mongoose";
const ordersSchema = new mongoose.Schema({
    userID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    productID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    quantity:{
        type: Number,
        required: true
    },
    total:{
        type: Number,
        required: true
    }
})
const ordermodel=mongoose.model("Order",ordersSchema);
export default ordermodel;