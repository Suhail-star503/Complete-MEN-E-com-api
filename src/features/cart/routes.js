import express from 'express';
import CartController from './controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';
// 2. Initialize Express router.
const cartRouter = express.Router();
const cartController = new CartController();

cartRouter.post('/', jwtAuth, (req,res,next)=>{
    cartController.add(req,res,next);
});

// Retrieve a specific post by ID.
cartRouter.get('/', jwtAuth, (req,res,next)=>{
    cartController.getallitem(req,res,next);
});
cartRouter.delete('/:productID', jwtAuth, (req,res,next)=>{
    cartController.deletebyid(req,res,next);
});
cartRouter.put('/:productID', jwtAuth, (req,res,next)=>{
    cartController.update(req,res,next);
});
export default cartRouter;