var Utils = require('../../lib/utils');

module.exports = {
  uid: Utils.random.uniqueId(),
  gravity: {
    x: 0,
    y: 600,
  },
  debug: {
    pitch: false,
    stage: false,
    player: false,
    mouse: false,
    foot: false,
    ball: false,
    goal: false,
    event: false,
  },

  events: {
    bonuses: true,
    penalties: true,
    others: true,
    resetAfterGoal: true,
    position: {
      x: {
        min: 150,
        max: 1050
      },
      y: {
        min: 400,
        max: 600
      }
    },
    timeout: {
      create: {
        min: 5,
        max: 20
      },
      destroy: {
        min: 10,
        max: 30
      }
    },
    duration: {
      min: 5,
      max: 15
    }
  },

  players: {
    inputs: {
      '4': [{
        jump: 'Z',
        forward: 'D',
        backward: 'Q',
        shoot: 'SPACEBAR'
      }, {
        jump: 'T',
        forward: 'F',
        backward: 'H',
        shoot: 'M'
      }, {
        jump: 'UP',
        forward: 'RIGHT',
        backward: 'LEFT',
        shoot: 'P'
      }, {
        jump: 'NUMPAD_8',
        forward: 'NUMPAD_4',
        backward: 'NUMPAD_6',
        shoot: 'PAGE_UP'
      }],

      '2': [{
        jump: 'Z',
        forward: 'D',
        backward: 'Q',
        shoot: 'SPACEBAR'
      }, {
        jump: 'UP',
        forward: 'LEFT',
        backward: 'RIGHT',
        shoot: 'P'
      }]
    },
    speeds: {
      jump: -400,
      forward: 300,
      backward: 250,
      shoot: 10
    },
    positions: [{
      x: 155,
      y: 645
    }, {
      x: 1045,
      y: 645
    }, {
      x: 235,
      y: 645
    }, {
      x: 970,
      y: 645
    }]
  },

  goals: {
    tinEnabled: true
  },

  scores: {
    max: 7,
    pointsByScore: 1
  }
};
