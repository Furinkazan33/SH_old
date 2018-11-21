var Utils = require('../../../lib/utils');

var Game = require('../game');

var LobbyMgr = function(lobby) {
  this._lobby = lobby;
}

LobbyMgr.prototype = {
  handleClient: function(client) {
    client.handlePacket('disconnect', this.onDisconnect, this);

    client.handlePacket('lobby.client.join', this.onLobbyClientJoin, this);
    client.handlePacket('lobby.client.chat', this.onLobbyClientChat, this);

    client.handlePacket('lobby.client.challenge.request', this.onLobbyClientChallengeRequest, this);
    client.handlePacket('lobby.client.challenge.refuse', this.onLobbyClientChallengeRefuse, this);
    client.handlePacket('lobby.client.challenge.accept', this.onLobbyClientChallengeAccept, this);

    client.handlePacket('lobby.client.group.request', this.onLobbyClientGroupRequest, this);
    client.handlePacket('lobby.client.group.refuse', this.onLobbyClientGroupRefuse, this);
    client.handlePacket('lobby.client.group.accept', this.onLobbyClientGroupAccept, this);

    client.sendPacket('state.lobby.start');
  },

  onDisconnect: function(client, data) {
    this._removeClient(client);
  },

  onLobbyClientJoin: function(client, data) {
    Utils.socket.sendToAllExcept(this._lobby._clients, client, 'lobby.client.join', {
      clientUid: client.uid,
      clientName: client.name
    });
    client.sendPacket('lobby.client.list', this._lobby.getClientList());
  },
  onLobbyClientChat: function(client, data) {
    var message = data.message;
    if (message.trim() == "") {
      return;
    }

    Utils.socket.sendToAll(this._lobby._clients, 'lobby.client.chat', {
      client: {
        name: client.name
      },
      text: message
    });
  },

  onLobbyClientChallengeRequest: function(client, data) {
    if (client.uid == data.uid) {
      // Can't challenge self :)
      return;
    }

    var opponent = this._lobby.findClientByUid(data.uid);
    if (opponent == null) {
      client.sendPacket('lobby.client.request.error', {
        message: 'client not found'
      });
      return;
    }

    var request = {
      type: 'challenge',
      uid: Utils.random.uniqueId(),
      data: {
        initiator: client,
        players: [client, opponent]
      }
    };
    this._lobby.addRequest(request);

    opponent.sendPacket('lobby.client.request', {
      initiatorName: client.name,
      requestType: request.type,
      requestUid: request.uid
    });
  },
  onLobbyClientChallengeRefuse: function(client, data) {
    var request = this._lobby.findRequestByUid(data.requestUid);
    if (request == null) {
      return;
    }

    if (request.type != 'challenge') {
      return;
    }

    this._lobby.removeRequest(request);

    request.data.initiator.sendPacket('lobby.client.request.refuse', {
      message: 'Votre adversaire à refusé'
    });
  },
  onLobbyClientChallengeAccept: function(client, data) {
    var request = this._lobby.findRequestByUid(data.requestUid);
    if (request == null) {
      return;
    }

    if (request.type != 'challenge') {
      return;
    }

    this._lobby.removeRequest(request);

    this._lobby.addOnlineGame(new Game(request.data.players, {
      players: {
        amount: 2,
        skins: ['player_italia', 'player_italia']
      },
      events: {
        bonuses: true,
        penalties: true,
        others: true
      },
      goals: {
        tinEnabled: true
      },
      pitch: 'default',
      mode: 'online'
    }));

    // TODO avoid client been visible in lobby
    /*for (var index = 0; index < request.data.players.length; index++) {
      this._removeClient(request.data.players[index]);
    }*/
  },

  onLobbyClientGroupRequest: function(client, data) {
    if (client.uid == data.uid) {
      // Can't group self :)
      return;
    }

    var teamate = this._lobby.findClientByUid(data.uid);
    if (teamate == null) {
      client.sendPacket('lobby.client.request.error', {
        message: 'client not found'
      });
      return;
    }

    var group = teamate.getGroup();
    if (group != null) {
      client.sendPacket('lobby.client.request.error', {
        message: 'Votre partenaire est déjà dans un groupe'
      });
      return;
    }

    var request = {
      type: 'group',
      uid: Utils.random.uniqueId(),
      data: {
        initiator: client
      }
    };
    this._lobby.addRequest(request);

    teamate.sendPacket('lobby.client.request', {
      initiatorName: client.name,
      requestType: request.type,
      requestUid: request.uid
    });
  },
  onLobbyClientGroupRefuse: function(client, data) {
    var request = this._lobby.findRequestByUid(data.requestUid);
    if (request == null) {
      return;
    }

    if (request.type != 'group') {
      return;
    }

    this._lobby.removeRequest(request);

    request.data.initiator.sendPacket('lobby.client.request.refuse', {
      message: 'Votre partenaire à refusé'
    });
  },
  onLobbyClientGroupAccept: function(client, data) {
    var request = this._lobby.findRequestByUid(data.requestUid);
    if (request == null) {
      return;
    }

    if (request.type != 'group') {
      return;
    }

    var group = request.data.initiator.getGroup();
    if (group == null) {
      var group = {
        leader: client,
        uid: Utils.random.uniqueId(),
        players: [client]
      };
      request.data.initiator.setGroup(group);

      request.data.initiator.sendPacket('client.attributes.set', {
        attributes: [{
          name: 'groupUid',
          value: group.uid
        }]
      });
    }

    group.players.push(client);

    client.setGroup(group);
    client.sendPacket('client.attributes.set', {
      attributes: [{
        name: 'groupUid',
        value: group.uid
      }]
    });

    this._lobby.sendToAll('lobby.client.list', this._lobby.getClientList());
  },

  _removeClient: function(client) {
    this._lobby.removeClient(client);
    Utils.socket.sendToAll(this._lobby._clients, 'lobby.client.quit', {
      clientUid: client.uid,
      clientName: client.name
    });
  }
};


module.exports = LobbyMgr;
