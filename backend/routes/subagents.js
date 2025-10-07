const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const SubAgent = require('../models/SubAgent');
const User = require('../models/User');

// Get all sub-agents
router.get('/', auth, async (req, res) => {
  try {
    const subs = await SubAgent.find().populate('parentAgent', 'name email');
    res.json(subs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Create Sub-Agent
router.post('/', auth, async (req, res) => {
  try {
    const { name, email, phone, password, active, taskCapacity, parentAgent } = req.body;

    if (!parentAgent) return res.status(400).json({ msg: 'Parent Agent is required' });

    const sub = new SubAgent({
      name, email, phone, password, active, taskCapacity, parentAgent
    });
    await sub.save();
    res.json({ msg: 'Sub-Agent added', sub });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


// Update Sub-Agent
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    } else {
      delete updateData.password;
    }
    const updated = await SubAgent.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Sub-Agent not found' });
    res.json({ msg: 'Sub-Agent updated', sub: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Delete Sub-Agent
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await SubAgent.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: 'Sub-Agent not found' });
    res.json({ msg: 'Sub-Agent deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

module.exports = router;
