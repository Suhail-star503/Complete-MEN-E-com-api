import CartRepository from "./repository.js";
const cartRepository = new CartRepository();
export default class CartController{
    async add(req,res,next){
        try{
        const userId = req.userID;
        
        const {productID,quantity} = req.body;
         const result=await cartRepository.addProductToCart(userId,productID,quantity);
         if(!result){
             throw new ApplicationError('Failed to add item to cart',500);
         };
         return res.status(201).json({
            message: "Item added to cart successfully",
            data:result
         })

        }catch(err){
            next(err);
        }
    }
    async getallitem(req,res,next){
        try{
            const userID=req.userID;
            const products=await cartRepository.getAllItemsFromCart(userID);
            if(!products || products.length==0){
                throw new ApplicationError('Your cart is empty',500);
            }
            return res.status(200).json({
                message: "Items fetched successfully",
                Products:products
            })
        }catch(err){
            next(err);
        }
    }
    async deletebyid(req,res,next){
        try{
            const userID=req.userID;
            const {productID}=req.params;
            const result=await cartRepository.deleteItemFromCart(userID,productID);
            if(!result){
                throw new ApplicationError('Failed to delete item from cart',500);
            }
            return res.status(200).json({
                message: "Item deleted successfully"
            })
        }catch(err){
            next(err);
        }
    }
    async update(req, res, next) {
        try {
            const userID = req.userID;
            const { productID } = req.params;
            const { quantity } = req.body; // Extract quantity from req.body

            if (typeof quantity !== 'number') {
                throw new ApplicationError('Quantity must be a number', 400);
            }

            const result = await cartRepository.updateItemInCart(userID, productID, quantity);
            if (!result) {
                throw new ApplicationError('Failed to update item in cart', 500);
            }
            return res.status(200).json({
                message: "Item updated successfully"
            });
        } catch (err) {
            next(err);
        }
    }
}