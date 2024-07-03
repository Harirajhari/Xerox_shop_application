const jwt = require("jsonwebtoken");
require('dotenv').config();

const verifyStudent = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).send("Request denied");

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if (verified.role !== 'student') {
            return res.status(403).send("Access denied");
        }
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
};

module.exports = verifyStudent;
