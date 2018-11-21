var OTHERS = [{
  "name": "LITTLE_BALL",
  "message": "LITTLE BALL !",
  "target": "ball",
  "attributes": {
    "radius": 9,
    "scale.x": 0.75,
    "scale.y": 0.75
  }
}, {
  "name": "BIG_BALL",
  "message": "BIG BALL !",
  "target": "ball",
  "attributes": {
    "radius": 36,
    "scale.x": 3.0,
    "scale.y": 3.0
  }
}/*, {
  "name": "SUPPORTER",
  "message": "SUPPORTER !",
  "target": "custom"
}, {
  "name": "BOMB",
  "message": "BOMB !"
}, {
  "name": "BOUNCY",
  "message": "BOUNCY !",
  "trigger": function(player) {
    ContactMaterial.ball.world.restitution *= CONFIG.BONUS.COEF_BONUS;
    ContactMaterial.ball.stage.restitution *= CONFIG.BONUS.COEF_BONUS;
    ContactMaterial.player.ball.restitution *= CONFIG.BONUS.COEF_BONUS;
    ContactMaterial.ball.ball.restitution *= CONFIG.BONUS.COEF_BONUS;
    ContactMaterial.feet.ball.restitution *= CONFIG.BONUS.COEF_BONUS;
  },
  "restore": function(player) {
    ContactMaterial.ball.world.restitution = CONFIG.CM.RESTITUTION.BW;
    ContactMaterial.player.ball.restitution = CONFIG.CM.RESTITUTION.PB;
    ContactMaterial.feet.ball.restitution = CONFIG.CM.RESTITUTION.FB;
    ContactMaterial.ball.stage.restitution = CONFIG.CM.RESTITUTION.BS;
    ContactMaterial.ball.ball.restitution = CONFIG.CM.RESTITUTION.BB;
  }
}, {
  "name": "DEAD_BALL",
  "message": "DEAD BALL !",
  "trigger": function(player) {
    ContactMaterial.ball.world.restitution *= CONFIG.BONUS.COEF_MALUS;
    ContactMaterial.ball.stage.restitution *= CONFIG.BONUS.COEF_MALUS;
    ContactMaterial.player.ball.restitution *= CONFIG.BONUS.COEF_MALUS;
    ContactMaterial.ball.ball.restitution *= CONFIG.BONUS.COEF_MALUS;
    ContactMaterial.feet.ball.restitution *= CONFIG.BONUS.COEF_MALUS;
  },
  "restore": function(player) {
    ContactMaterial.ball.world.restitution = CONFIG.CM.RESTITUTION.BW;
    ContactMaterial.player.ball.restitution = CONFIG.CM.RESTITUTION.PB;
    ContactMaterial.feet.ball.restitution = CONFIG.CM.RESTITUTION.FB;
    ContactMaterial.ball.stage.restitution = CONFIG.CM.RESTITUTION.BS;
    ContactMaterial.ball.ball.restitution = CONFIG.CM.RESTITUTION.BB;
  }
}*/];

module.exports = OTHERS;
