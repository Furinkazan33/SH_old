'use strict';

requirejs.config({
  paths: {
  	Phaser: '/bower_components/phaser/build/phaser.min',
    PhaserGui: 'lib/phaser.gui',
    SocketIO: '/socket.io/socket.io'
  },

  shim: {
  	'phaser': {
  		exports: 'Phaser',
  	},
    'GuiHelper': {
      deps: ['Polyfill']
    },
    'PhaserGui': {
      deps: ['Phaser']
    },
    'game': {
      deps: ['Phaser', 'PhaserGui']
    }
  }
});

require(['game'], function() {
  new cetelemheadsClient.Game();
});
