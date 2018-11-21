var Client = require('./classes/client');
var MainMenu = require('./classes/mainmenu');

module.exports = function(app) {
  var mainMenu = new MainMenu();

  app.io.on('connection', function(socket) {
    // TODO we should not access lobbyMgr
    mainMenu.addClient(new Client(socket));
  });
};
