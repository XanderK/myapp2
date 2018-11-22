const Product = require('../models/Product');
const helpers = require('../helpers');

//import Product from '../models/Product';
//import helpers from '../helpers';
//import {promisify} from 'util';

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

module.exports.createProduct = async (req, res) => {
  let product = new Product({
    name: req.body.name,
    model: JSON.parse(req.body.model),
    engine: req.body.engine,
    year: req.body.year,
    description: req.body.description,
    responsible: req.body.responsible,
    owner: JSON.parse(req.body.owner)
  });
    
  try {
    product = await product.save();
  }
  catch(e) {
    return helpers.sendJSONresponse(res, 400, e);
  }

  // Сохранение изображений
  if(req.body.images) 
  {
    // в БД храним только имена файлов
    try {
      let filenames = await helpers.saveImages(product.id, req.body.images);
      product.images = filenames;
      await product.save();
    }
    catch(e) {
      return helpers.sendJSONresponse(res, 400, e);
    }
  }

  helpers.sendJSONresponse(res, 200, product);

  /*
  product.save((err, product) => {
    if(err) return helpers.sendJSONresponse(res, 400, err);
    helpers.sendJSONresponse(res, 200, product);
  });
  */

}

module.exports.updateProduct = (req, res) => {
  Product.findById(req.body.id).then(product => {
    product.name = req.body.name;
    product.model = JSON.parse(req.body.model);
    product.year = req.body.year;
    product.description = req.body.description;
    product.responsible = req.body.responsible;
    product.owner = JSON.parse(req.body.owner);
    
    if(req.body.images)
    {
      // в БД храним только имена файлов 
      //product.images = //req.body.images;
    }

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

