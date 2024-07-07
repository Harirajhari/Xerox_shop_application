const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    orderDate: { type: Date, default: Date.now },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Completed', 'Cancelled'], default: 'Pending' },
    orderItems: [{ type: Schema.Types.ObjectId, ref: 'OrderItem' }],
    orderId: { type: String, required: true },
    paymentId: { type: String, required: true }
});

module.exports = mongoose.model('Order', orderSchema);
