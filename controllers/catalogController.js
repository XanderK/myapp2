var renderCatalog = (req, res) => {
  const viewName = 'catalog';
  res.render(viewName, {
    title: 'Каталог',
    activeView: viewName,
    user: req.user
  });
}

module.exports.catalog = (req, res) => {
  renderCatalog(req, res);
}