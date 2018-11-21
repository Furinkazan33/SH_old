var Utils = require('./utils');

var Game = function(players) {
  this.players = players;

  for (var index in players) {
    this.handlePlayer(players[index]);
  }
};

Game.prototype.handlePlayer = function(player) {
  var that = this;

  player.socket.on('player.game.move', function(data) {
    Utils.socket.sendToAllExcept(that.players, player, 'player.game.move', data);
  });

  player.socket.on('player.game.shoot', function(data) {
    Utils.socket.sendToAllExcept(that.players, player, 'player.game.shoot', data);
  });

  player.socket.on('player.game.jump', function(data) {
    Utils.socket.sendToAllExcept(that.players, player, 'player.game.jump', data);
  });

  player.socket.emit('player.game.start', {
    network: true,
    position: that.players.indexOf(player) == 0 ? 'left' : 'right'
  });
}

module.exports = Game;
