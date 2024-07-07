    const express = require("express");
    const router = express.Router();
    const Book = require("../../Schema/BookSchema")
    const verifyAdmin = require("../../middleware/verifyAdmin");


    router.get("/all", async (req, res) => {
        try {
            const books = await Book.find().populate('posted_by', 'admin_name admin_email');
            res.status(200).json({ books });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });


    router.get('/:id', async (req, res) => {
        try {
        const { id } = req.params;
        const book = await Book.findById(id).populate('posted_by', 'admin_name admin_email');

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ book });
        } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        }
    });


    router.post("/insert", verifyAdmin, async (req, res) => {
        const { book_name, book_price, book_author, book_department, book_category } = req.body;

        if (!book_name || !book_price || !book_author || !book_category) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        try {
            const newBook = new Book({
                book_name,
                book_price,
                book_author,
                book_department,
                book_category,
                posted_by: req.user.id,
            });
            await newBook.save();
            res.status(201).json({ message: "Book added successfully", book: newBook });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });

    router.put("/update/:id", verifyAdmin, async (req, res) => {
        const { id } = req.params;
        const { book_name, book_price, book_author, book_department, book_category } = req.body;

        if (!book_name || !book_price || !book_author || !book_category) {
            return res.status(400).json({ message: "All required fields must be filled" });
        }

        try {
            const book = await Book.findById(id);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            if (book.posted_by.toString() !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to update this book" });
            }

            book.book_name = book_name;
            book.book_price = book_price;
            book.book_author = book_author;
            book.book_department = book_department;
            book.book_category = book_category;
            await book.save();

            res.status(200).json({ message: "Book updated successfully", book });
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
    });

    router.delete("/delete/:id", verifyAdmin, async (req, res) => {
        const { id } = req.params;
        try {
            const book = await Book.findById(id);
            if (!book) {
                return res.status(404).json({ message: "Book not found" });
            }

            if (book.posted_by.toString() !== req.user.id) {
                return res.status(403).json({ message: "Unauthorized to delete this book" });
            }

            await Book.deleteOne({ _id: id });
            res.status(200).json({ message: "Book deleted successfully" });
        } catch (error) {
            console.error('Error deleting book:', error);  
            res.status(500).json({ message: "Something went wrong" });
        }
    });


    module.exports = router; 