'use strict';

define([
  'Phaser',
  'NetworkHandler',
  'Container'
], function (Phaser, NetworkHandler, Container) {

  var LobbyState = function() {};

  LobbyState.prototype = {

    preload: function() {
      var resources = [
        '/templates/lobby/main.json'
      ];

      for (var index = 0; index < resources.length; index++) {
        this.game.load.json(resources[index], resources[index]);
      }
    },

    create: function() {
      var models = {
        players: new Container.Set()
      };

      /*var functions = {
        findPlayerByUid: function(uid) {
          return models.players.filterOne('clientUid', uid);
        },
        removePlayer: function(player) {
          models.players.remove(player);
        },
        updateLobbyPlayersList: function() {
          var lobbyPlayersList = EZGUI.components.lobbyPlayersList;
          GuiHelper.removeAllChildren({
            component: lobbyPlayersList
          });

          models.players.each(function(player) {
            var layoutComponentDefinition = {
              component: 'Layout',
              width: 300,
              height: 75,
              position: {"x": 0, "y": 0},
              layout: [3, 1],
              children: [{
                component: 'Label',
                width: 100,
                height: 75,
                position: "center left",
                text: player.clientName
              }, null]
            };

            var challengeButtonDefinition = {
              id: player.clientUid,
              component: "Button",
              width: 200,
              height: 70,
              position: "center",
              text: 'Affronter ce connard'
            };

            var layoutComponent = EZGUI.create(layoutComponentDefinition, 'metalworks')
            lobbyPlayersList.addChild(layoutComponent);

            if (player.clientUid != window['game.data'].clientUid) {
              var challengeButton = EZGUI.create(challengeButtonDefinition, 'metalworks')
              layoutComponent.addChild(challengeButton);

              GuiHelper.handleEvent({
                component: challengeButton,
                event: 'click',
                callback: functions._challengePlayer,
                context: this
              });

              challengeButton.update();
            }

            layoutComponent.update();
            lobbyPlayersList.update();
          });
        },
        _challengePlayer: function() {
          alert('what the ?');
        }
      };*/

      NetworkHandler.register({
        module: 'lobby',
        context: this,
        events: {
          'state.game.start': function(data) {
            this.game.state.start('game', true, false, data);
          },
          'lobby.client.join': function(data) {
            models.players.add(data);
            functions.updateLobbyPlayersList();
          },
          'lobby.client.quit': function(data) {
            var player = functions.findPlayerByUid(data.clientUid);
            if (player != null) {
              functions.removePlayer(player);
              functions.updateLobbyPlayersList();
            }
          },
          'lobby.client.list': function(data) {
            models.players = new Container.Set(data);
            functions.updateLobbyPlayersList();
          }
        }
      });

      GuiHelper.init({
        load: {
          theme: {
            urls: ['/bower_components/ezgui/assets/metalworks-theme/metalworks-theme.json'],
            callback: this._createUI,
            context: this
          }
        },
        create: {
          mainScreen: {
            json: this.game.cache.getJSON('/templates/lobby/main.json'),
            theme: 'metalworks'
          }
        },
        scope: this._scope
      });
    },

    _createUI: function() {
      this.game.socket.emit('lobby.client.join');
    }
  };

  return LobbyState;
});
