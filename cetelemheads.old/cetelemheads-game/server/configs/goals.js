var Utils = require('../../lib/utils');

module.exports = [{
  uid: Utils.random.uniqueId(),
  team: 'left',
  position: {
    x: 0,
    y: 500
  }
}, {
  uid: Utils.random.uniqueId(),
  team: 'right',
  position: {
    x: 1136,
    y: 500
  }
}];
