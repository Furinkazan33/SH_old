var cetelemHeadsGameDirectives = angular.module('cetelemHeadsGameDirectives');

cetelemHeadsGameDirectives.directive('phaserCanvas', function(SocketIO) {
  return {
    scope: {},
    template: '<div id="game-canvas"></div>',
    link: function(scope, ele, attrs) {
      var game = new Phaser.Game(1200, 750, Phaser.AUTO, 'game-canvas', {
        preload: function() {
          game.stage.disableVisibilityChange = true;
        }
      });
      game.socket = SocketIO;

      game.state.add('boot', require('../states/boot'));
      game.state.add('preload', require('../states/preload'));
      game.state.add('main-intro', require('../states/main-intro'));
      game.state.add('main-menu', require('../states/main-menu'));
      game.state.add('lobby', require('../states/lobby'));
      game.state.add('game', require('../states/game'));

      game.state.start('boot');
    }
  };
})
