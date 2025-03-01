import express from 'express';
import OrderController from './controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';


// 2. Initialize Express router.
const orderRouter = express.Router();
const ordercontroller=new OrderController();
orderRouter.get('/placeorder',jwtAuth, (req,res,next)=>{
    ordercontroller.placeorder(req,res,next);
})
export default orderRouter;
