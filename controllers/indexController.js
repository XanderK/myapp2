var renderHomePage = (req, res) => {
  const viewName = 'index';
  res.render(viewName, {
    title: 'Главная',
    activeView: viewName
  });
}

module.exports.homePage = (req, res) => {
  renderHomePage(req, res);
}