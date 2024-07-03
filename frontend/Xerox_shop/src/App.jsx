import React from 'react'
import ListBook from './component/List_Book';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import OrderPage from './component/orderPage';

const App = () => {

const books = [
  {
    _id: uuidv4(),
    book_name: 'The Great Gatsby',
    book_price: 10.99,
    book_author: 'F. Scott Fitzgerald',
    book_department: 'IT',
    book_category: 'III',
  },
  {
    _id: uuidv4(),
    book_name: 'Introduction to Algorithms',
    book_price: 89.99,
    book_author: 'Thomas H. Cormen',
    book_department: 'CSE',
    book_category: 'II',
  },
  {
    _id: uuidv4(),
    book_name: 'To Kill a Mockingbird',
    book_price: 7.99,
    book_author: 'Harper Lee',
    book_department: 'MECH',
    book_category: 'I',
  },
  {
    _id: uuidv4(),
    book_name: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    book_price: 37.99,
    book_author: 'Robert C. Martin',
    book_department: 'ECE',
    book_category: 'IV',
  },
  {
    _id: uuidv4(),
    book_name: 'The Road to React',
    book_price: 29.99,
    book_author: 'Robin Wieruch',
    book_department: 'EEE',
    book_category: 'III',
  },
];



  return (

    <Router>
    <Routes>
      <Route path="/" element={<Home books = {books} />} />
      <Route path="/order/:_id" element={<OrderPage books = {books} />} />
    </Routes>
  </Router>
  )
}

const  Home = ({books}) => {
  return (
    <div>

      <ListBook book={books} /><div>

      <h1>Welcome</h1>
      <div className='fetchdata'>
        <table style={{border:"4px"}}>
          <thead>
            <tr>
            <th style={{ border: "1px solid black", padding: "8px" }}>Book Id</th>
            <th style={{ border: "1px solid black", padding: "8px" }}>Book Name</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Price</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Author</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Department</th>
              <th style={{ border: "1px solid black", padding: "8px" }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book, index) => (
              <tr key={index}>
                <td style={{ border: "1px solid black", padding: "8px" }}>{book._id}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{book.book_name}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{book.book_price}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{book.book_author}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{book.book_department}</td>
                <td style={{ border: "1px solid black", padding: "8px" }}>{book.book_category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>


    </div>
  )
}

export default App