import RatingModel from './schema.js';
import handleDatabaseError from '../../errors/databaseError.js';
import { ObjectId } from 'mongodb';

export default class RatingRepository {
    async rateproduct(userId, productId, rating) {
        try {
            // Check if the user has already rated the product
            const existingRating = await RatingModel.findOne({ userId: new ObjectId(userId), productId: new ObjectId(productId) });
            if (existingRating) {
                // Update the rating if the user has already rated the product
                existingRating.rating = rating;
                await existingRating.save();
                return true;
            }

            // Create a new Rating document if the user has not rated the product yet
            const ratingDoc = new RatingModel({
                userId: new ObjectId(userId),
                productId: new ObjectId(productId),
                rating: rating
            });

            // Save the new rating document
            await ratingDoc.save();
            return true;
        } catch (err) {
            handleDatabaseError(err);
            return false;
        }
    }
    async getProductRating(productId) {
        try {
            // Find all the ratings for the product
            const ratings = await RatingModel.find({ productId: new ObjectId(productId) });
            if (ratings.length === 0) {
                return null;
            }

            // Calculate the average rating for the product
            let totalRating = 0;
            for (let i = 0; i < ratings.length; i++) {
                totalRating += ratings[i].rating;
            }
            const averageRating = totalRating / ratings.length;
            return averageRating;
        } catch (err) {
            handleDatabaseError(err);
            return null;
        }
    }
}