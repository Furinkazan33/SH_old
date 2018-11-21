var Player = require('./classes/player');
var Lobby = require('./classes/lobby');

module.exports = function(app) {
  var lobby = new Lobby();

  app.io.on('connection', function(socket) {
    console.log('new client');

    var player = new Player(socket);
    lobby.handlePlayer(player);
  });
};
