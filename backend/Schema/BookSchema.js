const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    book_name: {
        type: String,
        required:true,
    },
    book_price: {
        type: Number,
        required:true,
    },
    book_author: {
        type: String,
        required:true,
    },
    book_department: {
        type: String,
    },
    //which Year's student book
    book_category: {
        type: String,
        required:true,
    },
    date_added: {
        type: Date,
        default: Date.now,
    },
    posted_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true,
    }
})

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;