// Importing env
import env from 'dotenv';
env.config();

// Modules Imported
import express from 'express';

// Routers Imported
import cors from 'cors';
import cookieParser from 'cookie-parser';
import userRouter from './src/features/user/Routes/user.routes.js';
import productRouter from './src/features/product/Routes/product.routes.js';
import cartRouter from './src/features/cart/routes.js';
import orderRouter from './src/features/order/routes.js';
import RatingRouter from './src/features/Ratings/routes.js';

// Middlewares
import { errorHandlerMiddleware } from './src/middlewares/error-handler.middleware.js';
import  connectUsingMongoose  from './config/mongooseConfig.js';


// Server Created
const app = express();
app.use(cookieParser());

// Json parser
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// set up cors to allow us to accept requests from our client
app.use(cors());


// Routes related to all features
app.use('/api/users', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/order', orderRouter);
app.use('/api/rating',RatingRouter);





app.get('/', (req,res)=>{
    res.status(200).json({
        message: "Welcome to Social Media API"
    });
});

// Error handler
app.use(errorHandlerMiddleware);

// 404 Route middelware handles 404 requests
app.use((req,res)=>{
    res.status(404).send("API not found please give valid API.");
});

// Server is listening here
app.listen('3000', ()=>{
    console.log("Server is listening on: localhost:3000");
    connectUsingMongoose();
});