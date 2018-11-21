'use strict';

define([], function() {

  function LobbyState() {};

  LobbyState.prototype = {

    preload: function() {
      this.game.load.spritesheet('button', 'images/assets/main-menu/button.png', 237, 63);
    },

    create: function() {
      var that = this;

      this.game.socket.on('player.lobby.join', function(data) {
        // TODO
      });
      this.game.socket.on('player.lobby.quit', function(data) {
        // TODO
      });
      this.game.socket.on('player.lobby.chat', function(data) {
        // TODO
      });

      this.game.socket.on('player.lobby.challenge.request', function(data) {
        var confirm = window.confirm(data.initiator + ' veux vous affrontez. OK ?');
        if (confirm) {
          that.game.socket.emit('player.lobby.challenge.accept', data);
        } else {
          that.game.socket.emit('player.lobby.challenge.refuse', data);
        }
      });
      this.game.socket.on('player.lobby.challenge.error', function(data) {
        alert(data.message);
      });
      this.game.socket.on('player.lobby.challenge.refuse', function(data) {
        alert(data.message);
      });
      this.game.socket.on('player.game.start', function(data) {
        that.game.state.start('game', true, false, data);
      });

      this.game.add.button(this.game.world.centerX - 95, 300, 'button', function() {
        var playerName = prompt("Entrez le nom de votre adversaire", "");
        if (playerName != null) {
          this.game.socket.emit('player.lobby.challenge', {
            playerName: playerName
          });
        }
      }, this, 2, 1, 0);
      this.game.add.text(this.game.world.centerX - 50, 310, 'Jouer', { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });
    },

    updatePlayerList: function() {

    }
  };

  return LobbyState;
});
