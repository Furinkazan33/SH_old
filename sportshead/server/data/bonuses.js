var BONUSES = [{
  "name": "FREEZE_OTHER",
  "message": "FREEZE !",
  "target": "other",
  "attributes": {
    "speeds.forward": 0,
    "speeds.backward": 0
  }
}, {
  "name": "HIGH_JUMP",
  "message": "HiGH JUMP !",
  "target": "self",
  "attributes": {
    "speeds.jump": -500
  }
}, {
  "name": "LEG_BROKEN_BONUS",
  "message": "LEG BROKEN !",
  "target": "other",
  "attributes": {
    "speeds.shoot": 0
  }
}, {
  "name": "SPEED_UP",
  "message": "SPEED UP !",
  "target": "self",
  "attributes": {
    "speeds.forward": 400,
    "speeds.backward": 400
  }
}/*{
  "name": "BIG_GOAL",
  "message": "BIG GOAL !"
}, {
  "name": "BIG_HEAD",
  "message": "BIG HEAD !"
}, {
  "name": "LITTLE_GOAL",
  "message": "LITTLE GOAL !",
  "target": "goal"
}, {
  "name": "LITTLE_HEAD",
  "message": "LITTLE HEAD !",
  "target": "self"
}*/];

module.exports = BONUSES;
