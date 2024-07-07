import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header';

const Cart = () => {
    const [cart, setCart] = useState(null);
    const [error, setError] = useState('');
    const [confirmMessage, setConfirmMessage] = useState('');

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await axios.get('http://localhost:8000/cart/getcart', { withCredentials: true });
                setCart(response.data);
            } catch (error) {
                console.error('Error fetching cart data:', error);
                setError('Failed to load cart data');
            }
        };
        fetchCart();
    }, []);

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    };

    const handleConfirm = async () => {
        try {
            const response = await axios.post('http://localhost:8000/order/confirm-order', {}, { withCredentials: true });
            const { orderId, amount, currency } = response.data;

            const scriptLoaded = await loadRazorpayScript();

            if (!scriptLoaded) {
                setError('Failed to load Razorpay script');
                return;
            }

            const options = {
                key: 'rzp_test_RzWupNrG9Rh9VI',
                amount,
                currency,
                name: 'Hariraj Xerox shop',
                description: 'Order Payment',
                order_id: orderId,
                handler: async (response) => {
                    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
                    try {
                        await axios.post('http://localhost:8000/order/payment-confirmation', {
                            paymentId: razorpay_payment_id,
                            orderId: razorpay_order_id,
                            signature: razorpay_signature
                        }, { withCredentials: true });
                        setConfirmMessage('Payment successful and order placed!');
                    } catch (error) {
                        console.error('Error confirming payment:', error);
                        setError('Failed to confirm payment');
                    }
                },
                prefill: {
                    name: 'Customer Name',
                    email: 'customer@example.com',
                    contact: '9999999999',
                },
                notes: {
                    address: 'Customer Address',
                },
                theme: {
                    color: '#3399cc',
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error('Error confirming the item:', error);
            setError('Failed to confirm the item');
        }
    };

    const updateCartItem = async (bookId, quantity) => {
        try {
            const response = await axios.put('http://localhost:8000/cart/update-cart', { bookId, quantity }, { withCredentials: true });
            setCart(response.data.cart);
        } catch (error) {
            console.error('Error updating cart item:', error);
            setError('Failed to update cart item');
        }
    };

    const handleQuantityChange = (bookId, newQuantity) => {
        if (newQuantity < 1) {
            return;
        }
        setCart(prevCart => {
            const updatedCartItems = prevCart.cartItems.map(item => 
                item.bookId._id === bookId ? { ...item, quantity: newQuantity } : item
            );
            return { ...prevCart, cartItems: updatedCartItems };
        });
    };

    const handleQuantityBlur = (bookId, quantity) => {
        updateCartItem(bookId, quantity);
    };

    const deleteCartItem = async (bookId) => {
        try {
            const response = await axios.delete('http://localhost:8000/cart/delete-cart-item', {
                data: { bookId },
                withCredentials: true,
            });
            setCart(response.data.cart);
        } catch (error) {
            console.error('Error deleting cart item:', error);
            setError('Failed to delete cart item');
        }
    };

    return (
        <div className="container">
            <Header />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
                <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Cart</h1>
                    {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                    {confirmMessage && <p className="text-green-500 mb-4 text-center">{confirmMessage}</p>}
                    {cart ? (
                        <div>
                            {cart.cartItems.length === 0 ? (
                                <p className="text-center">No items in the cart.</p>
                            ) : (
                                <div>
                                    <ul>
                                        {cart.cartItems.map(item => (
                                            <li key={item._id} className="mb-4 p-4 bg-gray-100 rounded-md shadow-md">
                                                <p><strong>Book:</strong> {item.bookId.book_name}</p>
                                                <p><strong>Quantity:</strong></p>
                                                <input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item.bookId._id, parseInt(e.target.value))}
                                                    onBlur={() => handleQuantityBlur(item.bookId._id, item.quantity)}
                                                    className="text-center w-16 p-1 border rounded-md"
                                                    min="1"
                                                />
                                                <div className="flex justify-between mt-2">
                                                    <button
                                                        onClick={() => deleteCartItem(item.bookId._id)}
                                                        className="bg-red-500 text-white py-1 px-2 rounded-md shadow-md hover:bg-red-600 transition-colors duration-300"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={handleConfirm}
                                        className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-colors duration-300"
                                    >
                                        Confirm Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center">Loading cart...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
