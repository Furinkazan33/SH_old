var PENALTIES = [{
  "name": "LEG_BROKEN_MALUS",
  "message": "LEG BROKEN !",
  "target": "self",
  "attributes": {
    "speeds.shoot": 0
  }
}, {
  "name": "FREEZE_SELF",
  "message": "FREEZE !",
  "target": "self",
  "attributes": {
    "speeds.forward": 0,
    "speeds.backward": 0
  }
}, {
  "name": "LOW_JUMP",
  "message": "LOW JUMP !",
  "target": "self",
  "attributes": {
    "speeds.jump": -300
  }
}, {
  "name": "SPEED_DOWN",
  "message": "SPEED DOWN !",
  "target": "self",
  "attributes": {
    "speeds.forward": 200,
    "speeds.backward": 200
  }
}];

module.exports = PENALTIES;
