const express = require("express");
const app = express();
const Dbconnect = require("./DbConnect/dbConnect")
const bodyParser = require('body-parser');
require("dotenv").config();
const port = process.env.port;
const StudentRouter = require("./routers/studentRouter");
const AdminRouter = require("./routers/adminRouter")
const BookRouter = require("./routers/bookRouter");
const Order = require("./routers/ordersRouter")

const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/student",StudentRouter);
app.use("/admin",AdminRouter);
app.use("/book",BookRouter);
app.use("/order",Order);

app.listen(port,()=>{
    console.log("server is running on port");
})