const express = require('express');
const xss = require('xss');
const Purchase = require('../models/Purchase');
const checkJwt = require('../middleware/auth');
const { validatePurchaseBody } = require('../utils/validators');

const router = express.Router();

/**
 * Create purchase
 * - Requires a valid access token
 * - The backend trusts the token's 'sub' and optional 'nickname' or 'preferred_username' or 'email' fields
 */
router.post('/', checkJwt, async (req, res, next) => {
  try {
    // token info
    const token = req.auth || req.user || req.auth; // express-jwt attaches to req.auth or req.user depending on version
    const decoded = req.auth || req.user || req.auth;
    // express-jwt v7 attaches payload to req.auth
    const payload = req.auth || req.user || req.profile || {};

    // Determine unique identifier for the user (Auth0 'sub')
    const auth0Sub = payload.sub;
    if (!auth0Sub) return res.status(401).json({ message: 'Invalid token payload' });

    // Build body to validate
    const body = {
      ...req.body,
      username: req.body.username || payload.nickname || payload['https://example.com/username'] || payload.name || payload.email
    };

    // XSS sanitize incoming simple strings
    body.productName = xss(body.productName || '');
    body.preferredLocation = xss(body.preferredLocation || '');
    body.message = xss(body.message || '');
    body.preferredTime = xss(body.preferredTime || '');

    const { error, value } = validatePurchaseBody(body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Enforce that username in body matches token-derived username if user passed a username
    // However we use auth0Sub as ultimate owner key
    const purchase = new Purchase({
      auth0Sub,
      username: value.username,
      name: value.name,
      email: value.email,
      contactNumber: value.contactNumber,
      country: value.country,
      dateOfPurchase: value.dateOfPurchase,
      preferredTime: value.preferredTime,
      preferredLocation: value.preferredLocation,
      productName: value.productName,
      quantity: value.quantity,
      message: value.message
    });

    await purchase.save();
    res.status(201).json({ message: 'Purchase created', purchase });
  } catch (err) {
    next(err);
  }
});

/**
 * Get all purchases for the authenticated user
 */
router.get('/', checkJwt, async (req, res, next) => {
  try {
    const payload = req.auth || req.user || {};
    const auth0Sub = payload.sub;
    if (!auth0Sub) return res.status(401).json({ message: 'Invalid token payload' });

    const purchases = await Purchase.find({ auth0Sub }).sort({ dateOfPurchase: 1 }).lean();
    res.json({ purchases });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
