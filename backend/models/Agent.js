const mongoose = require('mongoose');

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['agent', 'admin'], default: 'agent' },
  active: { type: Boolean, default: true },           // <-- Active field
  taskCapacity: { type: Number, default: 10 },       // <-- Optional: max tasks allowed
  lastAssignedIndex: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Agent', AgentSchema);
