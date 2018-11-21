var Utils = {
  socket: {
    sendToAll: function(players, event, packet) {
      Utils.socket.sendToAllExcept(null, event, packet);
    },

    sendToAllExcept: function(players, player, event, packet) {
      for (var index in players) {
        if (players[index] == player) {
          continue;
        }

        players[index].sendPacket(event, packet);
      }
    }
  }
}

module.exports = Utils;
