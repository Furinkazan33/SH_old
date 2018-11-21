'use strict';

function MainMenuState() {};

MainMenuState.prototype = {
  preload: function() {},

  create: function() {
    window.location.hash = 'main-menu';

    var that = this;

    this.game.socket.on('game.start', function(data) {
      window.location.hash = 'game';
      that.game.state.start('game', true, false, data);
    });

    /*DomHelper.init('game-gui');
    DomHelper.load('/templates/main-menu/main.tpl', function(element) {
      element.setMainComponent();

      DomHelper.get.id('offline.submit').addEvent('click', function() {

        that.game.socket.emit('lobby.game.start', {
          mode: 'offline',
          options: {
            events: {
              bonuses: DomHelper.get.id('offline.events.bonuses').value(),
              penalties: DomHelper.get.id('offline.events.penalties').value(),
              others: DomHelper.get.id('offline.events.others').value()
            },
            goals: {
              tinEnabled: DomHelper.get.id('offline.goals.tinEnabled').value(),
            },
            players: {
              amount: DomHelper.get.name('offline.players.amount').value(),
              skins: [
                DomHelper.get.id('offline.players.skins.0').value(),
                DomHelper.get.id('offline.players.skins.1').value()
              ]
            }
          }
        });

        element.remove();
      });
    });*/
  }
};

module.exports = MainMenuState;
