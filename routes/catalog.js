var express = require('express');
var router = express.Router();

const viewName = 'catalog';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(viewName, { 
      title: 'Каталог', 
      activeView: viewName
    });
});

module.exports = router;
