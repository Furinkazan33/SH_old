'use strict';

define([], function() {

  function BootState() {};

  BootState.prototype = {
    preload: function() {},

    create: function() {
      // setup game environment
      // scale, input etc..

      this.game.state.start('preload');
    }
  };

  return BootState;
});
