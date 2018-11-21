'use strict';

define([], function() {

  function PreloadState() {}

  PreloadState.prototype = {
    preload: function() {},

    create: function() {
      this.game.state.start('main-intro');
    }
  };

  return PreloadState;
});
