'use strict';

require.config({
  paths: {
    'phaser': '/bower_components/phaser/build/phaser.min',
    'requirejs': '/bower_components/requirejs/require',
    'socket.io': '/socket.io/socket.io'
  },
  shim: {
    phaser: {
      exports: 'Phaser'
    }
  }
});

require(['phaser', 'app'], function (Phaser, App) {
  var app = new App();
  app.start();
});
