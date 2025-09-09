const Joi = require('joi');

const purchaseSchema = Joi.object({
  username: Joi.string().required(),
  name: Joi.string().allow('', null),
  email: Joi.string().email().allow('', null),
  contactNumber: Joi.string().allow('', null),
  country: Joi.string().allow('', null),

  dateOfPurchase: Joi.date().required(),
  preferredTime: Joi.string().valid('10 AM','11 AM','12 PM').required(),
  preferredLocation: Joi.string().required(),
  productName: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  message: Joi.string().max(500).allow('', null)
});

function validatePurchaseBody(body) {
  const { error, value } = purchaseSchema.validate(body);
  if (error) return { error };

  const date = new Date(value.dateOfPurchase);
  const today = new Date();
  today.setHours(0,0,0,0);
  date.setHours(0,0,0,0);
  // date must be today or later
  if (date < today) {
    return { error: { details: [{ message: 'dateOfPurchase must be today or later' }] } };
  }
  // exclude Sundays (0 = Sunday)
  if (date.getDay() === 0) {
    return { error: { details: [{ message: 'dateOfPurchase cannot be on Sunday' }] } };
  }

  return { value };
}

module.exports = { validatePurchaseBody };
