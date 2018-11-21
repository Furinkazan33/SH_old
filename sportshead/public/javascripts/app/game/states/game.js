'use strict';

const resolution = { "x": 1200, "y": 750 };

const CONFIG = {
  "CM":     { "RESTITUTION": { "PW": 0,   "PS": 0,   "PP": 0,   "PB": 0.8, "FS": 0.2, "FB": 1.2, "BW": 0.7, "BS": 0.7, "BB": 1.2 },
              "FRICTION":    { "PW": 0.2, "PS": 0.2, "PP": 0.2, "PB": 0.5, "FS": 0.5, "FB": 25,  "BW": 10,  "BS": 10,  "BB": 0.2 } }
};

//var goalSignal = new Phaser.Signal();

/*
onBeginContact => voir l'utilité

inclusions : sprite << body << shapes

propriétés ajoutées aux sprites :
ball.lastPlayerHit => reference du dernier player ayant frappé la balle (initialisé à groups.players.children[0])
player.rightSide => joueur à droite
player.positionX
player.positionY
player.foot => sprite du pied
player.foot.constraint => rotation du pied par rapport au player

Pour déplacer le joueur distant :
  //player.body.reset(i, 500, false, false);
  player.body.static = true;
  player.body.x = i;
  player.body.y = 500;

*/



function GameState() {};

