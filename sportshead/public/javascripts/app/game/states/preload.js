'use strict';

function PreloadState() {}

PreloadState.prototype = {
  preload: function() {},

  create: function() {
    this.game.state.start('main-intro');
  }
};

module.exports = PreloadState;
