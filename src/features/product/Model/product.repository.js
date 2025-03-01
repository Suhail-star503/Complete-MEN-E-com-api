// Posts repository file all database activities is happening here like CRUD.
// Imports
import { ObjectId } from "mongodb";
import ApplicationError from "../../../errors/applicationError.js";
import handleDatabaseError from "../../../errors/databaseError.js";
import { productModel } from "../Schema/product.schema.js";
import { UserModel } from "../../user/Schema/user.schema.js";

export default class productRepository{

    
    async createproduct(name,details,price,imageUrl,userID)
    {
        try {
       
        const user= await UserModel.findById(userID);
        
        if(user.role !== 'seller'){
            throw new ApplicationError("You are not allowed to create product because you are not a seller.",
            403);
        }
        const newproduct = new productModel({
            name:name,
            imageUrl: imageUrl,
            details: details,
            price: price,
            user: new ObjectId(userID),
        });

       
        const savedproduct = await newproduct.save();
        return savedproduct;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

   
    async delete(productid,userID)
    {
        try {
            const product = await productModel.findById(productid);
            if(!product)
            {
                throw new ApplicationError("No product exist on this id.", 404);
            }
            if(String(product.user) !== userID)
            {
                throw new ApplicationError("You are not allowed to delete this product.", 404);
            }
            const user= await UserModel.findById(userID);
            if(user.role !== 'seller'){
                throw new ApplicationError("You are not allowed to delete product because you are not a seller.",
                403);
            }
            const result = await productModel.findByIdAndDelete(productid);
            if(!result)
            {
                throw new ApplicationError("No product exist on this id.", 404);
            }
            return result; 
        } catch (error) {
            handleDatabaseError(error);
        }
    }

   
    async getUserproducts(userID) {
        try {
            const products = await productModel.find({ user: userID })
                

            if (products.length === 0) {
                throw new ApplicationError("User has not posted anything.", 404);
            }
            return products;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

   
    async getproduct(productId) {
        try {
            const product = await productModel.findById(productId)
                

            if (!product) {
                throw new ApplicationError("No post found on this id.", 404);
            }
            return product;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    
    
    async update(productId, userID, updatedproductData) {
        try {
            
            const product = await productModel.findById(productId);
            if (!product) {
                throw new ApplicationError("No product exists with this id.", 404);
            }
            if (String(product.user) !== userID) {
                throw new ApplicationError("You are not allowed to update this product.", 403);
            }
            const user= await UserModel.findById(userID);
            if(user.role !== 'seller'){
                throw new ApplicationError("You are not allowed to update product because you are not a seller.",
                403);
            }
            const updatedProduct = await productModel.findByIdAndUpdate(productId, updatedproductData, { new: true })
                
            return updatedProduct;
        } catch (error) {
            handleDatabaseError(error);
        }
    }
    
    
    async getproducts()
    {
        try {
            const products =await productModel.find();
            if(products.length === 0)
            {
                throw new ApplicationError("No products found.", 404);
            }
            return  products;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

}