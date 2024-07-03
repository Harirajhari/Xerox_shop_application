const mongoose = require("mongoose");
require("dotenv").config();

const DbConnect = process.env.DbConnect;

mongoose.connect(DbConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log("Successfully connected to the database...");
})
.catch((error) => {
    console.error("Error connecting to the database:", error);
});

module.exports = mongoose.connection;
