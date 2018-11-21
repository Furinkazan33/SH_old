'use strict';

function LobbyState() {};

LobbyState.prototype = {

  preload: function() {
    this.game.load.spritesheet('button', 'images/assets/main-menu/button.png', 237, 63);
  },

  create: function() {



    /*this.game.socket.on('lobby.join', function(data) {
      // TODO
    });
    this.game.socket.on('lobby.quit', function(data) {
      // TODO
    });
    this.game.socket.on('lobby.chat', function(data) {
      // TODO
    });

    this.game.socket.on('lobby.challenge.request', function(data) {
      var confirm = window.confirm(data.initiator + ' veux vous affrontez. OK ?');
      if (confirm) {
        that.game.socket.emit('lobby.challenge.accept', data);
      } else {
        that.game.socket.emit('lobby.challenge.refuse', data);
      }
    });
    this.game.socket.on('lobby.challenge.error', function(data) {
      alert(data.message);
    });
    this.game.socket.on('lobby.challenge.refuse', function(data) {
      alert(data.message);
    });
    this.game.socket.on('player.game.start', function(data) {
      that.game.state.start('game', true, false, data);
    });

    this.game.add.button(this.game.world.centerX - 95, 300, 'button', function() {
      var playerName = prompt("Entrez le nom de votre adversaire", "");
      if (playerName != null) {
        this.game.socket.emit('lobby.challenge', {
          playerName: playerName
        });
      }
    }, this, 2, 1, 0);
    this.game.add.text(this.game.world.centerX - 50, 310, 'Jouer', { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" });*/
  },

  updatePlayerList: function() {

  }
};

module.exports = LobbyState;
