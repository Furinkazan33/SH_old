var Utils = require('../../lib/utils');

module.exports = [{
  uid: Utils.random.uniqueId(),
  name: 'left',
  text: 0,
  style: {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  },
  position: {
    x: -550,
    y: -100
  }
}, {
  uid: Utils.random.uniqueId(),
  name: 'right',
  text: 0,
  style: {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  },
  position: {
    x: 550,
    y: -100
  }
}, {
  uid: Utils.random.uniqueId(),
  name: 'message',
  text: '',
  style: {
    font: "bold 32px Arial",
    fill: "#fff",
    boundsAlignH: "center",
    boundsAlignV: "middle"
  },
  position: {
    x: 0,
    y: 0
  }
}];
