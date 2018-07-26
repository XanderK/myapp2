const carBrands = require('../utils/car-brands');
//const User = require('../api/models/User');
var Product = require('../api/models/Product');

const renderProduct = (req, res, product) => {
  const activeView = 'product';
  res.render(activeView, {
    title: 'Редактирование элемента каталога',
    activeView: activeView,
    user: req.user,
    editProduct: null // new Product()
  });
}

// страница регистрации нового пользователя
module.exports.newProduct = (req, res) => {
  if(req.user) renderProduct(req, res, null);
}

module.exports.editProduct = (req, res) => {
  helpers.sendJSONresponse(res, 400, 'Bad request');
}

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

module.exports.catalogManager = (req, res) => {
  const viewName = 'catalogManager';
  res.render(viewName, {
    title: 'Редактирование каталога',
    activeView: viewName,
    user: req.user,
    products: []
  });
}