import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    book_name: '',
    book_price: '',
    book_author: '',
    book_department: '',
    book_category: '',
  });
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await axios.get('http://localhost:8000/book/all', { withCredentials: true });
      setBooks(response.data.books);
    } catch (error) {
      setError('Failed to fetch books');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedBookId) {
        await axios.put(`http://localhost:8000/book/update/${selectedBookId}`, formData, { withCredentials: true });
        setMessage('Book updated successfully');
      } else {
        await axios.post('http://localhost:8000/book/insert', formData, { withCredentials: true });
        setMessage('Book added successfully');
      }
      setFormData({
        book_name: '',
        book_price: '',
        book_author: '',
        book_department: '',
        book_category: '',
      });
      setSelectedBookId(null);
      fetchBooks();
    } catch (error) {
      setError('Failed to submit form');
    }
  };

  const handleEdit = (book) => {
    setFormData({
      book_name: book.book_name,
      book_price: book.book_price,
      book_author: book.book_author,
      book_department: book.book_department,
      book_category: book.book_category,
    });
    setSelectedBookId(book._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/book/delete/${id}`, { withCredentials: true });
      setMessage('Book deleted successfully');
      fetchBooks();
    } catch (error) {
      setError('Failed to delete book');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">Manage Books</h1>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {message && <p className="text-green-500 text-center">{message}</p>}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              name="book_name"
              value={formData.book_name}
              onChange={handleChange}
              placeholder="Book Name"
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="book_price"
              value={formData.book_price}
              onChange={handleChange}
              placeholder="Book Price"
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="book_author"
              value={formData.book_author}
              onChange={handleChange}
              placeholder="Book Author"
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="book_department"
              value={formData.book_department}
              onChange={handleChange}
              placeholder="Book Department"
              className="p-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="book_category"
              value={formData.book_category}
              onChange={handleChange}
              placeholder="Book Category"
              className="p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md shadow-md hover:bg-blue-600 transition-colors duration-300 mt-4"
          >
            {selectedBookId ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      </div>

      <div className="mt-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Books List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-600">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Author</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {books.map((book) => (
                <tr key={book._id}>
                  <td className="py-3 px-4">{book.book_name}</td>
                  <td className="py-3 px-4">{book.book_price}</td>
                  <td className="py-3 px-4">{book.book_author}</td>
                  <td className="py-3 px-4">{book.book_department}</td>
                  <td className="py-3 px-4">{book.book_category}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-yellow-500 text-white py-1 px-2 rounded-md shadow-md hover:bg-yellow-600 transition-colors duration-300 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book._id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md shadow-md hover:bg-red-600 transition-colors duration-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageBooks;
