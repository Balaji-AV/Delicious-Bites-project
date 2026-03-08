const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../prisma');

const router = express.Router();

const createToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // Check if user already exists by email
    const existingUser = await prisma.user.findUnique({ 
      where: { email: email.toLowerCase().trim() } 
    });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists',
        suggestion: 'This email is already registered. Please login.' 
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user
    const user = await prisma.user.create({
      data: { 
        name: name.trim(), 
        email: email.toLowerCase().trim(), 
        password: passwordHash, 
        role: 'user' 
      }
    });
    
    // Generate JWT token
    const token = createToken(user);

    res.status(201).json({
      success: true,
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error('Registration error:', err);
    
    // Handle Prisma unique constraint errors
    if (err.code === 'P2002') {
      return res.status(400).json({ 
        message: 'User already exists',
        suggestion: 'This email is already registered. Please login.' 
      });
    }
    
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password, admin } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (admin && user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin account not found for this email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


