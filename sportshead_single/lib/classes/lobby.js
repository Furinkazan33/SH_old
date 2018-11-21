var Utils = require('./utils');
var Game = require('./game');

var Lobby = function() {
  this.players = [];
  this.games = [];
}

Lobby.prototype.handlePlayer = function(player) {
  var that = this;

  that.addPlayer(player);
  player.socket.on('disconnect', function() {
    that.removePlayer(player);
    Utils.socket.sendToAllExcept(that.players, player, 'player.lobby.leave', {
      playerName: player.name
    });
  });

  player.socket.on('player.set.name', function(data) {
    player.name = data.playerName
  });

  player.socket.on('player.lobby.join', function(data) {
    Utils.socket.sendToAllExcept(that.players, player, 'player.lobby.join', {
      playerName: player.name
    });
  });

  player.socket.on('player.lobby.chat', function(data) {
    Utils.socket.sendToAllExcept(that.players, player, 'player.lobby.join', {
      playerName: player.name,
      message: data.message
    });
  });

  player.socket.on('player.lobby.challenge', function(data) {
    var opponent = that.findPlayerByName(data.playerName);
    if (opponent == null) {
      player.sendPacket('player.lobby.challenge.error', {
        message: 'Player nor found'
      });
      return;
    }

    opponent.sendPacket('player.lobby.challenge.request', {
      initiator: player.name
    });
  });
  player.socket.on('player.lobby.challenge.refuse', function(data) {
    var initiator = that.findPlayerByName(data.initiator);

    player.sendPacket('player.lobby.challenge.refuse', {
      message: 'Votre adversaire à refusé'
    });
  });
  player.socket.on('player.lobby.challenge.accept', function(data) {
    var initiator = that.findPlayerByName(data.initiator);
    that.games.push(new Game([initiator, player]));
  });
}

Lobby.prototype.addPlayer = function(player) {
  this.players.push(player);
}
Lobby.prototype.removePlayer = function(player) {
  var index = this.players.indexOf(player);
  if (index > -1) {
    this.players.slice(index, 1);
  }
}
Lobby.prototype.findPlayerByName = function(playerName) {
  for (var index in this.players) {
    var player = this.players[index];
    if (player.name == playerName) {
      return player;
    }
  }
}

module.exports = Lobby;
