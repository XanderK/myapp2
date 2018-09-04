const Product = require('../api/models/Product');
const CarBrand = require('../api/models/CarBrand');
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
    title: 'Просмотр элемента каталога' ,
    activeView: activeView,
    user: req.user,
    product: product
  });
}


async function getCarBrands() {
  const path = '/api/masterdata/carbrands';
  let options = {
    url: apiOptions.server + path,
    method: "GET",
    headers: {
      'x-access-token': req.session.token
    },
    json: true
  };

  let carBrands = [];
  await request(options, (err, response, body) => {
    if (err) {
      console.error(err);
    }
    else if (response.statusCode === 200) {
      for (let i = 0; i < body.length; i++) {
        carBrands.push(body[i]);
      }
    }
    return carBrands;
  });  
}

const renderProductEdit = (req, res, product) => {
  const activeView = 'productEdit';
  res.render(activeView, {
    title: 'Редактирование элемента каталога' ,
    activeView: activeView,
    user: req.user,
    product: product ? product : new Product(),
    carBrands: carBrands 
  });
}

// Возвращает все марки авто
const allCarBrands = () => {

}

// Страница добавления нового элемента в каталог
module.exports.newProduct = (req, res) => {
  if(req.user) renderProductEdit(req, res, null);
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
        renderProductEdit(req, res, body);
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