import express from 'express';
import Product from '../models/Product.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// All product routes are protected
router.use(protect);

// Create product
router.post('/', async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || price == null) return res.status(400).json({ error: 'Name and price required' });
    const product = await Product.create({ name, price, description, createdBy: req.user._id });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().populate('createdBy', 'name email role');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get my products
router.get('/mine', async (req, res) => {
  try {
    const products = await Product.find({ createdBy: req.user._id });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update product (owner only)
router.put('/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    const isOwner = prod.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    const { name, price, description } = req.body;
    if (name !== undefined) prod.name = name;
    if (price !== undefined) prod.price = price;
    if (description !== undefined) prod.description = description;

    const updated = await prod.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete product (owner or admin)
router.delete('/:id', async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    const isOwner = prod.createdBy.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

    await prod.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
