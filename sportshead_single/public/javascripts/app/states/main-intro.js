'use strict';

define([], function() {

  function MainIntroState() {};

  MainIntroState.prototype = {
    preload: function() {},

    create: function() {
      this.game.state.start('main-menu');
    }
  };

  return MainIntroState;
});
