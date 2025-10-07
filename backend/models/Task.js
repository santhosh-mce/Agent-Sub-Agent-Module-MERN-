const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
    agent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', required: true },
    subAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'SubAgent' },
    firstName: String,
    phone: String,
    notes: String,
    status: { type: String, enum: ['pending', 'in-progress', 'done'], default: 'pending' },
    importedAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Task', TaskSchema);