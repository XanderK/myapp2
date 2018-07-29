const Product = require('../models/Product');
const helpers = require('../helpers');

module.exports.allProducts = (req, res) => {
  Product.find().then(products => {
    helpers.sendJSONresponse(res, 200, products);
  }).catch(err => {
    console.error(err);
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.productById = (req, res) => {
  Product.findById(req.params.id).then(product => {
    helpers.sendJSONresponse(res, 200, product);
  }).catch(err => {
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.createProduct = (req, res) => {
  /*
  Product.register(new Product({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    role: req.body.role,
    created: Date.now()
  }),
    req.body.password,
    (err, user) => {
      if (err) return helpers.sendJSONresponse(res, 400, err);
      helpers.sendJSONresponse(res, 200, { auth: true, message: 'User "' + user.name + '" successfuly created.' });
    });
    */
}

module.exports.updateProduct = (req, res) => {
  Product.findById(req.body.id).then(product => {
    user.name = req.body.name;
    user.phone = req.body.phone;
    user.email = req.body.email;
    user.role = req.body.role;
      
    product.save((err, product) => {
      if(err) return helpers.sendJSONresponse(res, 400, err);
      helpers.sendJSONresponse(res, 200, product);
    });

  }).catch(err => {
    helpers.sendJSONresponse(res, 400, err);
  });
}

module.exports.deleteProduct = (req, res) => {
  Product.remove({ _id: req.body.id }, (err) => {
    if(err) helpers.sendJSONresponse(res, 400, err);
    helpers.sendJSONresponse(res, 200, { auth: true, message: 'Product with ID "' + req.body.id + '" successfuly deleted.' });
  });
}

