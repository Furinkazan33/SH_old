'use strict';

define([], function() {

  function MainMenuState() {};

  MainMenuState.prototype = {
    preload: function() {
      this.game.load.spritesheet('button', 'images/assets/main-menu/button.png', 237, 63);
    },

    create: function() {
      var options = { "balls": 1 };

      this.game.stage.backgroundColor = '#182d3b';
      this.game.add.button(this.game.world.centerX - 95, 200, 'button', function() {
        this.game.state.start('game', true, false, options);
      }, this, 2, 1, 0);
      this.game.add.text(this.game.world.centerX - 70, 210, 'Singleplayer', { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });

      this.game.add.button(this.game.world.centerX - 95, 300, 'button', function() {
        var playerName = prompt("Entrez votre nom", "");
        if (playerName != null) {
          // TODO check double name
          this.game.socket.emit('player.set.name', {
            playerName: playerName
          });

          this.game.state.start('lobby', true, false, {
            playerName: playerName
          });
        }
      }, this, 2, 1, 0);
      this.game.add.text(this.game.world.centerX - 70, 310, 'Multiplayer', { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });
    }
  };

  return MainMenuState;
});
