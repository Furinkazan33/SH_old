var Utils = require('../../lib/utils');

var LobbyMgr = require('./managers/lobbymgr');

var Lobby = function() {
  this._clients = [];
  this._onlineGames = [];
  this._requests = [];

  this._lobbyMgr = new LobbyMgr(this);
}

Lobby.prototype = {
  addClient: function(client) {
    this._clients.push(client);
    this._lobbyMgr.handleClient(client);
  },
  removeClient: function(client) {
    Utils.array.removeElementBy(this._clients, 'name', client.name);
  },
  getClientList: function() {
    var clientDataList = [];

    for (var index in this._clients) {
      var client = this._clients[index];

      var clientData = {
        clientUid: client.uid,
        clientName: client.name,
        groupUid: null
      };

      var group = client.getGroup();
      if (group != null) {
        clientData.groupUid = group.uid;
      }

      clientDataList.push(clientData);
    }

    return clientDataList;
  },
  findClientByName: function(name) {
    return Utils.object.findObjectInCollectionBy(this._clients, 'name', name);
  },
  findClientByUid: function(uid) {
    return Utils.object.findObjectInCollectionBy(this._clients, 'uid', uid);
  },

  addRequest: function(request) {
    this._requests.push(request);
  },
  findRequestByUid: function(uid) {
    return Utils.object.findObjectInCollectionBy(this._requests, 'uid', uid);
  },
  removeRequest: function(request) {
    Utils.array.removeElementBy(this._requests, 'uid', request.uid);
  },

  addOnlineGame: function(game) {
    this._onlineGames.push(game);
  },
  removeOnlineGame: function(game) {
    var index = this._onlineGames.indexOf(game);
    if (index > -1) {
      this._onlineGames.slice(index, 1);
    }
  },
  findOnlineGameByUID: function(uid) {
    return Utils.object.findObjectInCollectionBy(this._onlineGames, '_configs.uid', uid);
  },
  findAndRemoveOnlineGameByUID: function(uid) {
    var game = this.findGameByUID(uid);
    if (game == null) {
      console.log('Error [Lobby.js#findAndRemoveGameByUID] : game with uid {'+uid+'} not found');
      return;
    }

    this.removeGame(game);
  },

  sendToAll: function(event, packet) {
    Utils.socket.sendToAll(this._clients, event, packet);
  },
  sendToAllExcept: function(client, event, packet) {
    Utils.socket.sendToAllExcept(this._clients, client, event, packet);
  }
}

module.exports = Lobby;
