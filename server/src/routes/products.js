const express = require('express');
const prisma = require('../prisma');
const { verifyToken, verifyAdmin } = require('../middleware/auth');
const { broadcast } = require('../ws/broadcast');

const router = express.Router();

// PUBLIC / USER: Get all products (optionally filter by category or availability)
router.get('/', async (req, res) => {
  try {
    const { category, available } = req.query;
    const where = {};
    if (category) {
      where.category = category;
    }
    if (available === 'true') {
      where.availability = true;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: 'asc' }
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC / USER: Get single product by id
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ONLY: Add product
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { name, category, description, price, availability, imageUrl } = req.body;
    if (!name || !category || typeof price !== 'number') {
      return res
        .status(400)
        .json({ message: 'Name, category and numeric price are required' });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category,
        description: description || '',
        price,
        availability: availability !== undefined ? availability : true,
        imageUrl: imageUrl || null
      }
    });

    broadcast('products-changed', { productId: product.id, action: 'created' });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    if (err.code === 'P2002') {
      return res.status(400).json({ message: 'Product with this name and category exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ONLY: Edit product
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const { name, category, description, price, availability, imageUrl } = req.body;

    const data = {};
    if (name !== undefined) data.name = name;
    if (category !== undefined) data.category = category;
    if (description !== undefined) data.description = description;
    if (price !== undefined) data.price = price;
    if (availability !== undefined) data.availability = availability;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    try {
      const product = await prisma.product.update({
        where: { id },
        data
      });
      broadcast('products-changed', { productId: id, action: 'updated' });
      res.json(product);
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ONLY: Delete product
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    try {
      await prisma.product.delete({ where: { id } });
      broadcast('products-changed', { productId: id, action: 'deleted' });
      res.json({ message: 'Product deleted' });
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN ONLY: Change availability
router.patch('/:id/availability', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product id' });
    }

    const { availability } = req.body;
    if (availability === undefined) {
      return res.status(400).json({ message: 'Availability is required' });
    }

    try {
      const product = await prisma.product.update({
        where: { id },
        data: { availability }
      });
      broadcast('products-changed', { productId: id, action: 'availability' });
      res.json(product);
    } catch (err) {
      if (err.code === 'P2025') {
        return res.status(404).json({ message: 'Product not found' });
      }
      throw err;
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


