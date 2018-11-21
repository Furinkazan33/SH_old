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
    client.handlePacket('game.player.move', this.onGamePlayerMove, this);
    client.handlePacket('game.player.shoot', this.onGamePlayerShoot, this);
    client.handlePacket('game.player.jump', this.onGamePlayerJump, this);
  },
  destroyAll: function() {
    for (var index in this._clients) {
      var client = this._clients[index];
      client.socket.removeAllListeners('game.player.move');
      client.socket.removeAllListeners('game.player.shoot');
      client.socket.removeAllListeners('game.player.jump');
    }
  },

  onGamePlayerMove: function(client, data) {
    Utils.socket.sendToAllExcept(this._clients, client, 'player.game.move', data);
  },
  onGamePlayerShoot: function(client, data) {
    Utils.socket.sendToAllExcept(this._clients, client, 'player.game.shoot', data);
  },
  onGamePlayerJump: function(client, data) {
    Utils.socket.sendToAllExcept(this._clients, client, 'player.game.jump', data);
  }
};


module.exports = PlayerMgr;
