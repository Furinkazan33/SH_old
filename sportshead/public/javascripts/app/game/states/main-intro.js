'use strict';

function MainIntroState() {};

MainIntroState.prototype = {
  preload: function() {},

  create: function() {
    this.game.state.start('main-menu');
  }
};

module.exports = MainIntroState;
