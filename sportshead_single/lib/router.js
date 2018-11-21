var path = require('path');
var fs = require('fs');
var express = require('express');
var router = express.Router();

module.exports = function(app) {
  var routeBasePath = path.join(__dirname, '/../routes/');
  var files = fs.readdirSync(routeBasePath);
  for (var index in files) {
    require(routeBasePath+files[index])(router);
  }
  app.use(router);
};
