var Utils = require('../../../lib/utils');

var Game = require('../game');

var LobbyMgr = function(lobby) {
  this._lobby = lobby;
}

LobbyMgr.prototype = {
  handleClient: function(client) {
    var that = this;

    this._lobby.addClient(client);
    client.handlePacket('disconnect', this.onDisconnect, this);

    client.handlePacket('client.set.name', this.onClientSetName, this);

    client.handlePacket('lobby.join', this.onLobbyJoin, this);
    client.handlePacket('lobby.chat', this.onLobbyChat, this);
    client.handlePacket('lobby.challenge', this.onLobbyChallenge, this);
    client.handlePacket('lobby.challenge.refuse', this.onLobbyChallengeRefuse, this);
    client.handlePacket('lobby.challenge.accept', this.onLobbyChallengeAccept, this);
    client.handlePacket('lobby.game.start', this.onLobbyGameStart, this);
    client.handlePacket('lobby.game.quit', this.onLobbyGameQuit, this);
  },

  onDisconnect: function(client, data) {
    this._lobby.removeClient(client);
    Utils.socket.sendToAllExcept(this._lobby._clients, client, 'lobby.leave', {
      clientName: client.name
    });
  },

  onClientSetName: function(client, data) {
    client.name = data.clientName;
  },

  onLobbyJoin: function(client, data) {
    Utils.socket.sendToAllExcept(this._clients, client, 'lobby.join', {
      clientName: client.name
    });
  },
  onLobbyChat: function(client, data) {
    Utils.socket.sendToAllExcept(this._clients, client, 'lobby.join', {
      clientName: client.name,
      message: data.message
    });
  },
  onLobbyChallenge: function(client, data) {
    var opponent = this.findClientByName(data.clientName);
    if (opponent == null) {
      client.sendPacket('lobby.challenge.error', {
        message: 'client nor found'
      });
      return;
    }

    opponent.sendPacket('lobby.challenge.request', {
      initiator: client.name
    });
  },
  onLobbyChallengeRefuse: function(client, data) {
    var initiator = this.findClientByName(data.initiator);

    client.sendPacket('lobby.challenge.refuse', {
      message: 'Votre adversaire à refusé'
    });
  },
  onLobbyChallengeAccept: function(client, data) {
    var initiator = this.findClientByName(data.initiator);
    this.games.push(new Game([initiator, client]));
  },
  onLobbyGameStart: function(client, data) {
    this._lobby.addGame(new Game([client], data.options));
  },
  onLobbyGameQuit: function(client, data) {
    var game = this._lobby.findGameByUID(data.gameUid);
    if (game == null) {
      return;
    }

    game.destroyAll();
    this._lobby.removeGame(game);
  }
};


module.exports = LobbyMgr;
