import React, { useState } from 'react';
import { FiUser } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';

function Header() {

    const navigate = useNavigate();
    const navigateToProfilePage = () => {
        navigate('/profile');
      }

    return (
        <div className="App">
        <header className="bg-blue-600 text-white p-4 shadow-lg">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Xerox Shop KIT</h1>
                <nav className="hidden md:flex space-x-4 ml-auto mr-4">
                    <Link to="/dashboard" className="hover:underline hover:text-black">Home</Link>
                    <Link to="/about" className="hover:underline hover:text-black">About</Link>
                    <Link to="/cart" className="hover:underline hover:text-black">Cart</Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <button className="bg-white text-blue-600 px-4 py-2 rounded-md hover:bg-gray-100 flex items-center space-x-2" onClick={navigateToProfilePage}>
                        <FiUser />
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </header>

        {/* Mobile Navigation Menu */}
        <nav className="md:hidden bg-blue-600 text-white p-4">
            <div className="container mx-auto flex space-x-4">
                <Link to="/dashboard" className="hover:underline hover:text-black">Home</Link>
                <Link to="/about" className="hover:underline hover:text-black">About</Link>
                <Link to="/cart" className="hover:underline hover:text-black">Cart</Link>
            </div>
        </nav>
    </div>
    );
}
export default Header;
