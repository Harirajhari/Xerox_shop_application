import React from "react"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentProfile from './component/StudentComponent/Profile';
import Dashboard from "./component/Dashboard"
import BookDetails from "./component/StudentComponent/BookDetails";
import StudentLogin from "./component/StudentComponent/Login"
import Cart from "./component/StudentComponent/Cart";
import AdminLogin from "./component/AdminComponent/AdminLogin";
import AdminDashboard from "./component/AdminComponent/AdminDashboard";
import OrdersList from "./component/AdminComponent/OrdersList";
import AdminProfile from "./component/AdminComponent/AdminProfile";
import ManageBooks from "./component/AdminComponent/ManageBooks";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StudentLogin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<StudentProfile />} />
        <Route path="/book/:id" element={<BookDetails />} />


        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin-order-list/orders-list" element={<OrdersList />} />
        <Route path="/admin/profile" element={<AdminProfile />} />
        <Route path="/admin/manage-books" element={<ManageBooks />} />
      </Routes>
    </Router>
  )
}

export default App