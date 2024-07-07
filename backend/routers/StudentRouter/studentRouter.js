const StudentSchema = require("../../Schema/StudentSchema");
const express = require("express");
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const verifyStudent = require("../../middleware/verifyStudent")


router.post("/signup",async(req,res)=>{
    const {student_name,student_email,student_password,student_phone,student_year,student_department} = req.body;

    if(!student_name || !student_email || !student_password || !student_phone || !student_year || !student_department)
        {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const existingUser = await StudentSchema.findOne({student_email});
            if (existingUser) {
                return res.status(400).json({ message: "User with this email already exists" });
            }

            const hashedPassword = await bcrypt.hash(student_password, 10);

            const newUser = new StudentSchema({
                student_name,
                student_email,
                student_password: hashedPassword,
                student_phone,
                student_year,
                student_department
            });
            await newUser.save();
            res.status(201).json({ message: "User created successfully" });
            
        } catch (error) {
            res.status(500).json({ message: "Something went wrong" });
        }
});

router.post("/login",async(req,res)=>{
    const {student_email,student_password} = req.body;
    if(!student_email || !student_password)
        {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const user = await StudentSchema.findOne({student_email});
            if(!user){
                return res.status(400).json({ message: "Invalid credentials" });
            }
            
            const isPasswordValid = await bcrypt.compare(student_password,user.student_password)
            if (!isPasswordValid) {
                return res.status(400).json({ message: "Invalid email or password" });
            }
           const token = jwt.sign({ id: user._id ,role: 'student' }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'strict', maxAge: 3600000 }); // 1 hour
            res.status(200).json({ message: "Login successful", token,student_email});

        } catch (error) {
            console.error("Error during login:", error);
            res.status(500).json({ message: "Internal server error" });
        }
})

router.put('/update',verifyStudent,async(req,res)=>{
    const userId = req.user.id;
    const {student_name,student_email,student_phone,student_year,student_department} = req.body;

    if (!student_name || !student_email || !student_phone || !student_year || !student_department) {
        return res.status(400).json({ message: "All fields are required except password" });
    }

    try {
        const user = await StudentSchema.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.student_name = student_name;
        user.student_email = student_email;
        user.student_phone = student_phone;
        user.student_year = student_year;
        user.student_department = student_department;

        if (student_password) {
            user.student_password = await bcrypt.hash(student_password, 10);
        }
        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
    }
})

router.delete("/delete", verifyStudent, async (req, res) => {

    const userId = req.user.id

    try {
        const user = await UserSchema.findByIdAndDelete(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/profile', verifyStudent, async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await StudentSchema.findById(userId).select('-student_password'); // Exclude password from the result
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }   
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});



module.exports = router;