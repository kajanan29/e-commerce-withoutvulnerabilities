const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  auth0Sub: { type: String, required: true }, // user's unique id from IdP (sub)
  username: { type: String, required: true }, // username from id token
  name: String,
  email: String,
  contactNumber: String,
  country: String,

  dateOfPurchase: { type: Date, required: true },
  preferredTime: { type: String, enum: ['10 AM', '11 AM', '12 PM'], required: true },
  preferredLocation: { type: String, required: true }, // district
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  message: { type: String, maxlength: 500 },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
