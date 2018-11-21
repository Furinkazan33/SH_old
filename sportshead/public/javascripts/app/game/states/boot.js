'use strict';

function BootState() {};

BootState.prototype = {
  preload: function() {},

  create: function() {
    // setup game environment
    // scale, input etc..

    //this.game.plugin = this.game.plugins.add(new Phaser.Plugin.Window(this));
    this.game.state.start('preload');
  }
};

module.exports = BootState;
