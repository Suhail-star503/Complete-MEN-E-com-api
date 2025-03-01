import ratingrepository from "./repository.js";
import ApplicationError from "../../errors/applicationError.js";
import { productModel } from "../product/Schema/product.schema.js";
const Ratingrepository=new ratingrepository();
export default class ratingcontroller{
    async rate(req,res,next){
        try{
            const {productId,rating}=req.body;
            const product=await productModel.findById(productId);
            if(!product){
                throw new ApplicationError("Product not found",404);
            }
            const userId=req.userID;
            const result=await Ratingrepository.rateproduct(userId,productId,rating);
            if(!result){
                throw new ApplicationError("Rating failed",400);
            }
            return res.status(200).json({
                success:true,
                msg:"Rating success"
            });
        }catch(err){
            next(err);
        }
    }
    async getProductRating(req,res,next){
        try{
            const productId=req.params.productId;
            const result=await Ratingrepository.getProductRating(productId);
            if(!result){
                throw new ApplicationError("Rating not found",404);
            }
            return res.status(200).json({
                success:true,
                AverageRating:result,
                msg:"Rating found"
            });
        }catch(err){
            next(err);
        }
    }
}