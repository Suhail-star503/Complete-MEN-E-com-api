import OrderRepository from './repository.js';
import ApplicationError from '../../errors/applicationError.js';
const orderRepository = new OrderRepository();

export default class OrderController {
    async placeorder(req, res, next) {
        try {
            const userId = req.userID; // Assuming userID is added to req by authentication middleware
            const orders = await orderRepository.placeorder(userId);
            if (!orders || orders.length === 0) {
                throw new ApplicationError('Failed to place order', 500);
            }
            return res.status(201).json({
                message: 'Order placed successfully',
                success: true,
                data: orders
            });
        } catch (err) {
            next(err);
        }
    }
    
}