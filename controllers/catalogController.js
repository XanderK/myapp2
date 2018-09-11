// Управление каталогом
const Product = require('../api/models/Product');
const CarModel = require('../api/models/CarModel');
const request = require('request');
const rp = require('request-promise');
const config = require('../api/config');
const helpers = require('../api/helpers');
const carBrands = require('../utils/car-brands');

const apiOptions = {
  server: config.server
};

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

// Возвращает все модели авто
const getCarModels = async (req) => {
  const path = '/api/masterdata/carmodels';
  let options = {
    url: apiOptions.server + path,
    method: "GET",
    headers: {
      'x-access-token': req.session.token
    },
    json: true
  };

  let carModels = [];
  try {
    const body = await rp(options);
    for (let i = 0; i < body.length; i++) {
      let carModel = body[i];
      carModel.fullName = carModel.brand.name + ' ' + carModel.name + ' (' + carModel.startYear + ' - ' + (carModel.finishYear ? carModel.finishYear : '') + ')';
      carModels.push(carModel);
    }
  }
  catch(err) {
    console.error(err);
  }
  
  return carModels.sort((a, b) => {
    if (a.fullName > b.fullName) {
      return 1;
    }
    if (a.fullName < b.fullName) {
      return -1;
    }
    return 0;
  });
}

// Редактирование элемента какалога
const renderProductEditor = async (req, res, product) => {
  const activeView = 'productEditor';
  res.render(activeView, {
    title: 'Редактирование элемента каталога' ,
    activeView: activeView,
    user: req.user,
    product: product,
    carModels: await getCarModels(req) 
  });
}

// Страница добавления нового элемента в каталог
module.exports.newProduct = (req, res) => {
  let product = new Product();
  product.model = new CarModel();
  if(req.user) renderProductEditor(req, res, product);
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