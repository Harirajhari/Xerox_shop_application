import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Header from './Header';

function Dashboard() {
  const [data, setData] = useState([]);
  console.log(data);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("hello");
        const response = await axios.get('http://localhost:8000/book/all' , { withCredentials: true });
        setData(response.data.books);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <Header />
      <div className="mb-4 p-4">
        <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      </div>
      <div>
        {Array.isArray(data) && data.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {data.map((book, index) => (
              <Link key={index} to={`/book/${book._id}`} className="no-underline text-black">
                <div className="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h1 className="font-bold text-xl mb-2">Title: {book.book_name}</h1>
                  <p>Dept: {book.book_department}</p>
                  <p>Category: {book.book_category}</p>
                  <p>Price: {book.book_price}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center">No books available</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
