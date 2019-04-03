
var renderHomePage = (req, res) => {
  const viewName = 'index';
  res.render(viewName, {
    title: 'Разборка на Лепешинского в Гомеле',
    activeView: viewName,
    user: req.user
  });
}

module.exports.homePage = (req, res) => {
  renderHomePage(req, res);
}