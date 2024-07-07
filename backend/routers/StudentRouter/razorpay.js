const Razorpay = require('razorpay');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpay;


//sign - aa6490e6221d90aafe438493841ab2a4a5e607d3d38963e8faf6f9abcacc7180
//paymentId - pay_mock123456789