var path = require('path');

var Utils = require('../../lib/utils');

var Player = require('./player');
var EventMgr = require('./managers/eventmgr');
var GameMgr = require('./managers/gamemgr');
var PlayerMgr = require('./managers/playermgr');

var Game = function(clients, options) {
  this._clients = clients;
  this._lastScoreTimestamp = new Date().getTime();
  this._scores = {
    left: 0,
    right: 0
  };

  this._skinDatas = Utils.io.readFileAsJSONSync(path.join(__dirname, '../../data/skins.json'));
  this._pitcheDatas = Utils.io.readFileAsJSONSync(path.join(__dirname, '../../data/pitches.json'));

  this._players = [];
  this._pitch = null;
  this._configs = Utils.require.requireUncached('../configs/globals');
  this._goals = Utils.require.requireUncached('../configs/goals');
  this._balls = Utils.require.requireUncached('../configs/balls');
  this._displays = Utils.require.requireUncached('../configs/displays');

  this.updateConfigs(this._configs, options);
  this.buildPlayers(options);
  this.buildPitch(options);

  this._gameMgr = new GameMgr(this, clients);
  this._eventMgr = new EventMgr(this, clients);
  this._playerMgr = new PlayerMgr(this, clients);
};

Game.prototype = {
  removeClient: function(client) {
    var index = this._clients.indexOf(client);
    if (index > -1) {
      this._clients.splice(index, 1);
    }
  },

  findPlayerByUid: function(uid) {
    return Utils.object.findObjectInCollectionBy(this._players, 'uid', uid);
  },
  findGoalByUid: function(uid) {
    return Utils.object.findObjectInCollectionBy(this._goals, 'uid', uid);
  },
  findBallByUid: function(uid) {
    return Utils.object.findObjectInCollectionBy(this._balls, 'uid', uid);
  },
  findDisplayByName: function(name) {
    return Utils.object.findObjectInCollectionBy(this._displays, 'name', name);
  },
  getCurrentTeamPlayers: function(team) {
    var teamPlayers = [];

    for (var index in this._players) {
      var player = this._players[index];
      if (player.team == team) {
        teamPlayers.push(player);
      }
    }

    return teamPlayers;
  },
  getOpponentTeamPlayers: function(team) {
    var teamPlayers = [];

    for (var index in this._players) {
      var player = this._players[index];
      if (player.team != team) {
        teamPlayers.push(player);
      }
    }

    return teamPlayers;
  },

  updateConfigs: function(configs, options) {
    Utils.object.mergeObject(options.events, configs.events);
    Utils.object.mergeObject(options.goals, configs.goals);
    configs.mode = options.mode;
  },
  buildPlayers: function(options) {
    for (var index = 0; index < options.players.amount; index++) {
      var clientUid = '';
      if (options.mode == 'offline') {
        clientUid = this._clients[0].uid;
      } else {
        clientUid = this._clients[index].uid;
      }

      var player = {
        uid: Utils.random.uniqueId(),
        clientUid: clientUid,
        inputs: this._configs.players.inputs[options.mode][options.players.amount][index],
        position: this._configs.players.positions[index],
        velocity: {
          x: 0,
          y: 0
        },
        isShooting: false,
        speeds: this._configs.players.speeds,
        sprite: options.players.skins[index] || 'player_italia',
        team: (index % 2 == 0) ? 'left' : 'right',
        host: (index == 0 && options.mode == 'online')
      };

      this._players.push(player);
    }
  },
  buildPitch: function(options) {
    for (var index in this._pitcheDatas) {
      var pitch = this._pitcheDatas[index];
      if (pitch.id == options.pitch) {
        this._pitch = pitch;
        break;
      }
    }
  },

  getPitch: function() {
    for (var index in this._pitches) {
      var pitch = this._pitches[index];
      if (pitch.selected) {
        return pitch;
      }
    }
  },

  getWinner: function() {
    for (var index in this._scores) {
      if (this._scores[index] >= this._configs.scores.max) {
        return index;
      }
    }
    return null;
  },
  sendToAll: function(event, packet) {
    Utils.socket.sendToAll(this._clients, event, packet);
  },
  sendToAllExcept: function(client, event, packet) {
    Utils.socket.sendToAllExcept(this._clients, client, event, packet);
  },
  destroyAll: function() {
    this._gameMgr.destroyAll();
    this._eventMgr.destroyAll();
    this._playerMgr.destroyAll();
  }
}

module.exports = Game;
