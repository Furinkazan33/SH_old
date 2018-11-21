var Game = require('../game');

var MainMenuMgr = function(mainMenu) {
  this._mainMenu = mainMenu;
};

MainMenuMgr.prototype = {
  handleClient: function(client) {
    client.handlePacket('mainmenu.offlinegame.start', this.onMainMenuOfflineGameStart, this);
    client.handlePacket('mainmenu.offlinegame.quit', this.onMainMenuOfflineGameQuit, this);
    client.handlePacket('mainmenu.online.login', this.onMainMenuOnlineLogin, this);

    client.sendPacket('client.attributes.set', {
      attributes: [{
        name: 'clientUid',
        value: client.uid
      }]
    });
  },

  onMainMenuOfflineGameStart: function(client, data) {
    this._mainMenu.addOfflineGame(new Game([client], data));
  },
  onMainMenuOfflineGameQuit: function(client, data) {
    var game = this._mainMenu.findOfflineGameByUID(data.gameUid);
    if (game == null) {
      return;
    }

    game.destroyAll();
    this._mainMenu.removeOfflineGame(game);
  },
  onMainMenuOnlineLogin: function(client, data) {
    var login = data.login;
    var password = data.password;
    var existingClient = this._mainMenu._lobby.findClientByName(login);
    if (existingClient != null) {
      client.sendPacket('mainmenu.online.login.error', {
        message: 'Nom de compte déjà utilisé'
      });
      return;
    }

    // TODO handle account

    client.name = login;
    this._mainMenu._lobby.addClient(client);
  }
};

module.exports = MainMenuMgr;
