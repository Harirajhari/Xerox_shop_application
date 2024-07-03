import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import "./style/list_book.css"

const OrderPage = ({books}) => {
    const {_id} = useParams();

    const[fetchdata,setfetchdata] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchbook = async () => {
        try {
          if (books && books.length > 0) {
            const response = books.find((item) => item._id === _id);
            setfetchdata(response);
          }
        } catch (error) {
          console.log(error);
        }
      };
      fetchbook();
    }, [_id ,books]);


    if (!fetchdata) {
      return <div>Loading...</div>;
    }

  return (
    <div>
      <h1>orderPage  {fetchdata.book_name}</h1>
      <div key={fetchdata._id} className="book-card">
        <h5 className="book-title">{fetchdata.book_name}</h5>
        <p className="book-details">Author: {fetchdata.book_author}</p>
        <p className="book-details">Department: {fetchdata.book_department}</p>
        <p className="book-details">Category: {fetchdata.book_category}</p>
        <p className="book-details">Price: ${fetchdata.book_price}</p>
      </div>
    </div>
  )
}

export default OrderPage