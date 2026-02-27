const express = require('express');
const prisma = require('../prisma');
const { verifyToken, verifyUser } = require('../middleware/auth');

const router = express.Router();

// USER ONLY: Create an order
router.post('/', verifyToken, verifyUser, async (req, res) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const productIds = items.map((i) => i.productId);
    if (productIds.some((id) => Number.isNaN(parseInt(id, 10)))) {
      return res.status(400).json({ message: 'Invalid product id in items' });
    }

    const products = await prisma.product.findMany({
      where: { id: { in: productIds.map((id) => parseInt(id, 10)) }, availability: true }
    });

    if (products.length !== items.length) {
      return res
        .status(400)
        .json({ message: 'One or more products are invalid or out of stock' });
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    let totalAmount = 0;
    const orderItems = items.map((item) => {
      const productId = parseInt(item.productId, 10);
      const product = productMap.get(productId);
      const quantity = item.quantity || 1;
      const price = product.price;
      totalAmount += price * quantity;
      return {
        productId,
        quantity,
        price
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        items: {
          create: orderItems
        }
      },
      include: {
        items: true
      }
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// USER ONLY: Get own orders
router.get('/my-orders', verifyToken, verifyUser, async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


