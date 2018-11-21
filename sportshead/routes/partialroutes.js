var express = require('express');
var router = express.Router();

var PartialRoutes = {
  get: function(req, res, next) {
    res.render('partials/'+req.params.partialName);
  }
};

module.exports = function(router) {
  router.get('/partials/:partialName', PartialRoutes.get);
}
