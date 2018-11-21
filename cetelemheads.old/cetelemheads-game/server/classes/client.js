var Utils = require('../../lib/utils');
var ClientMgr = require('./managers/clientmgr');

var Client = function(socket) {
  this.socket = socket;
  this.name = '';
  this.uid = Utils.random.uniqueId();
  this.group = null;

  this._clientMgr = new ClientMgr(this);
};

Client.prototype = {
  sendPacket: function(event, packet) {
    //console.log('>'+event);
    this.socket.emit(event, packet);
  },
  handlePacket: function(event, callback, context) {
    if (callback == null) {
      console.log('ERROR: Missing callback for event '+event);
    }

    var that = this;
    this.socket.on(event, function(data) {
      //console.log('<'+event);
      callback.call(context, that, data);
    });
  },

  getGroup: function() {
    return this._group;
  },
  setGroup: function(group) {
    this._group = group;
  }
};

module.exports = Client;
