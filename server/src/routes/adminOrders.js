const express = require('express');
const prisma = require('../prisma');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { broadcast } = require('../ws/broadcast');

const router = express.Router();

// ADMIN ONLY: Get all orders with user and items
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ONLY: Update order status
router.patch('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    try {
      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: {
          items: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });

      // Broadcast order status change to all clients
      broadcast('orders-changed', { orderId: id, status });

      res.json(order);
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Order not found' });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

