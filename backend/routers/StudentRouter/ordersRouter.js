const express = require('express');
const router = express.Router();
const Order = require("../../Schema/Order")
const OrderItem = require("../../Schema/OrderItem");
const Book = require("../../Schema/BookSchema");
const Cart = require("../../Schema/CartSchema");
const verifyStudent = require("../../middleware/verifyStudent")
const crypto = require('crypto');
const razorpay = require('./razorpay');

router.get('/myorders', verifyStudent, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id })
            .populate({
                path: 'orderItems',
                populate: {
                    path: 'bookId',
                    select: 'book_name'
                }
            });

        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Something went wrong' });
    }
});
router.post('/confirm-order', verifyStudent, async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate('cartItems.bookId');
        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        cart.cartItems.forEach(item => {
            totalAmount += item.bookId.book_price * item.quantity;
        });

        const amountInPaise = Math.round(totalAmount * 100);

        const options = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_order_${new Date().getTime()}`
        };

        const order = await razorpay.orders.create(options);

        res.status(200).json({ orderId: order.id, amount: options.amount, currency: options.currency });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({ message: 'Failed to confirm order' });
    }
});


// routes/order.js

router.post('/payment-confirmation', verifyStudent, async (req, res) => {
    const { paymentId, orderId, signature } = req.body;
    const userId = req.user.id;

    if (!paymentId || !orderId || !signature || !userId) {
        return res.status(400).json({ message: 'Payment ID, order ID, signature, and user ID are required' });
    }

    try {
        const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        shasum.update(`${orderId}|${paymentId}`);
        const digest = shasum.digest('hex');

        if (digest !== signature) {
            return res.status(400).json({ message: 'Invalid signature' });
        }

        const cart = await Cart.findOne({ userId }).populate('cartItems.bookId');
        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const newOrder = new Order({
            userId,
            totalAmount,
            orderItems: [],
            orderId,
            paymentId
        });

        for (let item of cart.cartItems) {
            const book = item.bookId;
            if (!book) {
                return res.status(404).json({ message: `Book with ID ${item.bookId} not found` });
            }

            const orderItem = new OrderItem({
                orderId: newOrder._id,
                bookId: item.bookId._id,
                quantity: item.quantity,
                price: book.book_price
            });
            await orderItem.save();

            newOrder.orderItems.push(orderItem);
            totalAmount += book.book_price * item.quantity;
        }

        newOrder.totalAmount = totalAmount;
        await newOrder.save();
        await Cart.deleteOne({ userId });

        res.status(201).json({ message: 'Payment successful and order placed', order: newOrder });
    } catch (error) {
        console.error('Error confirming payment and placing order:', error);
        res.status(500).json({ message: 'Failed to place order' });
    }
});


module.exports = router;