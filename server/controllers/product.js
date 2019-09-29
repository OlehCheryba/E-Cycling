const mongoose = require('mongoose');
const Product = require('../models/product');

module.exports = {
  getProducts: (req, res) => {
    Product.find().exec()
      .then(productList => {
        res.status(200).json(productList);
      });
  },
  addProduct: (req, res) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      fileName: req.body.fileName
    });
    product.save()
      .then(() => {
        res.status(200).json({message: 'Succesfully'});
      })
      .catch(e => {
        console.log(e);
        res.status(500).json({message: 'Failed'});
      });
  },
  delProduct: (req, res) => {
    Product.remove({_id: req.params.productId}).exec()
      .then(() => {
        res.status(200).json({message: 'Succesfully'});
      });
  }
};