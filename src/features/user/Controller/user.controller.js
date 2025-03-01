
import bcrypt from 'bcrypt';
import ApplicationError from "../../../errors/applicationError.js";
import UserRepository from "../Model/user.repository.js";
import jwt from 'jsonwebtoken';
import { UserModel } from '../Schema/user.schema.js';


export default class UserController {

    
    constructor() {
        this.userRepository = new UserRepository();
    }

    
    async SignUp(req, res, next) {
        try {
            const { name, email, password, role } = req.body;
            // Hashing The password for security.
            const hashedPassword = await bcrypt.hash(password, 12);
            if (!hashedPassword) {
                throw new ApplicationError("Having issue in hasing the password", 400);
            }
            // Creating user object.
            const user = { name, email, password, role };
            user.password = hashedPassword;
            // Calling signUp function in repository.
            const newUser = await this.userRepository.signUp(user);
            if (!newUser) {
                throw new ApplicationError("New user cannot added something went wrong.", 400);
            }
            

            return res.status(201).json({
                success: true,
                user: newUser,
                msg: "Congrats! You have successfully registered"
            });
        } catch (error) {
            next(error);
        }
    }

    // Log in as a user.
    async SignIn(req, res, next) {
        try {
            const { email, password } = req.body;

            // Check for missing email or password.
            if (!email) {
                throw new ApplicationError("Please enter email", 400);
            } else if (!password) {
                throw new ApplicationError("Please enter password", 400);
            }

            // Find user by email.
            const user = await this.userRepository.findByEmail(email);
            if (!user) {
                return res.status(400).json({
                    success: false,
                    msg: "Invalid Credentials"
                });
            }

            // Compare password with hashed password.
            const passwordMatch = await bcrypt.compare(password, user.password);

            if (passwordMatch) {
                const token = jwt.sign(
                    { userID: user._id, email: user.email },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: '1h' }
                );
                return res.status(200).json({
                    success: true,
                    msg: "You have successfully logged in",
                    token: token
                });
            } else {
                // Invalid password.
                return res.status(400).json({
                    success: false,
                    msg: "Invalid Credentials"
                });
            }
        } catch (error) {
            // Handle any unexpected error.
            next(error);
        }
    }


    // Retrieving user by its id.
    async GetUserDetails(req, res, next) {
        try {
            const id = req.params.userId;
            if (!id) {
                throw new ApplicationError("Enter user id.", 400);
            }
            const user = await this.userRepository.findById(id);
            if (!user) {
                throw new ApplicationError("No user found by this id", 404);
            }
            return res.status(200).json({
                success: true,
                user: user,
                msg: "User found."
            })
        } catch (error) {
            next(error);
        }
    }

    // Retrieve information for all users.
    async GetUsers(req, res, next) {
        try {
            const users = await this.userRepository.findAllUsers();
            if (users.length == 0) {
                throw new ApplicationError("No users are there", 400);
            }
            return res.status(200).json({
                success: true,
                users: users, msg:
                    "users found"
            });
        } catch (error) {
            next(error);
        }
    }
}