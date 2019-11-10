const mongoose = require('mongoose');
const Product = require('../models/product');

module.exports = {
  getProducts: (req, res) => {
    const pageSize = req.query.size;
    const skipCount = (req.query.page - 1) * pageSize;
    Product.find().limit(+pageSize).skip(+skipCount)
      .then(productList => {
        res.status(200).json({
          products: productList,
          totalCount: 7
        });
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
        res.status(200).json({ message: 'Succesfully' });
      })
      .catch(() => {
        res.status(500).json({ message: 'Failed' });
      });
  },
  delProduct: (req, res) => {
    Product.remove({_id: req.params.productId})
      .then(() => {
        res.status(200).json({ message: 'Succesfully' });
      });
  }
};