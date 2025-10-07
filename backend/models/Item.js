const mongoose = require('mongoose');
const ItemSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'SubAgent'},
    uploadBatch: { type: String }
}, { timestamps: true });
module.exports = mongoose.model('Item', ItemSchema);