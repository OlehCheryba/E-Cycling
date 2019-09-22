const mongoose   = require('mongoose');
const multer     = require("multer");
const Product    = require('../models/product');

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/img/products/');
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    }
  })
});

module.exports = {
  getProducts: (req, res) => {
    Product.find().exec().then(productList => {
      res.send(productList);
    });
  },
  addFile: upload.single('filetoupload'),
  addProduct: (req, res) => {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      fileName: req.body.fileName
    });
    product.save()
      .then(product => {
        console.log(product);
        res.send();
      })
      .catch(e => console.log(e));
  },
  delProduct: (req, res) => {
    Product.remove({_id: req.params.productId}).exec().then(result => {
      console.log(result);
      res.send();
    });
  }
}