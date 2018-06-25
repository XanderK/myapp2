
var renderHomePage = (req, res) => {
  const viewName = 'index';
  res.render(viewName, {
    title: 'Главная',
    activeView: viewName,
    user: req.user
  });
}

module.exports.homePage = (req, res) => {
  renderHomePage(req, res);
}