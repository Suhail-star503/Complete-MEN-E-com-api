import express from 'express';
import ratingcontroller from './controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';


// 2. Initialize Express router.
const RatingRouter = express.Router();
const controller=new ratingcontroller();
RatingRouter.post('/',jwtAuth, (req,res,next)=>{
    controller.rate(req,res,next);
})
RatingRouter.get('/:productId',jwtAuth, (req,res,next)=>{
    controller.getProductRating(req,res,next);
})
export default RatingRouter;
