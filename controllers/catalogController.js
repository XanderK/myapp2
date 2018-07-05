const carBrands = require('../utils/car-brands');

var renderCatalog = (req, res) => {
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

module.exports.catalog = (req, res) => {
  renderCatalog(req, res);
}