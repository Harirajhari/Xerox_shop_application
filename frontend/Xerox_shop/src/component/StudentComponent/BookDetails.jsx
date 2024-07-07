import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from '../Header';

function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/book/${id}`, { withCredentials: true });
        setBook(response.data.book);
      } catch (error) {
        console.error('There was an error fetching the book data!', error);
      }
    };
    fetchBook();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/cart/add-to-cart`, { bookId: id, quantity }, { withCredentials: true });
      setCartMessage('Book added to cart successfully!');
    } catch (error) {
      console.error('There was an error adding the book to the cart!', error);
      setCartMessage('Failed to add book to cart.');
    }
  };

  return (
    <div>
      <Header />
      <div className="mb-4 p-4">
        <h1 className="text-3xl font-bold text-center">Book Details</h1>
      </div>
      {book ? (
        <div className="p-4 bg-white rounded-lg shadow-md max-w-2xl mx-auto">
          <h1 className="font-bold text-2xl mb-2">Title: {book.book_name}</h1>
          <p>Year: {book.book_category}</p>
          <p>Dept: {book.book_department}</p>
          <p>Author: {book.book_author}</p>
          <p>Price: {book.book_price}</p>
          <div className="mt-4 flex items-center">
            <label htmlFor="quantity" className="mr-2">Quantity:</label>
            <input
              type="number"
              id="quantity"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-20 px-2 py-1 rounded-md border-gray-300 focus:ring-2 focus:ring-blue-500 shadow-md"
            />
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300"
          >
            Add to Cart
          </button>
          {cartMessage && <p className="mt-4 text-center text-green-500">{cartMessage}</p>}
        </div>
      ) : (
        <p className="text-center">Loading...</p>
      )}
    </div>
  );
}

export default BookDetails;
