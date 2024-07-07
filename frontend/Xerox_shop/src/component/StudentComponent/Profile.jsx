import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../Header';

function StudentProfile() {
    const [profile, setProfile] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8000/student/profile', { withCredentials: true });
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile data:', error);
                setError('Failed to load profile data');
            }
        };

        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/order/myorders', { withCredentials: true });
                setOrders(response.data.orders);
            } catch (error) {
                console.error('Error fetching orders:', error);
                setError('Failed to load orders');
            }
        };

        fetchProfile();
        fetchOrders();
    }, []);

    return (
        <div>
            <Header />
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto mt-8">
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Student Profile</h1>
                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
                {profile ? (
                    <div>
                        <p><strong>Name:</strong> {profile.student_name}</p>
                        <p><strong>Email:</strong> {profile.student_email}</p>
                        <p><strong>Phone:</strong> {profile.student_phone}</p>
                        <p><strong>Year:</strong> {profile.student_year}</p>
                        <p><strong>Department:</strong> {profile.student_department}</p>
                    </div>
                ) : (
                    <p className="text-center">Loading profile...</p>
                )}

                <h2 className="text-2xl font-bold mt-8 mb-4 text-center text-gray-800">My Orders</h2>
                {orders.length > 0 ? (
                    <ul className="list-disc list-inside">
                        {orders.map(order => (
                            <li key={order._id} className="mb-4">
                                <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
                                <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                                <div>
                                    <strong>Items:</strong>
                                    <ul className="list-inside">
                                        {order.orderItems.map(item => (
                                            <li key={item._id}>
                                                {item.bookId ? item.bookId.book_name : 'Book not found'} (Quantity: {item.quantity})
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center">No orders found.</p>
                )}
            </div>
        </div>
    );
}

export default StudentProfile;
