// User repository file here all user database functions are handled.
// Imports
import mongoose from "mongoose";
import ApplicationError from '../../../errors/applicationError.js'
import handleDatabaseError from "../../../errors/databaseError.js";
import { UserModel } from "../Schema/user.schema.js";

// UserRepository class
export default class UserRepository {

    // User signup
    async signUp(user) {
        try {
            const newUser = new UserModel(user);
            const savedUser = await newUser.save();
            
            return savedUser;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Find user by email
    async findByEmail(email) {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new ApplicationError("No user found by this email.", 400);
            }
            return user;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Find user by id
    async findById(id) {
        try {
            const user = await UserModel.findById(id).select('-password  -token')
            if (!user) {
                throw new ApplicationError("No user found by this id", 400);
            }
            return user;
        } catch (error) {
            handleDatabaseError(error);
        }
    }

    // Find all users details
    async findAllUsers() {
        try {
            const users = await UserModel.find({}, { password: 0})

            if (users.length == 0) {
                throw new ApplicationError("No users are there.", 400);
            }
            return users;
        } catch (error) {
            handleDatabaseError(error);
        }
    }
}