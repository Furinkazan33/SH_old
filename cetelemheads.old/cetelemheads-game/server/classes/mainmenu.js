var Utils = require('../../lib/utils');

var Lobby = require('./lobby');
var MainMenuMgr = require('./managers/mainmenumgr');

var MainMenu = function() {
  this._offlineGames = [];
  this._lobby = new Lobby();

  this._mainMenuMgr = new MainMenuMgr(this);
};

MainMenu.prototype = {
  _findPropertyBy: function(properties, field, value) {
    for (var index in properties) {
      var property = properties[index];

      if (Utils.object.getPropertyValue(property, field) == value) {
        return property;
      }
    }
    return null;
  },

  addClient: function(client) {
    this._mainMenuMgr.handleClient(client);
  },
  addOfflineGame: function(game) {
    this._offlineGames.push(game);
  },
  removeOfflineGame: function(game) {
    var index = this._offlineGames.indexOf(game);
    if (index > -1) {
      this._offlineGames.slice(index, 1);
    }
  },
  findOfflineGameByUID: function(uid) {
    return this._findPropertyBy(this._offlineGames, '_configs.uid', uid);
  }
};

module.exports = MainMenu;
