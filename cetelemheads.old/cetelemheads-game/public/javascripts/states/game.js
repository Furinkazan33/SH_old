'use strict';

define([
  'Phaser'
], function (Phaser) {
  const resolution = { "x": 1200, "y": 750 };

  const CONFIG = {
    "CM":     { "RESTITUTION": { "PW": 0,   "PS": 0,   "PP": 0,   "PB": 0.8, "FS": 0.2, "FB": 1.2, "BW": 0.7, "BS": 0.7, "BB": 1.2 },
                "FRICTION":    { "PW": 0.2, "PS": 0.2, "PP": 0.2, "PB": 0.5, "FS": 0.5, "FB": 25,  "BW": 10,  "BS": 10,  "BB": 0.2 } }
  };

  var GameState = function() {};

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
    _objects: {
      balls: {},
      events: {},
      players: {},
    },
    _ping: 0,
    _socketDelay: 16,
    _socketTiming: 0,

    init: function (options) {
      this.options = options;
    },

    preload: function() {
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

      for (var index = 0; index < this.options.skins.length; index++) {
        var skin = this.options.skins[index];
        this.game.load.image(skin.id, skin.image);
      }

      this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
      this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.UP);
      this.game.input.keyboard.addKeyCapture(Phaser.Keyboard.DOWN);
    },

    create: function() {
      window.location.hash = 'game';

      var that = this;

      this._registerNetwork(this.game.socket);

      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
      this.game.physics.p2.restitution = 0.8;
      this.game.physics.p2.gravity.x = this.options.configs.gravity.x;
      this.game.physics.p2.gravity.y = this.options.configs.gravity.y;

      this.game.add.sprite(0, 0, 'background');

      var groupConfigs = {
        stages: {addToStage: false, enableBody: true},
        pitchs: {addToStage: false, enableBody: false},
        balls: {addToStage: false, enableBody: true},
        players: {addToStage: false, enableBody: true},
        feets: {addToStage: false, enableBody: true},
        events: {addToStage: false, enableBody: true},
        goals: {addToStage: false, enableBody: false},
        areas: {addToStage: true, enableBody: true},
        displays: {addToStage: false, enableBody: false},
        worlds: {addToStage: false, enableBody: false}
      };

      for (var index in groupConfigs) {
        var groupConfig = groupConfigs[index];
        this.groups[index] = this.game.add.group(this.game.world, index, groupConfig.addToStage, groupConfig.enableBody, Phaser.Physics.P2JS);
        this.collisionGroups[index] = this.game.physics.p2.createCollisionGroup();
        this.materials[index] = this.game.physics.p2.createMaterial(index);
      }

      //  4 trues = the 4 faces of the world in left, right, top, bottom order
      this.game.physics.p2.setWorldMaterial(this.materials.worlds, true, true, true, true);
      this.game.physics.p2.updateBoundsCollisionGroup();

      var stage = this.createStage();
      var pitch = this.createPitch(this.options.pitch);

      for (var index = 0; index < this.options.balls.length; index++) {
        this.createBall(this.options.balls[index]);
      }

      for (var index = 0; index < this.options.players.length; index++) {
        this.createPlayer(this.options.players[index]);
      }

      for (var index = 0; index < this.options.goals.length; index++) {
        this.createGoal(this.options.goals[index]);
      }

      for (var index = 0; index < this.options.displays.length; index++) {
        this.createDisplay(this.options.displays[index]);
      }

      for (var index = 0; index < this.groups.stages.children.length; index++) {
        var stage = this.groups.stages.children[index];

        stage.body.immovable = true;
        stage.body.moves = false;
        stage.body.setMaterial(this.materials.stages);
        stage.body.setCollisionGroup(this.collisionGroups.stages);
        stage.body.collides([this.collisionGroups.players, this.collisionGroups.balls]);
        stage.body.static = true;
      }

      for (var index = 0; index < this.groups.areas.children.length; index++) {
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

      var bar = this.game.add.graphics();
      bar.beginFill(0x000000, 0.2);
      bar.drawRect(0, 0, 100, 100);

      bar = this.game.add.graphics();
      bar.beginFill(0x000000, 0.2);
      bar.drawRect(1100, 0, 100, 100);

      this._resetAndFreezeGame();
    },

    update: function() {
      if (this.options.configs.debug.mouse) {
        var pos = this.game.input.activePointer.position;
        this.game.debug.text("x:" + pos.x + " y:" + pos.y, 180, 200);
      }

      if (this.options.configs.debug.network) {
        var display = this._getDisplayByName('latency');
        if (display != null) {
          display.text = this._ping;
        }
      }

      for (var index = 0; index < this.groups.players.children.length; index++) {
        var player = this.groups.players.children[index];
        if (this._isPlayerLocal(player)) {
          this._handleInputs(player);
        }
      }

      for (var index = 0; index < this.groups.balls.children.length; index++) {
        var ball = this.groups.balls.children[index];
        ball.scale.setTo(ball.$attributes.scale.x, ball.$attributes.scale.y);
      }

      if (this.options.configs.mode == 'online') {
        this._handleNetwork();
      }
    },

    _getPlayerByUID: function(uid) {
      return this._objects.players[uid];
    },
    _getLocalPlayer: function() {
      return this._objects.localPlayer;
    },
    _isPlayerLocal: function(player) {
      return player.$attributes.clientUid == window['game.data'].clientUid;
    },
    _isPlayerHost: function(player) {
      return player.$attributes.host;
    },
    _getEventByUID: function(uid) {
      return this._objects.events[uid];
    },
    _getBallByUID: function(uid) {
      return this._objects.balls[uid];
    },
    _getDisplayByName: function(name) {
      for (var index = 0; index < this.groups.displays.children.length; index++) {
        var display = this.groups.displays.children[index];
        if (display.$attributes.name == name) {
          return display;
        }
      }
      return null;
    },
    _getSocketDelay: function() {
      return this._ping < this._socketDelay ? this._ping : this._socketDelay;
    },

    _registerNetwork: function(socket) {
      var that = this;

      socket.on('game.countdown.set', function(data) {
        that._displayMessage(data.value);
      });
      socket.on('game.reset', function(data) {
        that._resetAndFreezeGame(data);
      });
      socket.on('game.release', function(data) {
        that._releaseGame(data);
      });
      socket.on('game.display.update', function(data) {
        var display = that._getDisplayByName(data.name);
        if (display != null) {
          display.text = data.text;
        }
      });
      socket.on('game.finish', function(data) {
        if (data.winner != null) {
          that._displayMessage('Team '+data.winner+' wins !'/*, 3, function() {
            socket.emit('lobby.game.quit', {
              gameUid: that.options.configs.uid
            });

            socket.removeAllListeners();
            that.game.state.start('main-menu');
          }*/);
        }
        else {
          that._displayMessage('Draw'/*, 3, function() {
            socket.emit('lobby.game.quit', {
              gameUid: that.options.configs.uid
            });

            socket.removeAllListeners();
            that.game.state.start('main-menu');
          }*/);
        }

      });

      socket.on('game.player.attributes.set', function(data) {
        var player = that._getPlayerByUID(data.targetUid);
        if (player == null) {
          console.log("Error: player target not found");
          return;
        }

        for (var attribute in data.attributes) {
          Utils.object.setAttribute(player.$attributes, attribute, data.attributes[attribute]);
        }
      });
      socket.on('game.player.attributes.reset', function(data) {
        var player = that._getPlayerByUID(data.targetUid);
        if (player == null) {
          console.log("Error: player target not found");
          return;
        }

        for (var attribute in data.attributes) {
          Utils.object.setAttribute(player.$attributes, data.attributes[attribute], Utils.object.getAttribute(player.$defaultAttributes, data.attributes[attribute]));
        }
      });

      socket.on('game.ball.attributes.set', function(data) {
        for (var index = 0; index < that.groups.balls.children.length; index++) {
          var ball = that.groups.balls.children[index];
          for (var attribute in data.attributes) {
            Utils.object.setAttribute(ball.$attributes, attribute, data.attributes[attribute]);
          }
        }
      });
      socket.on('game.ball.attributes.reset', function(data) {
        for (var index = 0; index < that.groups.balls.children.length; index++) {
          var ball = that.groups.balls.children[index];
          for (var attribute in data.attributes) {
            Utils.object.setAttribute(ball.$attributes, data.attributes[attribute], Utils.object.getAttribute(ball.$defaultAttributes, data.attributes[attribute]));
          }
        }
      });

      socket.on('game.event.create', function(data) {
        that.createEvent(data);
      });
      socket.on('game.event.destroy', function(data) {
        var event = that._getEventByUID(data.eventUid);
        if (event == null) {
          console.log('Error: tryed to destroy non-existant event');
          return;
        }

        event.destroy();
      });

      socket.on('game.state.update', function(data) {
        that._serverState = data;
      });

      if (this.options.configs.mode == 'online') {
        socket.on('game.pong', function(data) {
          that._ping = Date.now() - data.timestamp;
          that.game.time.events.add(Phaser.Timer.SECOND * 2, function() {
            this._emitPing(socket)
          }, that);
        });

        this._emitPing(socket);
      }

      socket.emit('game.player.ready');
    },

    _emitPing: function(socket) {
      socket.emit('game.ping', {
        timestamp: Date.now()
      });
    },

    _handleNetwork: function() {
      var player = this._getLocalPlayer();
      this._updateGameState(this._serverState);
      if (this._isPlayerHost(player)) {
        this._sendBallUpdatePacket(this.groups.balls.children);
      }
    },
    _handleInputs: function(player) {
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
        mustUpdate = true;
      }

      var mustUpdate = false;
      if (this.game.input.keyboard.isDown(Phaser.Keyboard[inputs.shoot])) {
        player.$attributes.isShooting = true;
        this._footShoot(player);
        mustUpdate = true;
      }
      else if (player.$attributes.isShooting) {
        player.$attributes.isShooting = false;
        this._footReset(player);
        mustUpdate = true;
      }

      if (player.body.velocity.x != 0 || player.body.velocity.y != 0 || mustUpdate) {
        this.game.socket.emit('game.player.position.update', {
          uid: player.$attributes.uid,
          position: {
            x: player.body.x,
            y: player.body.y
          },
          velocity: {
            x: player.body.velocity.x,
            y: player.body.velocity.y
          },
          isShooting: player.$attributes.isShooting
        });
      }
    },

    _updateGameState: function(data) {
      if (data == null) {
        return;
      }

      if (!this._isPlayerHost(this._getLocalPlayer())) {
        for (var index = 0; index < data.balls.length; index++) {
          var ballUpdated = data.balls[index];
          var ball = this._getBallByUID(ballUpdated.uid);
          if (ball == null) {
            console.log("Error: target ball not found");
            continue;
          }

          ball.body.x = ballUpdated.position.x;
          ball.body.y = ballUpdated.position.y;

          ball.body.velocity.x = ballUpdated.velocity.x;
          ball.body.velocity.y = ballUpdated.velocity.y;
        }
      }

      for (var index = 0; index < data.players.length; index++) {
        var playerUpdated = data.players[index];
        var player = this._getPlayerByUID(playerUpdated.uid);
        if (player == null) {
          console.log("Error: target player not found");
          return;
        }

        if (this._isPlayerLocal(player)) {
          continue;
        }

        player.body.x = playerUpdated.position.x;
        player.body.y = playerUpdated.position.y;
        player.body.velocity.x = playerUpdated.velocity.x;
        player.body.velocity.y = playerUpdated.velocity.y;

        if (playerUpdated.isShooting) {
          this._footShoot(player);
        }
        else {
          this._footReset(player);
        }
      }
    },
    _sendBallUpdatePacket(balls) {
      this._socketTiming += this.game.time.elapsed;
      if (this._socketTiming < this._getSocketDelay()) {
          return;
      }

      this._socketTiming = 0;

      var updatePacket = {
        balls: []
      };

      for (var index = 0; index < balls.length; index++) {
        var ball = balls[index];

        if (!ball.$attributes.hasScored) {
           updatePacket.balls.push({
             uid: ball.$attributes.uid,
             position: {
               x: ball.body.x,
               y: ball.body.y
             },
             velocity: {
               x: ball.body.velocity.x,
               y: ball.body.velocity.y
             }
           })
        }
      }

      this.game.socket.emit('game.balls.position.update', updatePacket);
    },

    _footShoot: function(player) {
      player.foot.constraint.setMotorSpeed(player.$attributes.speeds.shoot*(player.$attributes.team == 'right' ? -1:1));
    },
    _footReset: function(player) {
      player.foot.constraint.setMotorSpeed(((player.$attributes.speeds.shoot*(player.$attributes.team == 'right' ? -1:1))/2)*-1);
    },

    _displayMessage: function(message) {
      var display = this._getDisplayByName('message');
      if (display != null) {
        display.text = message;
      }
    },
    _resetAndFreezeGame: function() {
      var that = this;

      for (var index = 0; index < this.groups.balls.children.length; index++) {
        var ball = this.groups.balls.children[index];

        ball.body.static = true;
        ball.body.x = ball.$defaultAttributes.position.x;
        ball.body.y = ball.$defaultAttributes.position.y;
        ball.body.velocity.x = 0;
        ball.body.velocity.y = 0;
        ball.body.setZeroRotation();
        ball.$attributes.hasScored = false;

        if (that.options.configs.events.resetAfterGoal) {
          Utils.object.merge(ball.$defaultAttributes, ball.$attributes);
        }
      }

      for (var index = 0; index < this.groups.events.children.length; index++) {
        this.groups.events.children[index].destroy();
      }

      for (var index = 0; index < this.groups.players.children.length; index++) {
        var player = this.groups.players.children[index];

        player.$attributes.inputsEnabled = false;
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.body.x = player.$defaultAttributes.position.x;
        player.body.y = player.$defaultAttributes.position.y;

        if (that.options.configs.events.resetAfterGoal) {
          Utils.object.merge(player.$defaultAttributes, player.$attributes);
        }
      }
    },
    _releaseGame: function(data) {
      this._displayMessage("");

      for (var index = 0; index < this.groups.balls.children.length; index++) {
        var ball = this.groups.balls.children[index];

        ball.body.velocity.x = data.balls[index].velocity.x;
        ball.body.velocity.y = data.balls[index].velocity.y;
        ball.body.damping = 0.2;
        ball.body.mass = 0.2;
        ball.body.static = false;
      }

      for (var index = 0; index < this.groups.players.children.length; index++) {
        var player = this.groups.players.children[index];
        player.$attributes.inputsEnabled = true;
      }
    },

    createPitch: function(pitchOptions) {
      var pitch = this.groups.pitchs.create(0, 0, '');
      this.game.physics.enable(pitch, Phaser.Physics.P2JS);
      pitch.body.clearShapes();

      for (var index = 0; index < pitchOptions.definition.length; index++) {
        var definition = pitchOptions.definition[index];

        var color = Phaser.Color.createColor(definition.color.red, definition.color.green, definition.color.blue, 0, 0, 0, 0, 0);
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(5, color.color, 0.5);
        graphics.beginFill(color.color);

        if (definition.type == "polygon") {
          graphics.moveTo(definition.points[0][0], definition.points[0][1]);
          for (var j = 1; j < definition.points.length; j++) {
            graphics.lineTo(definition.points[j][0], definition.points[j][1]);
          }

          pitch.body.addPolygon(null, definition.points);
        }
        else if (definition.type == "convex") {
          graphics.moveTo(definition.vertices[0][0], definition.vertices[0][1]);
          for (var j = 1; j < definition.vertices.length; j++) {
            graphics.lineTo(definition.vertices[j][0], definition.vertices[j][1]);
          }

          var vertices = [];
          for (var a = 0; a < definition.vertices.length; a++) {
            vertices[a] = [];
            vertices[a][0] = (definition.vertices[a][0]-600) / -20;
            vertices[a][1] = (definition.vertices[a][1]-122) / -20;
          }

          var convex = new p2.Convex({ vertices: vertices } );
          pitch.body.addShape(convex, 0, 0, 0);
        }
        else if (definition.type == "circle") {
          graphics.moveTo(0, 0);
          graphics.drawCircle(definition.x, definition.y, 40*definition.diameter);

          var circle = new p2.Circle({ radius: definition.diameter } );
          pitch.body.addShape(circle, definition.x-600, definition.y-122, 0);
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
        clientUid: playerOptions.clientUid,
        position: playerOptions.position,
        speeds: playerOptions.speeds,
        team: playerOptions.team,
        inputs: playerOptions.inputs,
        host: playerOptions.host,
        isShooting: false
      };

      player.$defaultAttributes = Utils.object.clone(player.$attributes, ['host', 'isShooting']);
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

      this._objects.players[player.$attributes.uid] = player;
      if (this._isPlayerLocal(player)) {
        this._objects.localPlayer = player;
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
        ballBody.sprite.$attributes.hasScored = true;
        var message = 'GOAL {'+parseInt(Math.abs(ballBody.velocity.x)/6)+'km/h}';
        backBarTouched = false;

        this._displayMessage(message);
        timeoutId = this.game.time.events.add(Phaser.Timer.SECOND*0.5, function() {
          timeoutId = null;
          this.game.socket.emit('game.player.scores', {
            goalUid: goalOptions.uid,
            playerUid: ballBody.sprite.$attributes.uid,
            timestamp: new Date().getTime()
          });
        }, this);
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

            this._displayMessage('GAMELLE -1 !!!')
            window.setTimeout(function() {
              this.game.socket.emit('game.player.tins', {
                goalUid: goalOptions.uid,
                playerUid: ballBody.sprite.$attributes.uid,
                timestamp: new Date().getTime()
              });
            }, 800);
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
        lastPlayerHit: this.groups.players.children[0],
        hasScored: false
      };

      ball.$defaultAttributes = Utils.object.clone(ball.$attributes, ['lastPlayerHit', 'hasScored']);

      ball.body.setCircle(ball.$attributes.radius, 0, 0, 0);
      ball.body.mass = 0.2;
      ball.body.damping = 0.2;
      ball.body.setMaterial(this.materials.balls);
      ball.body.setCollisionGroup(this.collisionGroups.balls);
      ball.body.collides([this.collisionGroups.balls, this.collisionGroups.stages, this.collisionGroups.players, this.collisionGroups.feets, this.collisionGroups.areas]);

      if (this.options.configs.debug.ball) {
        ball.body.debug = true;
      }

      this._objects.balls[ball.$attributes.uid] = ball;

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
    createEvent: function(bonusOptions) {
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

        var sendPacket = true;
        if (this.options.configs.mode == 'online') {
          if (!this._isPlayerHost(this._getLocalPlayer())) {
            sendPacket = false;
          }
        }

        if (sendPacket) {
          this.game.socket.emit('game.event.take', {
            eventUid: event.$attributes.uid,
            takerUid: ballBody.sprite.$attributes.lastPlayerHit.$attributes.uid
          });
        }

        event.destroy();
      }, this);

      if (this.options.configs.debug.event) {
        event.body.debug = true;
      }

      this._objects.events[event.$attributes.uid] = event;

      return event;
    },

    hitBall: function (player, ball) {
      ball.$attributes.lastPlayerHit = player;
    }
  };

  return GameState;
});
