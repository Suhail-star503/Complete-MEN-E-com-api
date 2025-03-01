import mongoose from "mongoose";
const ratingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        max: [5, "Rating can't be more than 5 !"],
        min: [1, "Rating can't be less than 1 !"],
    }
});
const RatingModel = mongoose.model("Rating", ratingSchema);
export default RatingModel;