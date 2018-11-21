var Utils = require('../../lib/utils');

module.exports = [{
  uid: Utils.random.uniqueId(),
  radius: 18,
  position: {
    x: 600,
    y: 350
  },
  velocity: {
    x: 0,
    y: 0
  },
  scale: {
    x: 1.5,
    y: 1.5
  }
}];
