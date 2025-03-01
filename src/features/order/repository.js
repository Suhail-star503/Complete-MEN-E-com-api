
import cartModel from "../cart/schema.js";
import CartRepository from "../cart/repository.js";
import ordermodel from "./schema.js";
import mongoose from "mongoose";
import { UserModel } from "../user/Schema/user.schema.js";
import sendMail from "../mail/productcreated.js";
const cartRepository = new CartRepository();
import { ObjectId } from "mongodb";

const html = (productName, user) => `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h1 style="color: #4CAF50;">An order for your product</h1>
        <p>Congratulations! A product named <strong>"${productName}"</strong> which is posted by you on E-commx has been ordered by a customer. Contact the customer using the details below for further activities:</p>
        <h3 style="color: #4CAF50;">Customer's details</h3>
        <ul style="list-style-type: none; padding: 0;">
            <li><strong>Name of the customer:</strong> ${user.name}</li>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>User type:</strong> ${user.role}</li>
        </ul>
        <p>Thank you for using E-commx!</p>
    </div>
`;
const subject = "An order for your product";

export default class OrderRepository {
    async placeorder(userId) {
        try {
            // Retrieve the user's cart items
            const cartItems = await cartModel.find({ userID: new ObjectId(userId) });
            if (!cartItems || cartItems.length === 0) {
                throw new Error("Cart is empty");
            }

            // Use aggregation to lookup product prices and poster user ID
            const cartItemsWithPrices = await cartModel.aggregate([
                { $match: { userID: new ObjectId(userId) } },
                {
                    $lookup: {
                        from: "products", // Ensure the collection name is correct
                        localField: "productID",
                        foreignField: "_id",
                        as: "productDetails"
                    }
                },
                { $unwind: "$productDetails" },
                {
                    $project: {
                        productID: "$productID",
                        quantity: "$quantity",
                        price: "$productDetails.price",
                        posterUserID: "$productDetails.user", // Assuming the product schema has a userID field for the poster
                        productName: "$productDetails.name" // Assuming the product schema has a name field
                    }
                }
            ]);

            const orders = [];
            const user = await UserModel.findOne({ _id: new ObjectId(userId) }); // Ensure user is retrieved correctly
            
            for (const item of cartItemsWithPrices) {
                if (item.price !== undefined) { // Ensure price exists
                    const order = new ordermodel({
                        userID: new ObjectId(userId),
                        productID: new ObjectId(item.productID),
                        quantity: item.quantity,
                        total: item.price * item.quantity
                    });
                    const savedOrder = await order.save();
                    orders.push(savedOrder);

                    // Retrieve the poster user's email
                    const posterUser = await UserModel.findById(item.posterUserID);
                    if (posterUser && posterUser.email) {
                        // Send email to the poster user
                        await sendMail(posterUser.email,subject, html(item.productName, user));
                    }
                } else {
                    console.log("Price not found for item: ", item);
                }
            }

            // Clear the user's cart only if orders were created
            if (orders.length > 0) {
                await cartModel.deleteMany({ userID: new ObjectId(userId) });
            }

            return orders;
        } catch (err) {
            console.error(err);
            throw new Error("Internal server error");
        }
    }
}