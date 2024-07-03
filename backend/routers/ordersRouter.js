const express = require('express');
const router = express.Router();
const Order = require("../Schema/Order")
const OrderItem = require("../Schema/OrderItem");
const Book = require("../Schema/BookSchema");
const verifyStudent = require("../middleware/verifyStudent")

// Route to place a new order
router.post('/place-order', verifyStudent, async (req, res) => {
    const userId = req.user.id
    const { orderItems } = req.body;
    
    if (!userId || !orderItems || orderItems.length === 0) {
        return res.status(400).json({ message: 'User ID and order items are required' });
    }

    try {
        // Calculate total amount
        let totalAmount = 0;
        for (let item of orderItems) {
            const book = await Book.findById(item.bookId);
            if (!book) {
                return res.status(404).json({ message: `Book with ID ${item.bookId} not found` });
            }
            totalAmount += book.book_price * item.quantity;
        }

        // Create order
        const newOrder = new Order({
            userId,
            totalAmount,
            orderItems: []
        });

        // Save order items and associate them with the order
        for (let item of orderItems) {
            const book = await Book.findById(item.bookId);
            if (!book) {
                return res.status(404).json({ message: `Book with ID ${item.bookId} not found` });
            }

            const orderItem = new OrderItem({
                orderId: newOrder._id,
                bookId: item.bookId,
                quantity: item.quantity,
                price: book.book_price
            });
            await orderItem.save();

            newOrder.orderItems.push(orderItem);
        }

        await newOrder.save();
        res.status(201).json({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});

module.exports = router
