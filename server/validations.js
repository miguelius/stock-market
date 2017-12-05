var Joi = require('joi');

var categoryBody = {
  name: Joi.string().min(2).required()
};

var postBody = {
  title: Joi.string().min(3).max(80).required(),
  body: Joi.string().required()
};

var tradeBody = {
  stock: Joi.string().min(3).max(5).required(),
  time: Joi.date().iso().required(),
  quantity: Joi.number().greater(0).required(),
  price: Joi.number().greater(0).required(),
  type: Joi.string().valid('buy', 'sell').required(),
};

module.exports = {
  trade: {
    body: tradeBody
  },
  category: {
    body: categoryBody
  },
  post: {
    body: postBody
  },
};
