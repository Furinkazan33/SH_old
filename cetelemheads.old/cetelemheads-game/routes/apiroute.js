var path = require('path');

var Utils = require('../lib/utils');

var ApiRoute = {
  listSkins: function(req, res, next) {
    res.json(Utils.io.readFileAsJSONSync(path.join(__dirname, '/../data/skins.json')));
  },
  listPitches: function(req, res, next) {
    res.json(Utils.io.readFileAsJSONSync(path.join(__dirname, '/../data/pitches.json')));
  }
};

module.exports = function(router) {
  router.get('/api/skins', ApiRoute.listSkins);
  router.get('/api/pitches', ApiRoute.listPitches);
}
