var Utils = require('../../../lib/utils');

var BonusesData = require('../../data/bonuses');
var PenaltiesData = require('../../data/penalties');
var OthersData = require('../../data/others');

var EventMgr = function(game, clients) {
  this._game = game;
  this._clients = clients;
  this._uid = Utils.random.uniqueId();

  this._allowedEvents = [];
  this._events = [];
  this._eventCreateTimeout = null;
  this._eventDestroyTimeout = [];
  this._eventEffectExpirationTimeout = [];

  for (var index in clients) {
    this.handleClient(clients[index]);
  }

  if (game._configs.events.bonuses) {
    this._allowedEvents = this._allowedEvents.concat(BonusesData);
  }
  if (game._configs.events.penalties) {
    this._allowedEvents = this._allowedEvents.concat(PenaltiesData);
  }
  if (game._configs.events.others) {
    this._allowedEvents = this._allowedEvents.concat(OthersData);
  }

  if (this._allowedEvents.length > 0) {
    this._eventCreateTimeout = this.startEventCreateTimeout();
  }
};

EventMgr.prototype = {
  handleClient: function(client) {
    client.handlePacket('game.event.take', this.onGameEventTake, this);
  },
  startEventCreateTimeout: function() {
    var that = this;

    var timeout = Utils.random.nextInt(this._game._configs.events.timeout.create.min, this._game._configs.events.timeout.create.max)*1000;
    return setTimeout(function() {
      that.createEvent();
    }, timeout);
  },
  startEventDestroyTimeout: function(event) {
    var that = this;

    var timeout = Utils.random.nextInt(this._game._configs.events.timeout.destroy.min, this._game._configs.events.timeout.destroy.max)*1000;
    return setTimeout(function() {
      that.destroyEvent(event, true);
    }, timeout);
  },
  createEvent: function() {
    var uid = Utils.random.uniqueId();
    var duration = Utils.random.nextInt(this._game._configs.events.duration.min, this._game._configs.events.duration.max)*1000;
    var x = Utils.random.nextInt(this._game._configs.events.position.x.min, this._game._configs.events.position.x.max);
    var y = Utils.random.nextInt(this._game._configs.events.position.y.min, this._game._configs.events.position.y.max);

    var event = {
      uid: uid,
      duration: duration,
      position: {
        x: x,
        y: y
      }
    };

    Utils.object.copy(this._allowedEvents[Utils.random.nextInt(0, this._allowedEvents.length)], event);

    this._events[uid] = event;
    this._eventDestroyTimeout[uid] = this.startEventDestroyTimeout(event);

    this._game.sendToAll('game.event.create', event);
    this._eventCreateTimeout = this.startEventCreateTimeout();
  },
  destroyEvent: function(event, sendToPlayer) {
    this._events.splice(event.uid, 1);
    if (sendToPlayer) {
      this._game.sendToAll('game.event.destroy', {
        eventUid: event.uid
      });
    }

    delete event;
  },
  destroyAll: function() {
    clearTimeout(this._eventCreateTimeout);

    for (var index in this._events) {
      var event = this._events[index];
      clearTimeout(this._eventDestroyTimeout[event.uid]);
      this.destroyEvent(event, false);
    }

    for (var index in this._clients) {
      var client = this._clients[index];
      client.socket.removeAllListeners('game.event.take');
    }
  },

  onGameEventTake: function(client, data) {
    var event = this._events[data.eventUid];
    if (event == null) {
      console.log('Error [EventMgr#handleClient]: Event {'+data.eventUid+'} non-existant');
      return;
    }

    clearTimeout(this._eventDestroyTimeout[event.uid]);
    clearTimeout(this._eventEffectExpirationTimeout[event.name]);
    this.destroyEvent(event, false);

    var taker = this._game.getPlayerByUID(data.takerUid);
    if (taker == null) {
      console.log('Error [EventMgr#handleClient]: Player {'+data.takerUid+'} non-existant');
    }

    var targets = null;
    var effectActivateEvent = '';
    switch (event.target) {
      case 'self':
      case 'other':
        if (event.target == 'self') {
          targets = this._game.getCurrentTeamPlayers(taker.team);
        }
        if (event.target == 'other') {
          targets = this._game.getOpponentTeamPlayers(taker.team);
        }

        effectActivateEvent = 'game.player.attributes.set';
        effectDeactivateEventName = 'game.player.attributes.reset';
      break;

      case 'ball':
        effectActivateEvent = 'game.ball.attributes.set';
        effectDeactivateEventName = 'game.ball.attributes.reset';
      break;

      case 'goal':
        // TODO
      break;
    }

    for (var index in targets) {
      var target = targets[index];

      client.sendPacket(effectActivateEvent, {
        targetUid: target.uid,
        attributes: event.attributes
      });
    }

    this._eventEffectExpirationTimeout[event.name] = setTimeout(function() {
      for (var index in targets) {
        var target = targets[index];

        client.sendPacket(effectDeactivateEventName, {
          targetUid: target.uid,
          attributes: Utils.object.getKeys(event.attributes)
        });
      }
    }, event.duration);
  }
};

module.exports = EventMgr;
