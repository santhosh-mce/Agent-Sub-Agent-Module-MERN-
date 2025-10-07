const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// -------------------- REGISTER --------------------
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ msg: 'Please provide name, email, and password' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // default role
    });

    await user.save();

    // Generate JWT token
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.json({ msg: 'User created successfully', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// -------------------- LOGIN --------------------
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    // Generate token
    const payload = { userId: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

    // Return token AND role
    res.json({ 
      msg: 'Login successful', 
      token, 
      role: user.role,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// -------------------- LOGOUT --------------------
router.post('/logout', (req, res) => {
  try {
    // For JWT, logout is client-side: instruct to remove token
    res.json({ msg: 'Logout successful. Please remove the token on client side.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});


module.exports = router;
