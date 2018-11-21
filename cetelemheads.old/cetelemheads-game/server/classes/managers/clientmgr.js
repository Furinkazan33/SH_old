var ClientMgr = function(client) {
  this.handleClient(client);
};

ClientMgr.prototype = {
  handleClient: function(client) {
    client.handlePacket('disconnect', this.onDisconnect, this);
  },

  onDisconnect: function() {
    // TODO
  }
};

module.exports = ClientMgr;
