const carBrands = require('../utils/car-brands');

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
    users: []
  });
}