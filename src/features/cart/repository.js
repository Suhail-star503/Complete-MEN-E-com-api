import { ObjectId } from "mongodb";
import ApplicationError from "../../errors/applicationError.js";
import handleDatabaseError from "../../errors/databaseError.js";

import cartModel from "./schema.js";

export default class CartRepository{
    async addProductToCart(userId,productID,quantity){
        try{
            const cartItem = new cartModel({
                productID: new ObjectId(productID),
                userID: new ObjectId(userId),
                quantity: quantity
            });
            const saveditem=await cartItem.save();
            return saveditem;
        }catch(err){
            handleDatabaseError(err);
        }

    }
    async getAllItemsFromCart(userID){
        try{
            const products=await cartModel.find({userID:new ObjectId(userID)}).populate('productID');
            return products;
        }catch(err){
            handleDatabaseError(err);
        }
    }
    async deleteItemFromCart(userID,productID){
        try{
            const result=await cartModel.deleteOne({userID:new ObjectId(userID),productID:new ObjectId(productID)});
            return result;
        }catch(err){
            handleDatabaseError(err);
        }
    }
    async updateItemInCart(userID, productID, quantity) {
        try {
            const result = await cartModel.findOneAndUpdate(
                { userID: userID, productID: productID },
                { $set: { quantity: quantity } },
                { new: true }
            );
            return result;
        } catch (error) {
            handleDatabaseError(error);
        }
    }
}