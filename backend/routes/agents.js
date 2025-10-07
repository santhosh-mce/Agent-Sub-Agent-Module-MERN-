const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const Agent = require('../models/Agent'); // make sure Agent model exists

// Get all agents
router.get('/', auth, async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');
    res.json(agents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Add agent
router.post('/', auth, async (req, res) => {
  const { name, email, password, mobile, active, taskCapacity } = req.body;
  try {
    if (await Agent.findOne({ email })) return res.status(400).json({ msg: 'Agent exists' });

    const hashed = await bcrypt.hash(password, 10);
    const agent = new Agent({
      name,
      email,
      password: hashed,
      mobile,
      active: active ?? true,
      taskCapacity: taskCapacity ?? 10,
    });
    await agent.save();
    res.json({ msg: 'Agent added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Update agent
router.put('/:id', auth, async (req, res) => {
  const { name, email, password, mobile, active, taskCapacity } = req.body;
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) return res.status(404).json({ msg: 'Agent not found' });

    agent.name = name;
    agent.email = email;
    agent.mobile = mobile;
    agent.active = active;
    agent.taskCapacity = taskCapacity;
    if (password) {
      agent.password = await bcrypt.hash(password, 10);
    }

    await agent.save();
    res.json({ msg: 'Agent updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Delete agent
router.delete('/:id', auth, async (req, res) => {
  try {
    await Agent.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Agent deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
