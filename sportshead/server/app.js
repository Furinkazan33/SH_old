var Client = require('./classes/client');
var Lobby = require('./classes/lobby');

module.exports = function(app) {
  var lobby = new Lobby();

  app.io.on('connection', function(socket) {
    // TODO we should not access lobbyMgr
    lobby._lobbyMgr.handleClient(new Client(socket));
  });
};