GameState.prototype = {

  groups: {
    pitchs: null,
    stages: null,
    balls: null,
    players: null,
    feet: null,
    events: null,
    goals: null,
    areas: null,
    displays: null
  },
  collisionGroups: {
    players: null,
    feets: null,
    stages: null,
    balls: null,
    areas: null
  },
  materials: {
    worlds: null,
    stages: null,
    players: null,
    feets: null,
    balls: null
  },

  init: function (options) {
    this.options = options;
  },

  preload: function() {
    this.game.load.spritesheet('player_italia', 'images/assets/game/players/player.png', 59, 66);
    this.game.load.spritesheet('player_mathieu', 'images/assets/game/players/Mathieu.png', 59, 66);

    this.game.load.image('background', 'images/assets/game/stage1200x750.jpg');
    this.game.load.image('ground', 'images/assets/game/ground.png');

    this.game.load.image('BIG_BALL', 'images/assets/game/events/BIG_BALL.png');
    this.game.load.image('BIG_GOAL', 'images/assets/game/events/BIG_GOAL.png');
    this.game.load.image('BIG_HEAD', 'images/assets/game/events/BIG_HEAD.png');
    this.game.load.image('BOMB', 'images/assets/game/events/BOMB.png');
    this.game.load.image('BOUNCY', 'images/assets/game/events/BOUNCY.png');
    this.game.load.image('DEAD_BALL', 'images/assets/game/events/DEAD_BALL.png');
    this.game.load.image('FREEZE_OTHER', 'images/assets/game/events/FREEZE_OTHER.png');
    this.game.load.image('FREEZE_SELF', 'images/assets/game/events/FREEZE_SELF.png');
    this.game.load.image('HIGH_JUMP', 'images/assets/game/events/HIGH_JUMP.png');
    this.game.load.image('LEG_BROKEN_BONUS', 'images/assets/game/events/LEG_BROKEN_BONUS.png');
    this.game.load.image('LEG_BROKEN_MALUS', 'images/assets/game/events/LEG_BROKEN_MALUS.png');
    this.game.load.image('LITTLE_BALL', 'images/assets/game/events/LITTLE_BALL.png');
    this.game.load.image('LITTLE_GOAL', 'images/assets/game/events/LITTLE_GOAL.png');
    this.game.load.image('LITTLE_HEAD', 'images/assets/game/events/LITTLE_HEAD.png');
    this.game.load.image('LOW_JUMP', 'images/assets/game/events/LOW_JUMP.png');
    this.game.load.image('SPEED_DOWN', 'images/assets/game/events/SPEED_DOWN.png');
    this.game.load.image('SPEED_UP', 'images/assets/game/events/SPEED_UP.png');
    this.game.load.image('SUPPORTER', 'images/assets/game/events/SUPPORTER.png');

    this.game.load.image('ball', 'images/assets/game/ballon.png');
    this.game.load.image('foot', 'images/assets/game/foot.png');
    this.game.load.image('goal', 'images/assets/game/goal.png');

    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
    this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
  },

  create: function() {
    var that = this;

    this._handleNetwork(this.game.socket);

    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.physics.p2.setImpactEvents(true);
    this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
    this.game.physics.p2.restitution = 0.8;
    this.game.physics.p2.gravity.x = this.options.configs.gravity.x;
    this.game.physics.p2.gravity.y = this.options.configs.gravity.y;

    this.materials.worlds = this.game.physics.p2.createMaterial('this.materials.worlds');
    this.materials.stages = this.game.physics.p2.createMaterial('this.materials.stages');
    this.materials.players = this.game.physics.p2.createMaterial('this.materials.players');
    this.materials.feets = this.game.physics.p2.createMaterial('this.materials.feets');
    this.materials.balls = this.game.physics.p2.createMaterial('this.materials.balls');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    this.game.physics.p2.setWorldMaterial(this.materials.worlds, true, true, true, true);

    this.game.add.sprite(0, 0, 'background');

    this.groups.stages = this.game.add.group(this.game.world, 'stages', false, true, Phaser.Physics.P2JS);
    this.groups.pitchs = this.game.add.group(this.game.world, 'pitchs', false, false, Phaser.Physics.P2JS);
    this.groups.balls = this.game.add.group(this.game.world, 'balls', false, true, Phaser.Physics.P2JS);
    this.groups.players = this.game.add.group(this.game.world, 'players', false, true, Phaser.Physics.P2JS);
    this.groups.feets = this.game.add.group(this.game.world, 'feets', false, true, Phaser.Physics.P2JS);
    this.groups.events = this.game.add.group(this.game.world, 'events', false, true, Phaser.Physics.P2JS);
    this.groups.goals = this.game.add.group(this.game.world, 'goals', false, false, Phaser.Physics.P2JS);
    this.groups.areas = this.game.add.group(this.game.world, 'areas', true, true, Phaser.Physics.P2JS);
    this.groups.displays = this.game.add.group(this.game.world, 'displays', false, false, Phaser.Physics.P2JS);

    /* Permet d'assigner à un sprite afin de savoir avec quoi il collisionne */
    this.collisionGroups.stages = this.game.physics.p2.createCollisionGroup();
    this.collisionGroups.players = this.game.physics.p2.createCollisionGroup();
    this.collisionGroups.feets = this.game.physics.p2.createCollisionGroup();
    this.collisionGroups.balls = this.game.physics.p2.createCollisionGroup();
    this.collisionGroups.areas = this.game.physics.p2.createCollisionGroup();

    this.game.physics.p2.updateBoundsCollisionGroup();

    var stage = this.createStage();
    var pitch = this.createPitch(this.options.pitches.pitch3);

    for (var index = 0; index < this.options.balls.length; index++) {
      this.createBall(this.options.balls[index]);
    }

    for (var index = 0; index < this.options.players.length; index++) {
      this.createPlayer(this.options.players[index]);
    }

    for (var index = 0; index < this.options.goals.length; index++) {
      this.createGoal(this.options.goals[index]);
    }

    /*
    display.score.left = this.createDisplay({position: , message: "0", style: display.style});
    display.score.right = this.createDisplay({position: , message: "0", style: display.style});
    display.message = this.createDisplay({position: , message: "", style: display.style});
    */
    for (var index = 0; index < this.options.displays.length; index++) {
      this.createDisplay(this.options.displays[index]);
    }

    for (var index in this.groups.stages.children) {
      var stage = this.groups.stages.children[index];

      stage.body.immovable = true;
      stage.body.moves = false;
      stage.body.setMaterial(this.materials.stages);
      stage.body.setCollisionGroup(this.collisionGroups.stages);
      stage.body.collides([this.collisionGroups.players, this.collisionGroups.balls]);
      stage.body.static = true;
    }

    for (var index in this.groups.areas.children) {
      var area = this.groups.areas.children[index];

      area.body.immovable = true;
      area.body.moves = false;
      area.body.static = true;
    }



    this.game.physics.p2.createContactMaterial(this.materials.players, this.materials.worlds, { friction: CONFIG.CM.FRICTION.PW, restitution: CONFIG.CM.RESTITUTION.PW });
    this.game.physics.p2.createContactMaterial(this.materials.players, this.materials.stages, { friction: CONFIG.CM.FRICTION.PS, restitution: CONFIG.CM.RESTITUTION.PS });
    this.game.physics.p2.createContactMaterial(this.materials.players, this.materials.players, { friction: CONFIG.CM.FRICTION.PP, restitution: CONFIG.CM.RESTITUTION.PP });
    this.game.physics.p2.createContactMaterial(this.materials.players, this.materials.balls, { friction: CONFIG.CM.FRICTION.PB, restitution: CONFIG.CM.RESTITUTION.PB });

    this.game.physics.p2.createContactMaterial(this.materials.feets, this.materials.stages, { friction: CONFIG.CM.FRICTION.FS, restitution: CONFIG.CM.RESTITUTION.FS });
    this.game.physics.p2.createContactMaterial(this.materials.feets, this.materials.balls, { friction: CONFIG.CM.FRICTION.FB, restitution: CONFIG.CM.RESTITUTION.FB });

    this.game.physics.p2.createContactMaterial(this.materials.balls, this.materials.worlds, { friction: CONFIG.CM.FRICTION.BW, restitution: CONFIG.CM.RESTITUTION.BW });
    this.game.physics.p2.createContactMaterial(this.materials.balls, this.materials.stages, { friction: CONFIG.CM.FRICTION.BS, restitution: CONFIG.CM.RESTITUTION.BS });
    this.game.physics.p2.createContactMaterial(this.materials.balls, this.materials.balls, { friction: CONFIG.CM.FRICTION.BB, restitution: CONFIG.CM.RESTITUTION.BB });

    // contactMaterial.stiffness = 1e3;
    // contactMaterial.relaxation = 0;
    // contactMaterial.frictionStiffness = 1e7;
    // contactMaterial.frictionRelaxation = 3;
    // contactMaterial.surfaceVelocity = 0.0;
    // Voir http://phaser.io/examples/v2/p2-physics/platformer-material

    var bar = this.game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(0, 0, 100, 100);

    bar = this.game.add.graphics();
    bar.beginFill(0x000000, 0.2);
    bar.drawRect(1100, 0, 100, 100);

    var timer = this.game.time.create(this.game);
    timer.start();

    this._resetAndFreezeGame();
  },

  update: function() {
    var that = this;

    if (that.options.configs.debug.mouse) {
      var pos = this.game.input.activePointer.position;
      this.game.debug.text("x:" + pos.x + " y:" + pos.y, 180, 200);
    }

    for (var index in this.groups.players.children) {
      var player = this.groups.players.children[index];

      this._handleInputsForPlayer(player);
    }

    this.groups.balls.forEach(function(ball) {
      ball.scale.setTo(ball.$attributes.scale.x, ball.$attributes.scale.y);
    }, this);
  },

  _getPlayerByUID: function(uid) {
    for (var index in this.groups.players.children) {
      var player = this.groups.players.children[index];
      if (player.$attributes.uid == uid) {
        return player;
      }
    }
    return null;
  },
  _getEventByUID: function(uid) {
    for (var index in this.groups.events.children) {
      var event = this.groups.events.children[index];
      if (event.$attributes.uid == uid) {
        return event;
      }
    }
    return null;
  },
  _getDisplayByName: function(name) {
    for (var index in this.groups.displays.children) {
      var display = this.groups.displays.children[index];
      if (display.$attributes.name == name) {
        return display;
      }
    }
    return null;
  },
  _handleNetwork: function(socket) {
    var that = this;

    socket.on('game.countdown.start', function(data) {
      that._countDown(data.count, that._releaseGame);
    });
    socket.on('game.reset', function(data) {
      that._resetAndFreezeGame();
    });
    socket.on('game.display.update', function(data) {
      var display = that._getDisplayByName(data.name);
      if (display != null) {
        display.text = data.text;
      }
    });
    socket.on('game.finish', function(data) {
      that._displayMessage('Team '+data.winner+' wins !', 3, function() {
        socket.emit('lobby.game.quit', {
          gameUid: that.options.configs.uid
        });

        socket.removeAllListeners();
        that.game.state.start('main-menu');
      });
    });

    socket.on('game.player.attributes.set', function(data) {
      var player = that._getPlayerByUID(data.targetUid);
      if (player == null) {
        console.log("Error: target not found");
        return;
      }

      for (var attribute in data.attributes) {
        Utils.object.setAttribute(player.$attributes, attribute, data.attributes[attribute]);
      }
    });
    socket.on('game.player.attributes.reset', function(data) {
      var player = that._getPlayerByUID(data.targetUid);
      if (player == null) {
        console.log("Error: target not found");
        return;
      }

      for (var attribute in data.attributes) {
        Utils.object.setAttribute(player.$attributes, data.attributes[attribute], Utils.object.getAttribute(player.$defaultAttributes, data.attributes[attribute]));
      }
    });

    socket.on('game.ball.attributes.set', function(data) {
      for (var index in that.groups.balls.children) {
        var ball = that.groups.balls.children[index];
        for (var attribute in data.attributes) {
          Utils.object.setAttribute(ball.$attributes, attribute, data.attributes[attribute]);
        }
      }
    });
    socket.on('game.ball.attributes.reset', function(data) {
      for (var index in that.groups.balls.children) {
        var ball = that.groups.balls.children[index];
        for (var attribute in data.attributes) {
          Utils.object.setAttribute(ball.$attributes, data.attributes[attribute], Utils.object.getAttribute(ball.$defaultAttributes, data.attributes[attribute]));
        }
      }
    });

    socket.on('game.event.create', function(data) {
      that.createBonus(data);
    });
    socket.on('game.event.destroy', function(data) {
      var event = that._getEventByUID(data.eventUid);
      if (event == null) {
        console.log('Error: tryed to destroy non-existant event');
        return;
      }

      event.destroy();
    });

    socket.emit('game.player.ready');
  },
  _handleInputsForPlayer: function(player) {
    player.body.velocity.x = 0;

    if (!player.$attributes.inputsEnabled) {
      return;
    }

    var inputs = player.$attributes.inputs;

    if (this.game.input.keyboard.isDown(Phaser.Keyboard[inputs.forward])) {
      player.body.velocity.x = player.$attributes.speeds.forward * (player.$attributes.team == 'right' ? -1:1);
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard[inputs.backward])) {
      player.body.velocity.x = player.$attributes.speeds.backward * (player.$attributes.team == 'right' ? 1:-1);
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard[inputs.jump]) && player.position.y > 660) {
      player.body.velocity.y = player.$attributes.speeds.jump;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard[inputs.shoot])) {
      player.foot.constraint.setMotorSpeed(player.$attributes.speeds.shoot*(player.$attributes.team == 'right' ? -1:1));
    }
    else {
      player.foot.constraint.setMotorSpeed(((player.$attributes.speeds.shoot*(player.$attributes.team == 'right' ? -1:1))/2)*-1);
    }
  },

  _displayMessage: function(message, duration, callback) {
    var display = this._getDisplayByName('message');
    if (display != null) {
      display.text = message;
      if (duration != null) {
        return this.game.time.events.add(Phaser.Timer.SECOND*duration, function() {
          display.text = "";
          if (callback != null) {
            callback.call(this);
          }
        }, this);
      }
    }
  },
  _countDown: function (count, callback) {
    var that = this;

    this._displayMessage(count--, null, null);
    var loopId = this.game.time.events.loop(Phaser.Timer.SECOND, function() {
      if (count <= 0) {
        that.game.time.events.remove(loopId);
        that._displayMessage("", null, null);
        callback.call(that);
        return;
      }

      that._displayMessage(count--, null, null);
    }, that);
  },
  _resetAndFreezeGame: function() {
    var that = this;

    for (var index in this.groups.balls.children) {
      var ball = this.groups.balls.children[index];

      ball.body.static = true;
      ball.body.x = ball.$defaultAttributes.position.x;
      ball.body.y = ball.$defaultAttributes.position.y;
      ball.body.velocity.x = 0;
      ball.body.velocity.y = 0;
      ball.body.setZeroRotation();

      if (that.options.configs.events.resetAfterGoal) {
        Utils.object.mergeObject(ball.$defaultAttributes, ball.$attributes);
      }
    }

    for (var index in this.groups.events.children) {
      this.groups.events.children[index].destroy();
    }

    for (var index in this.groups.players.children) {
      var player = this.groups.players.children[index];

      player.$attributes.inputsEnabled = false;
      player.body.velocity.x = 0;
      player.body.velocity.y = 0;
      player.body.x = player.$defaultAttributes.position.x;
      player.body.y = player.$defaultAttributes.position.y;

      if (that.options.configs.events.resetAfterGoal) {
        Utils.object.mergeObject(player.$defaultAttributes, player.$attributes);
      }
    }
  },
  _releaseGame: function() {
    this._displayMessage("");

    this.groups.balls.forEach(function (ball) {
      ball.body.velocity.x = ball.game.rnd.integerInRange(-25, 25) * 10;
      ball.body.damping = 0.2;
      ball.body.mass = 0.2;
      ball.body.static = false;
    });

    this.groups.players.forEach(function(player) {
      player.$attributes.inputsEnabled = true;
    });
  },

  createPitch: function(pitchOptions) {
    var pitch = this.groups.pitchs.create(0, 0, '');
    this.game.physics.enable(pitch, Phaser.Physics.P2JS);
    pitch.body.clearShapes();

    var graphics;
    // createColor(r, g, b, alpha, hue, saturation, lightness, value)
    var color;

    for (var i = 0; i < pitchOptions.length; i++) {
      color = Phaser.Color.createColor(pitchOptions[i].color.red, pitchOptions[i].color.green, pitchOptions[i].color.blue, 0, 0, 0, 0, 0);
      graphics = this.game.add.graphics(0, 0);
      graphics.lineStyle(5, color.color, 0.5);
      graphics.beginFill(color.color);

      if(pitchOptions[i].type == "polygon") {
        graphics.moveTo(pitchOptions[i].points[0][0], pitchOptions[i].points[0][1]);
        for (var j = 1; j < pitchOptions[i].points.length; j++) {
          graphics.lineTo(pitchOptions[i].points[j][0], pitchOptions[i].points[j][1]);
        }

        pitch.body.addPolygon(null, pitchOptions[i].points);
      }

      else if(pitchOptions[i].type == "convex") {
        graphics.moveTo(pitchOptions[i].vertices[0][0], pitchOptions[i].vertices[0][1]);
        for (var j = 1; j < pitchOptions[i].vertices.length; j++) {
          graphics.lineTo(pitchOptions[i].vertices[j][0], pitchOptions[i].vertices[j][1]);
        }

        var vertices = [];
        for (var a = 0; a < pitchOptions[i].vertices.length; a++) {
          vertices[a] = [];
          vertices[a][0] = (pitchOptions[i].vertices[a][0]-600) / -20;
          vertices[a][1] = (pitchOptions[i].vertices[a][1]-122) / -20;
        }

        var convex = new p2.Convex({ vertices: vertices } );
        pitch.body.addShape(convex, 0, 0, 0);
      }

      else if(pitchOptions[i].type == "circle") {
        graphics.moveTo(0, 0);
        graphics.drawCircle(pitchOptions[i].x, pitchOptions[i].y, 40*pitchOptions[i].diameter);

        var circle = new p2.Circle({ radius: pitchOptions[i].diameter } );
        pitch.body.addShape(circle, pitchOptions[i].x-600, pitchOptions[i].y-122, 0);
      }

      graphics.endFill();

      this.groups.pitchs.add(graphics);
    }

    pitch.body.immovable = true;
    pitch.body.moves = false;
    pitch.body.setMaterial(this.materials.stages);
    pitch.body.setCollisionGroup(this.collisionGroups.stages);
    pitch.body.collides([this.collisionGroups.players, this.collisionGroups.balls]);
    pitch.body.static = true;


    if (this.options.configs.debug.pitch) {
      pitch.body.debug = true;
    }

    return pitch;
  },
  createStage: function(stageOptions) {
    var stage = this.groups.stages.create(resolution.x/2, resolution.y-30, 'ground');
    stage.scale.setTo(3, 2);
    stage.body.addShape(new p2.Box({ width: 60, height: 3 }), 0, 0, 0);

    if (this.options.configs.debug.stage) {
      stage.body.debug = true;
    }

    return stage;
  },
  createPlayer: function(playerOptions) {
    var player = this.groups.players.create(playerOptions.position.x, playerOptions.position.y, playerOptions.sprite);
    player.$attributes = {
      uid: playerOptions.uid,
      position: playerOptions.position,
      speeds: playerOptions.speeds,
      team: playerOptions.team,
      inputs: playerOptions.inputs
    };

    player.$defaultAttributes = Utils.object.clone(player.$attributes);
    player.$lastAttributes = Utils.object.clone(player.$attributes);

    if (player.$attributes.team == 'right') {
      player.anchor.setTo(0.5, 0.5);
      player.scale.x = -1;
    }

    player.body.clearShapes();
    player.body.addShape(new p2.Circle({radius: 1.3}), 2, -7, 0); // player head
    player.body.addShape(new p2.Circle({radius: 1.4}), 0, 0, 0); // player body

    player.body.setMaterial(this.materials.players);
    player.body.collideWorldBounds = true;
    player.body.fixedRotation = true;
    player.body.damping = 0.5; // Amortissement
    player.body.mass = 6;

    player.body.setCollisionGroup(this.collisionGroups.players);
    player.body.collides([this.collisionGroups.stages, this.collisionGroups.players]);
    player.body.collides(this.collisionGroups.balls, function(playerBody, ballBody) {
      this.hitBall(playerBody.sprite, ballBody.sprite);
    }, this);

    player.foot = this.createFoot(playerOptions.position, player);

    if (this.options.configs.debug.player) {
      player.body.debug = true;
    }

    return player;
  },
  createFoot: function(position, player) {
    var foot = this.groups.feets.create(position.x, position.y, 'foot', 0, true);
    foot.body.clearShapes();
    foot.exists = true;

    if (player.$attributes.team == 'right') {
      foot.anchor.setTo(0.5, 0.5);
      foot.scale.x = -1;
    }

    if (player.$attributes.team == 'right') {
      foot.body.addPolygon(null, [ [8, -10], [25, -10], [25, 12], [0, 12] ]);
    }
    else {
      foot.body.addPolygon(null, [ [17, -10], [0, -10], [0, 12], [25, 12] ]);
    }

    foot.body.setCollisionGroup(this.collisionGroups.feets);
    foot.body.collides(this.collisionGroups.balls, function(footBody, ballBody) {
      this.hitBall(player, ballBody.sprite);
    }, this);

    foot.body.setMaterial(this.materials.feets);
    foot.body.mass = 1;

    if (player.$attributes.team == 'right') {
      foot.constraint = this.game.physics.p2.createRevoluteConstraint(player, [0, -10], foot, [-14, -45]);
    }
    else {
      foot.constraint = this.game.physics.p2.createRevoluteConstraint(player, [-2, -10], foot, [14, -45]);
    }

    foot.constraint.lowerLimitEnabled = true;
    foot.constraint.upperLimitEnabled = true;
    foot.constraint.enableMotor();
    if (player.$attributes.team == 'right') {
      foot.constraint.lowerLimit = Phaser.Math.degToRad(0);
      foot.constraint.upperLimit = Phaser.Math.degToRad(90);
    }
    else {
      foot.constraint.lowerLimit = Phaser.Math.degToRad(-90);
      foot.constraint.upperLimit = Phaser.Math.degToRad(0);
    }

    var multiplicator = (player.$attributes.team == 'right' ? -1:1);
    foot.constraint.setMotorSpeed((player.$attributes.speeds.shoot*multiplicator/2)*-1);

    if (this.options.configs.debug.foot) {
      foot.body.debug = true;
    }

    return foot;
  },
  createGoal: function(goalOptions) {
    var goal = this.groups.goals.create(goalOptions.position.x, goalOptions.position.y, 'goal');

    var topBar = this.groups.stages.create(goalOptions.position.x + (goalOptions.team == 'right'? 0 : 61), goalOptions.position.y+5);
    topBar.body.setRectangle(120, 10);
    topBar.body.angle = (goalOptions.team == 'right'? -2 : 2);
    topBar.body.static = true;

    var backBar = this.groups.stages.create(goalOptions.position.x + (goalOptions.team == 'right'? 50 : 15), goalOptions.position.y+100);
    backBar.body.setRectangle(10, 200);
    backBar.body.angle = (goalOptions.team == 'right'? 175:-175);
    backBar.body.static = true;

    var goalArea = this.groups.areas.create(goalOptions.position.x + (goalOptions.team == 'right'? 12 : 52), goalOptions.position.y+100);
    var goalAreaShape = goalArea.body.setRectangle(80, 180);
    goalAreaShape.sensor = true;

    goalArea.body.setCollisionGroup(this.collisionGroups.areas);
    goalArea.body.collides([this.collisionGroups.balls]);

    var tinArea = this.groups.areas.create(goalOptions.position.x + (goalOptions.team == 'right'? -40 : 104), goalOptions.position.y+100);

    var timeoutId = null;
    var backBarTouched = false;
    goalArea.body.onBeginContact.add(function(ballBody) {
      var message = 'GOAL {'+parseInt(Math.abs(ballBody.velocity.x)/6)+'km/h}';
      backBarTouched = false;

      timeoutId = this._displayMessage(message, 0.5, function() {
        timeoutId = null;
        this.game.socket.emit('game.player.scores', {
          goalUid: goalOptions.uid,
          playerUid: ballBody.sprite.$attributes.uid,
          timestamp: new Date().getTime()
        });
      });
    }, this);

    if (this.options.configs.scores.tinEnabled) {
      backBar.body.collides(this.collisionGroups.balls, function(goalBody, ballBody) {
        backBarTouched = true;
      }, this);

      var tinAreaShape = tinArea.body.setRectangle(200, 180);
      tinAreaShape.sensor = true;

      tinArea.body.setCollisionGroup(this.collisionGroups.areas);
      tinArea.body.collides([this.collisionGroups.balls]);

      tinArea.body.onEndContact.add(function(ballBody) {
        if (timeoutId != null && backBarTouched) {
          this.game.time.events.remove(timeoutId);
          timeoutId = null;

          this._displayMessage('GAMELLE -1 !!!', 0.8, function() {
            this.game.socket.emit('game.player.tins', {
              goalUid: goalOptions.uid,
              playerUid: ballBody.sprite.$attributes.uid,
              timestamp: new Date().getTime()
            });
          });
        }
      }, this);
    }

    if (goalOptions.team == 'right') {
      goal.anchor.setTo(0.5, 0);
      goal.scale.x = -1;
      goal.scale.y = 1;
    }

    if (this.options.configs.debug.goal) {
      topBar.body.debug = true;
      backBar.body.debug = true;
      goalArea.body.debug = true;
      tinArea.body.debug = true;
    }

    return goal;
  },
  createBall: function(ballOptions) {
    var ball = this.groups.balls.create(ballOptions.position.x, ballOptions.position.y, 'ball');
    ball.$attributes = {
      uid: ballOptions.uid,
      position: ballOptions.position,
      radius: ballOptions.radius,
      scale: ballOptions.scale,
      lastPlayerHit: this.groups.players.children[0]
    };

    ball.$defaultAttributes = Utils.object.clone(ball.$attributes, ['uid', 'position', 'radius', 'scale']);

    ball.body.setCircle(ball.$attributes.radius, 0, 0, 0);
    ball.body.mass = 0.2;
    ball.body.damping = 0.2;
    ball.body.setMaterial(this.materials.balls);
    ball.body.setCollisionGroup(this.collisionGroups.balls);
    ball.body.collides([this.collisionGroups.balls, this.collisionGroups.stages, this.collisionGroups.players, this.collisionGroups.feets, this.collisionGroups.areas]);

    if (this.options.configs.debug.ball) {
      ball.body.debug = true;
    }

    return ball;
  },
  createDisplay: function(displayOptions) {
    var display = this.game.add.text(displayOptions.position.x, displayOptions.position.y, displayOptions.text, displayOptions.style);
    this.groups.displays.add(display);

    display.$attributes = {
      uid: displayOptions.uid,
      name: displayOptions.name
    }

    display.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
    display.setTextBounds(0, 100, resolution.x, 100);

    return display;
  },
  createBonus: function(bonusOptions) {
    var event = this.groups.events.create(bonusOptions.position.x, bonusOptions.position.y, bonusOptions.name);
    event.$attributes = bonusOptions;

    var bonusAreaShape = event.body.setRectangle(75, 75);
    bonusAreaShape.sensor = true;

    event.body.static = true;
    event.body.setCollisionGroup(this.collisionGroups.areas);
    event.body.collides([this.collisionGroups.balls]);
    event.body.onBeginContact.add(function(ballBody) {
      var that = this;
      this._displayMessage(event.$attributes.message + " - " + event.$attributes.duration + " sec", 3, function() {
        that._displayMessage("");
      });

      this.game.socket.emit('game.event.take', {
        eventUid: event.$attributes.uid,
        takerUid: ballBody.sprite.$attributes.lastPlayerHit.$attributes.uid
      });

      event.destroy();
    }, this);

    if (this.options.configs.debug.event) {
      event.body.debug = true;
    }
  },

  hitBall: function (player, ball) {
    ball.$attributes.lastPlayerHit = player;
  }
};

module.exports = GameState;
