var express = require('express');
var router = express.Router();

const viewName = 'index';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(viewName, { 
    title: 'Главная',
    activeView: viewName
  });
});

module.exports = router;
