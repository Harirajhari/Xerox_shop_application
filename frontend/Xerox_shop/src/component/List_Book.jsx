import React from 'react'
import { Link } from 'react-router-dom';
import "./style/list_book.css";

const ListBook = ({book}) => {
  return (
<div className="book-grid">
      {book!=null && book.map((item, index) => (
        <div key={item._id} className="book-card">
          <h5 className="book-title">
            {item.book_name}
          </h5>
          <p className="book-details">
            Author: {item.book_author}
          </p>
          <p className="book-details">
            Department: {item.book_department}
          </p>
          <p className="book-details">
            Category: {item.book_category}
          </p>
          <p className="book-details">
            Price: ${item.book_price}
          </p>
         <Link to={`/order/${item._id}`} key={item._id} className='book-button'>Order Here</Link>
        </div>
      ))}
    </div>
    )
}

export default ListBook