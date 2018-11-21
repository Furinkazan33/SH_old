var Client = function(socket) {
  this.socket = socket;
};

Client.prototype = {
  sendPacket: function(event, packet) {
    this.socket.emit(event, packet);
  },
  handlePacket: function(event, callback, context) {
    var that = this;
    this.socket.on(event, function(data) {
      callback.call(context, that, data);
    })
  }
};

module.exports = Client;
