var Utils = require('../../lib/utils');

var Player = require('./player');
var EventMgr = require('./managers/eventmgr');
var GameMgr = require('./managers/gamemgr');
var PlayerMgr = require('./managers/playermgr');

var Game = function(clients, options) {
  this._clients = clients;
  this._players = [];
  this._lastScoreTimestamp = new Date().getTime();
  this._scores = {
    left: 0,
    right: 0
  };

  this._configs = Utils.require.requireUncached('../configs/globals');
  this._skins = Utils.require.requireUncached('../configs/skins')
  this._goals = Utils.require.requireUncached('../configs/goals');
  this._balls = Utils.require.requireUncached('../configs/balls');
  this._displays = Utils.require.requireUncached('../configs/displays');
  this._pitches = Utils.require.requireUncached('../configs/pitches');

  this.updatePlayers(this._players, options)
  this.updateConfigs(this._configs, options);

  this._gameMgr = new GameMgr(this, clients);
  this._eventMgr = new EventMgr(this, clients);
  this._playerMgr = new PlayerMgr(this, clients);
};

Game.prototype = {
  getPlayerByUID: function(uid) {
    for (var index in this._players) {
      var player = this._players[index];
      if (player.uid == uid) {
        return player;
      }
    }
    return null;
  },
  getGoalByUID: function(uid) {
    for (var index in this._goals) {
      var goal = this._goals[index];
      if (goal.uid == uid) {
        return goal;
      }
    }
    return null;
  },
  getDisplayByName: function(name) {
    for (var index in this._displays) {
      var display = this._displays[index];
      if (display.name == name) {
        return display;
      }
    }
    return null;
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

  updatePlayers: function(players, options) {
    for (var index = 0; index < options.players.amount; index++) {
      var player = {
        uid: Utils.random.uniqueId(),
        inputs: this._configs.players.inputs[options.players.amount][index],
        position: this._configs.players.positions[index],
        speeds: this._configs.players.speeds,
        sprite: options.players.skins[index] || 'player_italia',
        team: (index % 2 == 0) ? 'left' : 'right'
      };

      players.push(player);
    }
  },

  updateConfigs: function(configs, options) {
    Utils.object.mergeObject(configs.events, options.events);
    Utils.object.mergeObject(configs.goals, options.goals);
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
  destroyAll: function() {
    this._gameMgr.destroyAll();
    this._eventMgr.destroyAll();
    this._playerMgr.destroyAll();
  }
}

module.exports = Game;
