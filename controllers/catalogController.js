var renderCatalog = function(req, res) {
    const viewName = 'catalog';
    res.render(viewName, { 
        title: 'Каталог', 
        activeView: viewName
      });
}

module.exports.catalog = function(req, res) {
    renderCatalog(req, res);
}