import React, { useEffect, useState } from "react";
import axios from "axios";

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('http://localhost:8000/admin-order-list/all-order-list', { withCredentials: true });
                setOrders(response.data.orders);
            } catch (error) {
                setError("Failed to fetch orders");
            }
        };

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, status) => {
        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error("No token found");
            }

            await axios.put(`http://localhost:8000/admin-order-list/orders/${orderId}/status`, { status }, { withCredentials: true });

            // Update orders state after successful status update
            const updatedOrders = orders.map(order => {
                if (order._id === orderId) {
                    return { ...order, status };
                }
                return order;
            });
            setOrders(updatedOrders.reverse()); // Reverse the order after update as well
        } catch (error) {
            console.error('Error updating order status:', error);
            setError("Failed to update order status");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Orders List</h1>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                    <thead className="bg-gray-200 text-gray-600">
                        <tr>
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Student Name</th>
                            <th className="py-3 px-4 text-left">Student Email</th>
                            <th className="py-3 px-4 text-left">Books Ordered</th>
                            <th className="py-3 px-4 text-left">Order Date</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order._id}>
                                <td className="py-3 px-4">{order._id}</td>
                                <td className="py-3 px-4">{order.userId.student_name}</td>
                                <td className="py-3 px-4">{order.userId.student_email}</td>
                                <td className="py-3 px-4">
                                    <ul>
                                        {order.orderItems.map(item => (
                                            <li key={item._id} className="mb-1">
                                                <span>{item.bookId.book_name}</span> - <span>{item.quantity}</span> - <span>{item.bookId.book_department}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="py-3 px-4">
                                    {new Date(order.orderDate).toLocaleString('en-US', {
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true // or false for 24-hour format
                                    })}
                                </td>

                                <td className="py-3 px-4">{order.totalAmount}</td>
                                <td className="py-3 px-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="px-2 py-1 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersList;
