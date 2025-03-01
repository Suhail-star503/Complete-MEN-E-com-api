// 1. Import express.
import express from 'express';
import UserController from '../Controller/user.controller.js';
import jwtAuth from '../../../middlewares/jwt.middleware.js';


// 2. Initialize Express router.
const userRouter = express.Router();

// Contoller object to access controller functions.
const usersController = new UserController();

// All the paths to controller methods.
// Authentication Routes

// Register a new user account.
userRouter.post('/signup', (req,res,next)=>{
    usersController.SignUp(req,res,next);
})

// Log in as a user.
userRouter.post('/signin', (req,res,next)=>{
    usersController.SignIn(req,res,next);
});

// Log out the currently logged-in user.
userRouter.get('/logout', jwtAuth, (req,res,next)=>{
    usersController.logout(req,res,next);
});


// User Profile Routes

// Retrieve user information, ensuring sensitive data like passwords is not exposed.
userRouter.get('/get-details/:userId', jwtAuth, (req,res,next)=>{
    usersController.GetUserDetails(req,res,next);
});

// Retrieve information for all users, avoiding display of sensitive credentials like passwords.
userRouter.get('/get-all-details', jwtAuth, (req,res,next)=>{
    usersController.GetUsers(req,res,next);
});

export default userRouter;