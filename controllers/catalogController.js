// Управление каталогом
const Product = require('../api/models/Product');
const request = require('request');
const rp = require('request-promise');
const config = require('../api/config');
const helpers = require('../api/helpers');
const carBrands = require('../utils/car-brands');
const dateTime = require('../utils/DateTime');

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

const renderProductEditor = async (req, res, product) => {
  const activeView = 'productEditor';
  res.render(activeView, {
    title: 'Редактирование элемента каталога' ,
    activeView: activeView,
    user: req.user,
    editProduct: product,
    carModels: await getCarModels(req) 
  });
}

// Страница добавления нового элемента в каталог
module.exports.newProduct = (req, res) => {
  //let product = new Product();
  //product.model = new CarModel();
  if(req.user) renderProductEditor(req, res, null);
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
        renderProductEditor(req, res, body);
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

// Просмотр каталога
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
        let product = body[i];
        product.created = new Date(product.created);
        product.createdText = dateTime.toString(product.created);
        products.push(product);
      }
    }
    renderCatalogManager(req, res, products);
  });
}

// Создание елемента каталога через API
module.exports.createProduct = (req, res) => {
  const path = '/api/catalog';
  let options = {
    url: apiOptions.server + path,
    method: "POST",
    headers: {
      'x-access-token': req.session.token
    },
    json: true,
    form: {
      model: req.body.carModel,
      year: req.body.issueYear,
      name: req.body.name,
      engine: req.body.engine,
      responsible: req.body.responsible,
      description: req.body.description,
      owner: req.body.user
    }
  };

  request(options, (err, response, body) => {
    if(err) helpers.sendJSONresponse(res, 400, err);
    else res.redirect('/admin/catalog');
  });
}

// Обновление пользователя через API
module.exports.updateProduct = (req, res) => {
  let productId = req.body.id
  if (productId) {
    const path = '/api/catalog';
    let options = {
      url: apiOptions.server + path,
      method: "PUT",
      headers: {
        'x-access-token': req.session.token
      },
      json: true,
      form: {
        id: productId,
        model: req.body.carModel,
        year: req.body.issueYear,
        name: req.body.name,
        engine: req.body.engine,
        responsible: req.body.responsible,
        description: req.body.description,
        owner: req.body.user
        }
    };

    request(options, (err, response, body) => {
      if(err) { 
        helpers.sendJSONresponse(res, 400, err);
      }
      else if (response.statusCode === 200) {
        res.redirect('/admin/catalog');
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

// Удаление пользователя через API
module.exports.deleteProduct = (req, res) => {
  //helpers.sendJSONresponse(res, 200, req.body);
  const path = '/api/catalog';
  let options = {
    url: apiOptions.server + path,
    method: "DELETE",
    headers: {
      'x-access-token': req.session.token
    },
    json: true,
    form: {
      id: req.body.id
    }
  };

  request(options, (err, response, body) => {
    res.redirect('/admin/catalog');
  });
}
