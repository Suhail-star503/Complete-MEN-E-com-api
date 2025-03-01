// Post schema is here all post have these fields.

import mongoose from "mongoose";

export const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
    },
    details: {
        type: String,
        required: true,
    },
    price:{
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    }

});

export const productModel = mongoose.model('Product', productSchema);

