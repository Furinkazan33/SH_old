var Utils = require('../../../lib/utils');

var PlayerMgr = function(game, clients) {
  this._game = game;
  this._clients = clients;

  for (var index in clients) {
    this.handleClient(clients[index]);
  }
};

PlayerMgr.prototype = {
  handleClient: function(client) {

  },
  destroyAll: function() {

  }
};


module.exports = PlayerMgr;
