var express = require('express');
var router = express.Router();

var IndexRoute = {
  index: function(req, res, next) {
    res.render('index', { title: 'SportsHead' });
  }
};

module.exports = function(router) {
  router.get('/', IndexRoute.index);
}
