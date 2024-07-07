const express = require("express");
const router = express.Router();
const verifyAdmin = require("../../middleware/verifyAdmin");
const Order = require("../../Schema/Order");


router.get("/all-order-list", verifyAdmin, async (req, res) => {
    try {
        // Fetch all orders
        const orders = await Order.find()
            .populate('userId', 'student_name student_email') // Populate user details
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'bookId',
                    select: 'book_name book_author book_price book_department' // Populate book details
                }
            });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
});

router.put('/orders/:orderId/status', verifyAdmin, async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;

    try {
        const order = await Order.findOneAndUpdate({ _id: orderId },{ status: status },{ new: true });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order status updated successfully', order });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Failed to update order status' });
    }
});




module.exports = router