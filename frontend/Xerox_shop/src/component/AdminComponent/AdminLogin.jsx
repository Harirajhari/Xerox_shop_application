import React, { useState } from 'react';
import { FiLogIn, FiUserPlus } from 'react-icons/fi';
import axios from 'axios';

function AdminLoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [signupDetails, setSignupDetails] = useState({
    admin_name: '',
    admin_email: '',
    admin_password: '',
    admin_phone: '',
    admin_address: '',
  });
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/admin/login', {
        admin_email: loginEmail,
        admin_password: loginPassword,
      }, { withCredentials: true }); // Add withCredentials if necessary
      console.log('Login successful', response.data);
      localStorage.setItem('adminToken', response.data.token);
      window.location.href = '/admin/dashboard'; // Redirect to admin dashboard
    } catch (error) {
      console.error('Login error', error);
      setError('Invalid email or password');
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/admin/signup', signupDetails);
      console.log('Signup successful', response.data);
      setIsLogin(true); // Switch to login view after successful signup
    } catch (error) {
      console.error('Signup error', error);
      setError('Failed to sign up. Please check your details.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-indigo-500 p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">{isLogin ? 'Admin Login' : 'Admin Signup'}</h1>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {isLogin ? (
          <form onSubmit={handleLoginSubmit}>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:from-indigo-500 hover:to-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <FiLogIn />
              <span>Login</span>
            </button>
            <p className="mt-4 text-center">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className="text-blue-500 hover:underline"
              >
                Signup
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSignupSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Name"
                name="admin_name"
                className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
                value={signupDetails.admin_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                name="admin_email"
                className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
                value={signupDetails.admin_email}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                name="admin_password"
                className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
                value={signupDetails.admin_password}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Phone"
                name="admin_phone"
                className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
                value={signupDetails.admin_phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Address"
                name="admin_address"
                className="w-full px-4 py-2 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
                value={signupDetails.admin_address}
                onChange={handleInputChange}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-md shadow-md hover:from-indigo-500 hover:to-blue-500 transition-colors duration-300 flex items-center justify-center space-x-2"
            >
              <FiUserPlus />
              <span>Signup</span>
            </button>
            <p className="mt-4 text-center">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className="text-blue-500 hover:underline"
              >
                Login
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default AdminLoginSignup;
