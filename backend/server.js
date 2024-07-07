const express = require("express");
const app = express();
const Dbconnect = require("./DbConnect/dbConnect")
const bodyParser = require('body-parser');
require("dotenv").config();
const port = process.env.port;
const StudentRouter = require("./routers/StudentRouter/studentRouter");
const AdminRouter = require("./routers/AdminRouter/adminRouter")
const BookRouter = require("./routers/AdminRouter/bookRouter");
const Order = require("./routers/StudentRouter/ordersRouter")
const Cart = require("./routers/StudentRouter/Cart_Router");
const AdminOrderList = require("./routers/AdminRouter/confirmCart")
const cors = require("cors");

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.json());

const corsOptions = {
    origin: 'http://localhost:5173', // Your frontend URL without trailing slash
    credentials: true // Allow cookies to be sent
  };
  
app.use(cors(corsOptions));



app.use("/student",StudentRouter);
app.use("/admin",AdminRouter);
app.use("/book",BookRouter);
app.use("/order",Order);
app.use("/cart",Cart);
app.use("/admin-order-list",AdminOrderList)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });