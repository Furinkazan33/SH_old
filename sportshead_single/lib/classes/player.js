var Player = function(socket) {
  this.socket = socket;
}

Player.prototype.sendPacket = function(event, packet) {
  this.socket.emit(event, packet);
}

module.exports = Player;
