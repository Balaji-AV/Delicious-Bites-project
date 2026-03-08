const express = require('express');
const bcrypt = require('bcryptjs');
const prisma = require('../prisma');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Check if admin already exists
router.get('/check-setup', async (req, res) => {
  try {
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    res.json({ adminExists: !!adminUser });
  } catch (error) {
    console.error('Admin check error:', error);
    res.status(500).json({ message: 'Failed to check admin status' });
  }
});

// Create first admin account
router.post('/setup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'admin' }
    });

    if (existingAdmin) {
      return res.status(403).json({ message: 'Admin account already exists' });
    }

    // Check if email is already taken
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: 'admin'
      }
    });

    // Generate token
    const token = jwt.sign(
      { userId: admin.id, role: admin.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Admin account created successfully',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin setup error:', error);
    res.status(500).json({ message: 'Failed to create admin account' });
  }
});

module.exports = router;
