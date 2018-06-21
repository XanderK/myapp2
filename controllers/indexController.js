var renderHomePage = function(req, res) {
    const viewName = 'index';
    res.render(viewName, { 
        title: 'Главная',
        activeView: viewName
    });
}

module.exports.homePage = function(req, res) {
    renderHomePage(req, res);
}