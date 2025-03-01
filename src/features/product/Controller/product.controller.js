// Posts controller which links with routes and models here.
// Imports
import ApplicationError from "../../../errors/applicationError.js";
import productRepository from "../Model/product.repository.js";
import { ObjectId } from "mongodb";
import sendMail from "../../mail/productcreated.js";
import { UserModel } from "../../user/Schema/user.schema.js";

export default class productController{

    constructor()
    {
        this.productRepository = new productRepository();
    }

    
    async createNewProduct(req,res,next){
        try {
            const {name,details,price} = req.body;
            const imageUrl = req.file.filename;
            // Fetching user Id from token here.
            if(!imageUrl)
            {
                throw new ApplicationError("Image url is not recieved.", 400);
            }
            const userID = req.userID;
            if(!userID)
            {
                throw new ApplicationError("User id is not received.", 400);
            }
            
            const newproduct = await this.productRepository.createproduct(name,details,price,imageUrl,userID);
            if(!newproduct)
            {
                throw new ApplicationError("Product not created something went wrong.", 400);
            }
            // Sending email to user
            const user= await UserModel.findById(userID);
            const subject = "Product posted successfully";
           

            const html = `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2 style="color: #4CAF50;">Congratulations from E-commx!</h2>
                    <p>Your product has been added successfully. If someone orders your product, we will inform you the details of the buyer through email.</p>
                    <h3>Product Details:</h3>
                    <ul>
                        <li><strong>Name:</strong> ${name}</li>
                        <li><strong>Details:</strong> ${details}</li>
                        <li><strong>Price:</strong> ${price}</li>
                        <li><strong>Posted at:</strong> ${new Date()}</li>
                    </ul>
                </div>
            `;

            await sendMail(user.email,subject,html);
            return res.status(201).json({
                success: true,
                addedproduct: newproduct,
                msg: "Product added successfully."
            });
        } catch (error) {
            next(error);
        }
    }

   
    async deleteproduct(req,res,next){
        try {
            const productid = req.params.productId;
            const userID = req.userID;
            if(!productid)
            {
                throw new ApplicationError("ProductId is not recieved enter productId.", 400);
            }
            if(!userID)
            {
                throw new ApplicationError("User id is not received.", 400);
            }
            const result = await this.productRepository.delete(productid,userID);
            if(result)
            {
                return res.status(200).json({
                    success: true,
                    msg: "Product deleted successfully."
                });
            }
        } catch (error) {
            next(error);
        }
    }

   
    async updateproduct(req, res, next) {
        try {
            const productId = req.params.productId;
            const userID = req.userID; // Assuming userID is added to req by authentication middleware
            const updatedproductData = req.body;

            if (!productId) {
                throw new ApplicationError("Please provide product id.", 400);
            }

            const updatedProduct = await this.productRepository.update(productId, userID, updatedproductData);
            if (!updatedProduct) {
                throw new ApplicationError("Product update failed.", 400);
            }

            return res.status(200).json({
                success: true,
                product: updatedProduct,
                msg: "Product updated successfully"
            });
        } catch (error) {
            next(error);
        }
    }

    
    async getUserproduct(req,res,next){
        try {
            const userID = req.userID;
            if(!userID)
            {
                throw new ApplicationError("User id not recieved.", 400);
            }
            const products = await this.productRepository.getUserproducts(userID);
            res.status(200).json({
                success: true,
                Products: products,
                msg: "Products retrieved"
            });
        } catch (error) {
            next(error);
        }
    }

    
    async getproductById(req,res,next){
        try {
            const productId = req.params.productId;
            if(!productId)
            {
                throw new ApplicationError("postId is not recieved enter postId.", 400);
            }
            const product = await this.productRepository.getproduct(productId);
            res.status(200).json({
                success: true,
                Product: product,
                msg: "post retrieved"
            });
        } catch (error) {
            next(error);
        }
    }
    

   
    async getAllproducts(req,res,next){
        try {
            const products = await  this.productRepository.getproducts();
            res.status(200).json({
                success: true,
                products: products,
                msg: "Products retrieved"
            });
        } catch (error) {
            next(error);
        }
    }
}