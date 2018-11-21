///<reference path="../dependencies/phaser.d.ts"/>
///<reference path="../dependencies/socketio.d.ts"/>

module cetelemheadsClient {
  export class Game extends Phaser.Game {

    socket: Socket;
    gui: phasergui.PhaserGui;
    data = {
      clientUid: null,
      groupUid: null,
    };

    constructor() {
      super(1200, 750, Phaser.AUTO);

      this.socket = io.connect();
      this.socket.on('client.attributes.set', (data) => {
        for (var index in data.attributes) {
          var name = data.attributes[index].name;
          var value = data.attributes[index].value;
          this.data[index] = value;
        }
      });

      this.gui = new phasergui.PhaserGui(this);

      this.state.add('boot', cetelemheadsClient.states.BootState);
      this.state.add('preload', cetelemheadsClient.states.PreloadState);
      this.state.add('main-intro', cetelemheadsClient.states.MainIntroState);
      this.state.add('main-menu', cetelemheadsClient.states.MainMenuState);
      this.state.add('lobby', cetelemheadsClient.states.LobbyState);
      this.state.add('game', cetelemheadsClient.states.GameState);

      this.state.start('boot');
    }
  }
}
