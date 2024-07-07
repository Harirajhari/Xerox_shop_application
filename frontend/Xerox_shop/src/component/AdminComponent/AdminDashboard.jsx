import React from "react";
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h1>
      <div className="flex justify-center">
        <Link to="/admin-order-list/orders-List" className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300 mx-2">Orders List</Link>
        <Link to="/admin/manage-books" className="bg-green-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-green-600 transition-colors duration-300 mx-2">Manage Books</Link>
        <Link to="/admin/profile" className="bg-purple-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-purple-600 transition-colors duration-300 mx-2">Profile</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
