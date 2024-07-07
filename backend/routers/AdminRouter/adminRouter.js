const AdminSchema = require("../../Schema/AdminSchema");
const express = require("express");
const router = express.Router();
const Book = require("../../Schema/BookSchema");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const verifyAdmin = require("../../middleware/verifyAdmin");



router.post("/signup", async (req, res) => {
    const { admin_name, admin_email, admin_password, admin_phone, admin_address } = req.body;

    if (!admin_name || !admin_email || !admin_password || !admin_phone || !admin_address) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const existingUser = await AdminSchema.findOne({ admin_email });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(admin_password, 10);

        const newUser = new AdminSchema({
            admin_name,
            admin_email,
            admin_password: hashedPassword,
            admin_phone,
            admin_address
        });
        await newUser.save();
        res.status(201).json({ message: "Admin created successfully" });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

router.post("/login", async (req, res) => {
    const { admin_email, admin_password } = req.body;
    if (!admin_email || !admin_password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await AdminSchema.findOne({ admin_email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const isPasswordCorrect = await bcrypt.compare(admin_password, user.admin_password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id , role: 'admin'}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 }); // 1 hour
        res.status(200).json({ message: "Login successful", token, admin_email });
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})

router.put('/update', verifyAdmin, async (req, res) => {
    const userId = req.user.id;
    const { admin_name, admin_email, admin_password, admin_phone, admin_address } = req.body;

    if (!admin_name || !admin_email || !admin_phone || !admin_address) {
        return res.status(400).json({ message: "All fields are required except password" });
    }

    try {
        const user = await AdminSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.admin_name = admin_name;
        user.admin_email = admin_email;
        user.admin_phone = admin_phone;
        user.admin_address = admin_address;

        if (admin_password) {
            user.admin_password = await bcrypt.hash(admin_password, 10);
        }

        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});


router.delete('/delete', verifyAdmin, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await AdminSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        await user.remove();
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
});


router.get("/profile", verifyAdmin, async (req, res) => {
    try {
        // Find the admin by ID
        const admin = await AdminSchema.findById(req.user.id).select('-admin_password');
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        // Find all books posted by the admin
        const books = await Book.find({ posted_by: req.user.id });

        // Respond with admin profile and books
        res.status(200).json({ admin, books });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ message: "Failed to fetch admin profile", error: error.message });
    }
});


module.exports = router;