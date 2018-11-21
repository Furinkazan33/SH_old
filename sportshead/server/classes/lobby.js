var Utils = require('../../lib/utils');

var LobbyMgr = require('./managers/lobbymgr');

var Lobby = function() {
  this._clients = [];
  this._games = [];

  this._lobbyMgr = new LobbyMgr(this);
}

Lobby.prototype = {
  _findPropertyBy: function(properties, field, value) {
    for (var index in properties) {
      var property = properties[index];

      if (Utils.object.getPropertyValue(property, field) == value) {
        return property;
      }
    }
    return null;
  },

  addClient: function(client) {
    this._clients.push(client);
  },
  removeClient: function(client) {
    var index = this._clients.indexOf(client);
    if (index > -1) {
      this._clients.slice(index, 1);
    }
  },
  findClientByName: function(name) {
    return this._findPropertyBy(this._clients, 'name', name);
  },

  addGame: function(game) {
    this._games.push(game);
  },
  removeGame: function(game) {
    var index = this._games.indexOf(game);
    if (index > -1) {
      this._games.slice(index, 1);
    }
  },
  findGameByUID: function(uid) {
    return this._findPropertyBy(this._games, '_configs.uid', uid);
  },
  findAndRemoveGameByUID: function(uid) {
    var game = this.findGameByUID(uid);
    if (game == null) {
      console.log('Error [Lobby.js#findAndRemoveGameByUID] : game with uid {'+uid+'} not found');
      return;
    }

    this.removeGame(game);
  }
}

module.exports = Lobby;
