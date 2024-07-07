import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('http://localhost:8000/admin/profile', { withCredentials: true });
        setProfile(response.data);
      } catch (error) {
        setError("Failed to fetch profile");
      }
    };

    fetchProfile();
  }, []);

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  if (!profile) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Admin Profile</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
        <p><strong>Name:</strong> {profile.admin.admin_name}</p>
        <p><strong>Email:</strong> {profile.admin.admin_email}</p>
        <h3 className="text-xl font-semibold mt-6 mb-4">Books Posted</h3>
        <ul>
          {profile.books.map(book => (
            <li key={book._id} className="mb-2">
              <span className="font-semibold">{book.book_name}</span> by {book.book_author}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminProfile;
