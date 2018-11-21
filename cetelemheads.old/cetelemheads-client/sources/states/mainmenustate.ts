///<reference path="abstractstate.ts"/>

module cetelemheadsClient.states {
  export class MainMenuState extends AbstractState {
    preload() {
      var resources = [
        '/templates/main-menu/main.json',
        '/templates/main-menu/offline.json',
        '/templates/main-menu/online.json'
      ];
      for (var index = 0; index < resources.length; index++) {
        this.game.load.json(resources[index], resources[index]);
      }

      //this.game.load.onLoadComplete.add(EZGUI.Compatibility.fixCache, this.game.load, null, images);
    }

    create() {
      this.game.socket.on('state.game.start', (data) => {
        //GuiHelper.removeAll();
        this.game.state.start('game', true, false, data);
      });
      this.game.socket.on('state.lobby.start', (data) => {
        //GuiHelper.removeAll();
        this.game.state.start('lobby', true, false, data);
      });

      var offlineButton = (<cetelemheadsClient.Game>this.game).gui.add.button("Hors-ligne", 50, 50);
      offlineButton.onClick.add(() => {
        var data = {
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
        };
        this.game.socket.emit('mainmenu.offlinegame.start', data);
      });

      var onlineButton = this.game.gui.add.button("En-ligne", 50, 100);
    }
  }
}
