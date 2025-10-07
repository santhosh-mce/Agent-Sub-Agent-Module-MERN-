const mongoose = require('mongoose');

const SubAgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  active: { type: Boolean, default: true },
  taskCapacity: { type: Number, default: 10 },
  parentAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SubAgent', SubAgentSchema);
