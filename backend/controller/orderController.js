const Order = require('../models/Order');
const Product = require('../models/Product');

// Create a new order
exports.createOrder = async (req, res, next) => {
  try {
    const { date, deliveryTime, deliveryLocation, productId, quantity, message } = req.body;
    const username = req.user.username;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    // Check if date is a Sunday
    const orderDate = new Date(date);
    if (orderDate.getDay() === 0) {
      return res.status(400).json({ error: 'Delivery not available on Sundays' });
    }

    // Create new order
    const order = new Order({
      username,
      date,
      deliveryTime,
      deliveryLocation,
      product: productId,
      quantity,
      message,
      totalPrice: product.price * quantity
    });

    await order.save();
    
    // Populate product details
    await order.populate('product');
    
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// Get all orders for a user
exports.getUserOrders = async (req, res, next) => {
  try {
    const username = req.user.username;
    const orders = await Order.find({ username }).populate('product').sort({ date: -1 });
    res.json(orders);
  } catch (error) {
    next(error);
  }
};

// Get order by ID
exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('product');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if user owns this order
    if (order.username !== req.user.username && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json(order);
  } catch (error) {
    next(error);
  }
};