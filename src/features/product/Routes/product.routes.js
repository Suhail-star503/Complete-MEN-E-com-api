// 1. Import express.
import express from 'express';
import productController from '../Controller/product.controller.js';
import jwtAuth from '../../../middlewares/jwt.middleware.js';
import { uploads } from '../../../middlewares/file-upload.middleware.js';


const productRouter = express.Router();


const productcontroller = new productController();


productRouter.get('/all', jwtAuth, (req,res,next)=>{
    productcontroller.getAllproducts(req,res,next);
});

// Retrieve a specific post by ID.
productRouter.get('/:productId', jwtAuth, (req,res,next)=>{
    productcontroller.getproductById(req,res,next);
});


productRouter.get('/', jwtAuth, (req,res,next)=>{
    productcontroller.getUserproduct(req,res,next);
});


productRouter.post('/', jwtAuth, uploads.single('imageUrl'), (req,res,next)=>{
    productcontroller.createNewProduct(req,res,next);
});


productRouter.delete('/:productId', jwtAuth, (req,res,next)=>{
    productcontroller.deleteproduct(req,res,next);
});


productRouter.put('/:productId', jwtAuth, uploads.single('imageUrl'), (req,res,next)=>{
    productcontroller.updateproduct(req,res,next);
});


export default productRouter;