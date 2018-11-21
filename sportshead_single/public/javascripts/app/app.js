'use strict';

define([
  'phaser',
  'socket.io',
  'states/boot',
  'states/preload',
  'states/main-intro',
  'states/main-menu',
  'states/lobby',
  'states/game'
], function(Phaser, SocketIO, BootState, PreloadState, MainIntroState, MainMenuState, LobbyState, GameState) {

  function App() {}

  App.prototype = {
    start: function() {
      var game = new Phaser.Game(1200, 750, Phaser.AUTO, 'game-area');
      game.socket = SocketIO();

      game.state.add('boot', BootState);
      game.state.add('preload', PreloadState);
      game.state.add('main-intro', MainIntroState);
      game.state.add('main-menu', MainMenuState);
      game.state.add('lobby', LobbyState);
      game.state.add('game', GameState);

      game.state.start('boot');
    }
  };

  return App;
});
