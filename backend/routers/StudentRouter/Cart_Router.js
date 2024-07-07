const express = require("express");
const router = express.Router();
const Cart = require("../../Schema/CartSchema");
const Order = require("../../Schema/Order")
const Book = require("../../Schema/BookSchema");
const verifyStudent = require("../../middleware/verifyStudent");

// Get Cart Details
router.get('/getcart', verifyStudent, async (req, res) => {
    const userId = req.user.id;
                                                                        //, 'title author book_price
    try {
        const cart = await Cart.findOne({ userId }).populate('cartItems.bookId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Failed to fetch cart' });
    }
});


router.post('/add-to-cart', verifyStudent, async (req, res) => {
    const userId = req.user.id;
    const { bookId, quantity } = req.body;

    if (!userId || !bookId || !quantity) {
        return res.status(400).json({ message: 'User ID, book ID, and quantity are required' });
    }

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({ userId, cartItems: [] });
        }

        const cartItem = cart.cartItems.find(item => item.bookId.toString() === bookId);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.cartItems.push({ bookId, quantity });
        }

        await cart.save();
        res.status(200).json({ message: 'Book added to cart', cart });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Failed to add to cart' });
    }
});

// Update Cart Item
router.put('/update-cart', verifyStudent, async (req, res) => {
    console.log('Request Body:', req.body);
    const userId = req.user.id;
    const { bookId, quantity } = req.body;

    if (!userId || !bookId || !quantity) {
        return res.status(400).json({ message: 'User ID, book ID, and quantity are required' });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItem = cart.cartItems.find(item => item.bookId.toString() === bookId);
        if (!cartItem) {
            return res.status(404).json({ message: 'Book not found in cart' });
        }

        cartItem.quantity = quantity;

        await cart.save();
        res.status(200).json({ message: 'Cart item updated', cart });
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Failed to update cart item' });
    }
});

// Delete Cart Item
router.delete('/delete-cart-item', verifyStudent, async (req, res) => {
    const userId = req.user.id;
    const { bookId } = req.body;

    if (!userId || !bookId) {
        return res.status(400).json({ message: 'User ID and book ID are required' });
    }

    try {
        const cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const cartItemIndex = cart.cartItems.findIndex(item => item.bookId.toString() === bookId);
        if (cartItemIndex === -1) {
            return res.status(404).json({ message: 'Book not found in cart' });
        }

        cart.cartItems.splice(cartItemIndex, 1);

        await cart.save();
        res.status(200).json({ message: 'Cart item deleted', cart });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Failed to delete cart item' });
    }
});


module.exports = router;