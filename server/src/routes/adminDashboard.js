const express = require('express');
const prisma = require('../prisma');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { broadcast } = require('../ws/broadcast');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// All routes below require admin authentication
router.use(verifyToken, verifyAdmin);

// ─── Dashboard Stats ─────────────────────────────────────
router.get('/stats', async (_req, res) => {
  try {
    const [totalOrders, revenue, activeItems, totalItems, customers, pendingOrders, recentOrders] =
      await Promise.all([
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { totalAmount: true } }),
        prisma.product.count({ where: { availability: true } }),
        prisma.product.count(),
        prisma.user.count({ where: { role: 'user' } }),
        prisma.order.count({ where: { status: 'Pending' } }),
        prisma.order.findMany({
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { id: true, name: true, email: true } },
            items: { include: { order: false } }
          }
        })
      ]);

    res.json({
      totalOrders,
      revenue: revenue._sum.totalAmount || 0,
      activeItems,
      totalItems,
      customers,
      pendingOrders,
      recentOrders
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Failed to load dashboard stats' });
  }
});

// ─── Customers List ──────────────────────────────────────
router.get('/customers', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'user' },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        _count: { select: { orders: true } }
      }
    });

    res.json(users);
  } catch (err) {
    console.error('Customers error:', err);
    res.status(500).json({ message: 'Failed to load customers' });
  }
});

// ─── Image Upload ────────────────────────────────────────
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file provided' });
  }

  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// ─── Delete uploaded image ───────────────────────────────
router.delete('/delete-image', (req, res) => {
  const { imageUrl } = req.body;
  if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
    return res.status(400).json({ message: 'Invalid image URL' });
  }

  const filename = path.basename(imageUrl);
  // Validate filename to prevent directory traversal
  if (filename.includes('..') || filename.includes(path.sep)) {
    return res.status(400).json({ message: 'Invalid filename' });
  }

  const filePath = path.join(__dirname, '..', '..', 'uploads', filename);

  fs.unlink(filePath, (err) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Delete image error:', err);
      return res.status(500).json({ message: 'Failed to delete image' });
    }
    res.json({ message: 'Image deleted' });
  });
});

module.exports = router;
