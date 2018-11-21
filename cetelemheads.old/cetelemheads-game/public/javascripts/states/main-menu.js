'use strict';

define([
  'Phaser',
  'NetworkHandler'
], function (Phaser, NetworkHandler) {

  var MainMenuState = function() {};

  MainMenuState.prototype = {
    _scope: {
      players: {
        amount: 2,
        skins: ['player_italia', 'player_italia', 'player_italia', 'player_italia']
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
      mode: 'offline'
    },

    preload: function() {
      var resources = [
        '/templates/main-menu/main.json',
        '/templates/main-menu/offline.json',
        '/templates/main-menu/online.json'
      ];
      for (var index = 0; index < resources.length; index++) {
        this.game.load.json(resources[index], resources[index]);
      }

      var images = [
        '/images/assets/game/players/kevin.png',
        '/images/assets/game/players/mathieu.png',
        '/images/assets/game/players/player.png'
      ];
      for (var index = 0; index < images.length; index++) {
        this.game.load.image(images[index], images[index]);
      }

      //this.game.load.onLoadComplete.add(EZGUI.Compatibility.fixCache, this.game.load, null, images);
    },

    create: function() {
      NetworkHandler.register({
        module: 'main-menu',
        context: this,
        events: {
          'state.game.start': function(data) {
            //GuiHelper.removeAll();
            this.game.state.start('game', true, false, data);
          },
          'state.lobby.start': function(data) {
            //GuiHelper.removeAll();
            this.game.state.start('lobby', true, false, data);
          }
        }
      });

      var carousel = this.game.gui.add.carousel(400, 200, [
        '/images/assets/game/players/kevin.png',
        '/images/assets/game/players/mathieu.png',
        '/images/assets/game/players/player.png'
      ]);

      carousel.x = 100;
      carousel.y = 100;

      /*GuiHelper.init({
        load: {
          theme: {
            urls: ['/bower_components/ezgui/assets/metalworks-theme/metalworks-theme.json'],
            callback: this._createUI,
            context: this
          }
        },
        create: {
          mainScreen: {
            json: this.game.cache.getJSON('/templates/main-menu/main.json'),
            theme: 'metalworks'
          },
          offlinePopup: {
            json: this.game.cache.getJSON('/templates/main-menu/offline.json'),
            theme: 'metalworks'
          },
          onlinePopup: {
            json: this.game.cache.getJSON('/templates/main-menu/online.json'),
            theme: 'metalworks'
          }
        },
        scope: this._scope
      });*/
    },

    _createUI: function(mainScreen, offlinePopup, onlinePopup) {
      /*GuiHelper.handleEvent({
        component: EZGUI.components.offlineLaunchButton,
        event: 'click',
        callback: this._offlineStart,
        context: this
      })
      GuiHelper.handleEvent({
        component: EZGUI.components.onlineLaunchButton,
        event: 'click',
        callback: this._onlineStart,
        context: this
      });

      GuiHelper.handlePopup({
        showButton: EZGUI.components.offlineButton,
        hideButton: EZGUI.components.offlineCancelButton,
        popup: offlinePopup,
        parent: mainScreen
      });

      GuiHelper.handlePopup({
        showButton: EZGUI.components.onlineButton,
        hideButton: EZGUI.components.onlineCancelButton,
        popup: onlinePopup,
        parent: mainScreen
      });

      GuiHelper.bindModels({
        components: EZGUI.radioGroups['playerCount'],
        model: {
          object: this._scope.players,
          property: 'amount'
        }
      });
      GuiHelper.bindModel({
        component: EZGUI.components.enableBonuses,
        model: {
          object: this._scope.events,
          property: 'bonuses'
        }
      });
      GuiHelper.bindModel({
        component: EZGUI.components.enablePenalties,
        model: {
          object: this._scope.events,
          property: 'penalties'
        }
      });
      GuiHelper.bindModel({
        component: EZGUI.components.enableOthers,
        model: {
          object: this._scope.events,
          property: 'others'
        }
      });

      GuiHelper.bindModels({
        components: EZGUI.radioGroups['playerSkin0'],
        model: {
          object: this._scope.players.skins,
          property: '0'
        }
      });
      GuiHelper.bindModels({
        components: EZGUI.radioGroups['playerSkin1'],
        model: {
          object: this._scope.players.skins,
          property: '1'
        }
      });*/
    },

    _offlineStart: function() {
      this.game.socket.emit('mainmenu.offlinegame.start', this._scope);
    },

    _onlineStart: function() {
      /*var login = EZGUI.components.loginInput.text.trim();
      if (login == "") {
        return;
      }

      // TODO password
      // TODO check if login + password exists

      this.game.socket.emit('mainmenu.online.login', {
        login: login,
        password: ''
      })*/
    }
  };

  return MainMenuState;
});
