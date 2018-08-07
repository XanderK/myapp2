const carBrands = require('../utils/car-brands');
//const User = require('../api/models/User');
//var Product = require('../api/models/Product');
const request = require('request');
const config = require('../api/config');
const helpers = require('../api/helpers');

const renderCatalogManager = (req, res, products) => {
  const activeView = 'catalogManager';
  res.render(activeView, {
    title: 'Ведение каталога',
    activeView: activeView,
    user: req.user,
    products: products
  });
}

const renderProduct = (req, res, product) => {
  const activeView = 'product';
  res.render(activeView, {
    title: 'Редактирование элемента каталога' ,
    activeView: activeView,
    user: req.user,
    editProduct: product
  });
}

// страница регистрации нового пользователя
module.exports.newProduct = (req, res) => {
  if(req.user) renderProduct(req, res, null);
}

// Редактирование элемента каталога
module.exports.editProduct = (req, res) => {
  let productId = req.body.id
  if (productId) {
    const path = '/api/catalog/' + productId;
    let options = {
      url: config.server + path,
      method: "GET",
      headers: {
        'x-access-token': req.session.token
      },
      json: true
    };
  
    request(options, (err, response, body) => {
      if(err) { 
        helpers.sendJSONresponse(res, 400, err);
      }
      else if (response.statusCode === 200) {
        renderProduct(req, res, body);
      }
      else {
        helpers.sendJSONresponse(res, response.statusCode, body);
      }
    })    
  }
  else {
    helpers.sendJSONresponse(res, 400, 'Bad request');
  }
}

// Каталог
module.exports.catalog = (req, res) => {
  const viewName = 'catalog';
  carBrands.allBrands((err, brands) => {
    if(err) return console.error(err);
    res.render(viewName, {
      title: 'Каталог',
      activeView: viewName,
      user: req.user,
      brands: brands
    });
  });
}

// Ведение каталога
module.exports.catalogManager = (req, res) => {
  const path = '/api/catalog';
  let options = {
    url: config.server + path,
    method: "GET",
    headers: {
      'x-access-token': req.session.token
    },
    json: true
  };

  request(options, (err, response, body) => {
    let products = [];
    if (err) {
      console.error(err);
    }
    else if (response.statusCode === 200) {
      for (let i = 0; i < body.length; i++) {
        products.push(body[i]);
      }
    }
    renderCatalogManager(req, res, products);
  });
}