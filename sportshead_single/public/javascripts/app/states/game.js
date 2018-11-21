'use strict';

define([], function() {
  var debug = { "stage": false, "players": false, "mouse": false, "feet": true };

  const resolution = { "x": 1200, "y": 750 };

  const CONFIG = {
    "GAME":   { "MAX_SCORE": 2, "GRAVITY": 500 },

    "PLAYER": { "JUMP_HEIGHT": -400, "SPEED_FORWARD": 300, "SPEED_BACKWARD": 250 },

    "BONUS":  { "BOUNDARY": { "minX": 150, "maxX": 1050, "minY": 250, "maxY": 400 },
                "MESSAGE_DURATION": 3, "COEF_BONUS": 1.2, "COEF_MALUS": 0.8,
                "FREEZE_SPEED": 0,
                "HIGH_JUMP_HEIGHT": -500, "LOW_JUMP_HEIGHT":-300,
                "SPEED_UP_FORWARD": 400, "SPEED_UP_BACKWARD": 350,
                "SPEED_DOWN_FORWARD":200, "SPEED_DOWN_BACKWARD": 150 },

    "CM":     { "RESTITUTION": { "PW": 0,   "PS": 0,   "PP": 0,   "PB": 0.8, "FS": 0.2, "FB": 1.2, "BW": 0.7, "BS": 0.7, "BB": 1.2 },
                "FRICTION":    { "PW": 0.2, "PS": 0.2, "PP": 0.2, "PB": 0.5, "FS": 0.5, "FB": 25,  "BW": 10,  "BS": 10,  "BB": 0.2 } }
  };


  var bonusTimer;

  const BONUS = {
    "1": {  "name": "BIG_BALL",
            "message": "BIG BALL !",
            "trigger": function(player) {
              groups.balls.forEach(function (ball) {
                ball.body.clearShapes();
                ball.body.setCircle(24, 0, 0, 0);
                ball.scale.setTo(2, 2);
                ball.body.collideWorldBounds = true;
                ball.body.setCollisionGroup(ballsCollisionGroup);
                ball.body.collides([ballsCollisionGroup, stageCollisionGroup, playersCollisionGroup, feetCollisionGroup]);
                ball.body.setMaterial(ballMaterial);
                ball.body.mass = 0.2;
                ball.body.damping = 0.2;
              });
            },
            "restore": function (player) {
              groups.balls.forEach(function (ball) {
                ball.body.clearShapes();
                ball.body.setCircle(18, 0, 0, 0);
                ball.scale.setTo(1.5, 1.5);
                ball.body.collideWorldBounds = true;
                ball.body.setCollisionGroup(ballsCollisionGroup);
                ball.body.collides([ballsCollisionGroup, stageCollisionGroup, playersCollisionGroup, feetCollisionGroup]);
                ball.body.setMaterial(ballMaterial);
                ball.body.mass = 0.2;
                ball.body.damping = 0.2;
              });
            }
          },
    "2": {  "name": "BIG_GOAL",
            "message": "BIG GOAL !",
            "trigger": function(player) {
              //TODO


            },
            "restore": function(player) {
            //TODO

            }

          },
    "3": {  "name": "BIG_HEAD",
            "message": "BIG HEAD !",
            "trigger": function(player) {
              //TODO


            },
            "restore": function(player) {
            //TODO

            }
          },
    "4": {  "name": "BOMB",
            "message": "BOMB !",
            "trigger": function(player) {
              //TODO


            },
            "restore": function(player) {
            //TODO

            }
          },
    "5": {  "name": "BOUNCY",
            "message": "BOUNCY !",
            "trigger": function(player) {
              ContactMaterial.player.world.restitution *= CONFIG.BONUS.COEF_BONUS;
              ContactMaterial.ball.stage.restitution *= CONFIG.BONUS.COEF_BONUS;
              ContactMaterial.player.ball.restitution *= CONFIG.BONUS.COEF_BONUS;
              ContactMaterial.ball.ball.restitution *= CONFIG.BONUS.COEF_BONUS;
              ContactMaterial.feet.ball.restitution *= CONFIG.BONUS.COEF_BONUS;
            },
            "restore": function(player) {
              ContactMaterial.player.world.restitution = CONFIG.CM.RESTITUTION.PW;
              ContactMaterial.player.ball.restitution = CONFIG.CM.RESTITUTION.PB;
              ContactMaterial.feet.ball.restitution = CONFIG.CM.RESTITUTION.FB;
              ContactMaterial.ball.stage.restitution = CONFIG.CM.RESTITUTION.BS;
              ContactMaterial.ball.ball.restitution = CONFIG.CM.RESTITUTION.BB;
            }
          },
    "6": {  "name": "DEAD_BALL",
            "message": "DEAD BALL !",
            "trigger": function(player) {
              ContactMaterial.player.world.restitution *= CONFIG.BONUS.COEF_MALUS;
              ContactMaterial.ball.stage.restitution *= CONFIG.BONUS.COEF_MALUS;
              ContactMaterial.player.ball.restitution *= CONFIG.BONUS.COEF_MALUS;
              ContactMaterial.ball.ball.restitution *= CONFIG.BONUS.COEF_MALUS;
              ContactMaterial.feet.ball.restitution *= CONFIG.BONUS.COEF_MALUS;
            },
            "restore": function(player) {
              ContactMaterial.player.world.restitution = CONFIG.CM.RESTITUTION.PW;
              ContactMaterial.player.ball.restitution = CONFIG.CM.RESTITUTION.PB;
              ContactMaterial.feet.ball.restitution = CONFIG.CM.RESTITUTION.FB;
              ContactMaterial.ball.stage.restitution = CONFIG.CM.RESTITUTION.BS;
              ContactMaterial.ball.ball.restitution = CONFIG.CM.RESTITUTION.BB;
            }
          },
    "7": {  "name": "FREEZE_OTHER",
            "message": "FREEZE !",
            "trigger": function(player) {
              console.log("player.rightSide: "+player.rightSide);

              groups.players.children.forEach(function (item) {
                console.log("item.rightSide: "+item.rightSide);
                if (player.rightSide != item.rightSide) {
                  item.SPEED_FORWARD = CONFIG.BONUS.FREEZE_SPEED;
                  item.SPEED_BACKWARD = CONFIG.BONUS.FREEZE_SPEED;
                }
              });
            },
            "restore": function(player) { console.log("restore FREEZE_OTHER");
              groups.players.children.forEach(function (item) {
                if (player.rightSide != item.rightSide) {
                  item.SPEED_FORWARD = CONFIG.PLAYER.SPEED_FORWARD;
                  item.SPEED_BACKWARD = CONFIG.PLAYER.SPEED_BACKWARD;
                }
              });
            }
          },
    "8": {  "name": "FREEZE_SELF",
            "message": "FREEZE !",
            "trigger": function(player) {
              player.SPEED_FORWARD = CONFIG.BONUS.FREEZE_SPEED;
              player.SPEED_BACKWARD = CONFIG.BONUS.FREEZE_SPEED;
            },
            "restore": function(player) { console.log("restore FREEZE_SELF");
              player.SPEED_FORWARD = CONFIG.PLAYER.SPEED_FORWARD;
              player.SPEED_BACKWARD = CONFIG.PLAYER.SPEED_BACKWARD;
            }
          },
    "9": {  "name": "HIGH_JUMP",
            "message": "HiGH JUMP !",
            "trigger": function(player) {
              player.JUMP_HEIGHT = CONFIG.BONUS.HIGH_JUMP_HEIGHT;
            },
            "restore": function(player) {
              player.JUMP_HEIGHT = CONFIG.PLAYER.JUMP_HEIGHT;
            }
          },
    "10": { "name": "LEG_BROKEN_BONUS",
            "message": "LEG BROKEN !",
            "trigger": function(player) {
              groups.players.forEach(function (item) {
                if (player.rightSide != item.rightSide) {
                  item.foot.constraint.disableMotor();
                }
              });
            },
            "restore": function(player) {
              groups.players.forEach(function (item) {
                if (player.rightSide != item.rightSide) {
                    item.foot.constraint.enableMotor();
                }
              });
            }
          },
    "11": { "name": "LEG_BROKEN_MALUS",
            "message": "LEG BROKEN !",
            "trigger": function(player) {
              player.foot.constraint.disableMotor();
            },
            "restore": function(player) {
              player.foot.constraint.enableMotor();
            }
          },
    "12": { "name": "LITTLE_BALL",
            "message": "LITTLE BALL !",
            "trigger": function(player) {
              groups.balls.forEach(function (ball) {
                ball.body.clearShapes();
                ball.body.setCircle(12, 0, 0, 0);
                ball.scale.setTo(1, 1);
                ball.body.collideWorldBounds = true;
                ball.body.setCollisionGroup(ballsCollisionGroup);
                ball.body.collides([ballsCollisionGroup, stageCollisionGroup, playersCollisionGroup, feetCollisionGroup]);
                ball.body.setMaterial(ballMaterial);
                ball.body.mass = 0.2;
                ball.body.damping = 0.2;
              });
            },
            "restore": function(player) {
              groups.balls.forEach(function (ball) {
                ball.body.clearShapes();
                ball.body.setCircle(18, 0, 0, 0);
                ball.scale.setTo(1.5, 1.5);
                ball.body.collideWorldBounds = true;
                ball.body.setCollisionGroup(ballsCollisionGroup);
                ball.body.collides([ballsCollisionGroup, stageCollisionGroup, playersCollisionGroup, feetCollisionGroup]);
                ball.body.setMaterial(ballMaterial);
                ball.body.mass = 0.2;
                ball.body.damping = 0.2;
              });
            }
          },
    "13": { "name": "LITTLE_GOAL",
            "message": "LITTLE GOAL !",
            "trigger": function(player) {
              //TODO

            },
            "restore": function(player) {
            //TODO

            }
          },
    "14": { "name": "LITTLE_HEAD",
            "message": "LITTLE HEAD !",
            "trigger": function(player) {
              //TODO

            },
            "restore": function(player) {
            //TODO

            }
          },
    "15": { "name": "LOW_JUMP",
            "message": "LOW JUMP !",
            "trigger": function(player) {
              player.JUMP_HEIGHT = CONFIG.BONUS.LOW_JUMP_HEIGHT;
            },
            "restore": function(player) {
              player.JUMP_HEIGHT = CONFIG.PLAYER.JUMP_HEIGHT;
            }
          },
    "16": { "name": "SPEED_DOWN",
            "message": "SPEED DOWN !",
            "trigger": function(player) {
              player.SPEED_FORWARD = CONFIG.BONUS.SPEED_DOWN_FORWARD;
              player.SPEED_BACKWARD = CONFIG.BONUS.SPEED_DOWN_BACKWARD;
            },
            "restore": function(player) {
              player.SPEED_FORWARD = CONFIG.PLAYER.SPEED_FORWARD;
              player.SPEED_BACKWARD = CONFIG.PLAYER.SPEED_BACKWARD;
            }
          },
    "17": { "name": "SPEED_UP",
            "message": "SPEED UP !",
            "trigger": function(player) {
              player.SPEED_FORWARD = CONFIG.BONUS.SPEED_UP_FORWARD;
              player.SPEED_BACKWARD = CONFIG.BONUS.SPEED_UP_BACKWARD;
            },
            "restore": function(player) {
              player.SPEED_FORWARD = CONFIG.PLAYER.SPEED_FORWARD;
              player.SPEED_BACKWARD = CONFIG.PLAYER.SPEED_BACKWARD;
            }
          },
    "18": { "name": "SUPPORTER",
            "message": "SUPPORTER !",
            "trigger": function(player) {
              //TODO

            },
            "restore": function(player) {
            //TODO

            }
          }

   };





  var display = { "style": { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" },
                  "score": { "left": null, "right": null }, "message": null };


  /* Si un but est en cours */
  var goal = false;

  var score = { "left": 0, "right": 0 };


  /* Phaser.group de sprites */
  var groups = { "stage": null, "balls": null, "players": null, "feet": null, "bonus": null };

  /*  Variable globale car modifiée avec les bonus
      Permet de définir les valeurs des propriétés lors des contacts */
  var ContactMaterial = { "player": { "world": null, "stage": null, "player": null, "feet": null, "ball": null },
                          "feet": { "stage": null, "ball": null, "feet": null },
                          "ball": { "world": null, "stage": null, "ball": null } };

  var playerMaterial;
  var feetMaterial;
  var ballMaterial;
  var playersCollisionGroup;
  var feetCollisionGroup;
  var stageCollisionGroup;
  var ballsCollisionGroup;

  /* Timer global utilisé pour le chrono */
  var timer;
  var timedEvent;

  var endGame = false;

  var goalSignal = new Phaser.Signal();

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
    init: function (options) {
      //TODO: Récupérer la config des bonus dans CONFIG_BONUS via fichier config.json ?
      this.options = options;
    },

    preload: function() {

      this.game.load.image('background', 'images/assets/game/stage1200x750.jpg');
      /* 400 * 32 */
      this.game.load.image('ground', 'images/assets/game/ground.png');
      /* 125 * 192 */
      this.game.load.image('LGoal', 'images/assets/game/but gauche.png');
      this.game.load.image('RGoal', 'images/assets/game/but droite.png');

      /* Test bonus */
      this.game.load.image('BIG_BALL', 'images/assets/game/bonus/BIG_BALL.png');
      this.game.load.image('BIG_GOAL', 'images/assets/game/bonus/BIG_GOAL.png');
      this.game.load.image('BIG_HEAD', 'images/assets/game/bonus/BIG_HEAD.png');
      this.game.load.image('BOMB', 'images/assets/game/bonus/BOMB.png');
      this.game.load.image('BOUNCY', 'images/assets/game/bonus/BOUNCY.png');
      this.game.load.image('DEAD_BALL', 'images/assets/game/bonus/DEAD_BALL.png');
      this.game.load.image('FREEZE_OTHER', 'images/assets/game/bonus/FREEZE_OTHER.png');
      this.game.load.image('FREEZE_SELF', 'images/assets/game/bonus/FREEZE_SELF.png');
      this.game.load.image('HIGH_JUMP', 'images/assets/game/bonus/HIGH_JUMP.png');
      this.game.load.image('LEG_BROKEN_BONUS', 'images/assets/game/bonus/LEG_BROKEN_BONUS.png');
      this.game.load.image('LEG_BROKEN_MALUS', 'images/assets/game/bonus/LEG_BROKEN_MALUS.png');
      this.game.load.image('LITTLE_BALL', 'images/assets/game/bonus/LITTLE_BALL.png');
      this.game.load.image('LITTLE_GOAL', 'images/assets/game/bonus/LITTLE_GOAL.png');
      this.game.load.image('LITTLE_HEAD', 'images/assets/game/bonus/LITTLE_HEAD.png');
      this.game.load.image('LOW_JUMP', 'images/assets/game/bonus/LOW_JUMP.png');
      this.game.load.image('SPEED_DOWN', 'images/assets/game/bonus/SPEED_DOWN.png');
      this.game.load.image('SPEED_UP', 'images/assets/game/bonus/SPEED_UP.png');
      this.game.load.image('SUPPORTER', 'images/assets/game/bonus/SUPPORTER.png');

      this.game.load.spritesheet('ball', 'images/assets/game/ballon.png', 23, 23);
      this.game.load.spritesheet('player_italia', 'images/assets/game/player.png', 58, 83);
      this.game.load.spritesheet('footL', 'images/assets/game/foot left.png', 28, 30);
      this.game.load.spritesheet('footR', 'images/assets/game/foot right.png', 28, 30);

    },

    create: function() {
      this.game.physics.startSystem(Phaser.Physics.P2JS);
      this.game.physics.p2.setImpactEvents(true);
      this.game.physics.p2.world.defaultContactMaterial.friction = 0.3;
      this.game.physics.p2.restitution = 0.8;
      this.game.physics.p2.gravity.y = CONFIG.GAME.GRAVITY;

      var worldMaterial = this.game.physics.p2.createMaterial('worldMaterial');
      var stageMaterial = this.game.physics.p2.createMaterial('stageMaterial');
      playerMaterial = this.game.physics.p2.createMaterial('playerMaterial');
      feetMaterial = this.game.physics.p2.createMaterial('feetMaterial');
      ballMaterial = this.game.physics.p2.createMaterial('ballMaterial');

      //  4 trues = the 4 faces of the world in left, right, top, bottom order
      this.game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);
      //this.game.physics.p2.enable(this.game.world, true);

      this.game.add.sprite(0, 0, 'background');
      this.game.add.sprite(resolution.x - 120, resolution.y - 64 - 192, 'RGoal');
      this.game.add.sprite(0, resolution.y - 64 - 192, 'LGoal');


      /* Les 2 derniers paramètres ne sont pas pris en compte */
      groups.stage = this.game.add.group(this.game.world, 'stage', false, true, Phaser.Physics.P2JS);
      groups.balls = this.game.add.group(this.game.world, 'balls', false, true, Phaser.Physics.P2JS);
      groups.players = this.game.add.group(this.game.world, 'players', false, true, Phaser.Physics.P2JS);
      groups.feet = this.game.add.group(this.game.world, 'feet', false, true, Phaser.Physics.P2JS);
      groups.bonus = this.game.add.group(this.game.world, 'bonus', false, false, Phaser.Physics.P2JS);
      //this.game.physics.p2.enable( [ groups.stage, groups.players, groups.balls, groups.feet ]);

      /* Permet d'assigner à un sprite afin de savoir avec quoi il collisionne */
      stageCollisionGroup = this.game.physics.p2.createCollisionGroup();
      playersCollisionGroup = this.game.physics.p2.createCollisionGroup();
      feetCollisionGroup = this.game.physics.p2.createCollisionGroup();
      ballsCollisionGroup = this.game.physics.p2.createCollisionGroup();

      this.game.physics.p2.updateBoundsCollisionGroup();



      var ground = groups.stage.create(resolution.x/2, resolution.y - 30, 'ground');
      ground.scale.setTo(3, 2);
      ground.body.addShape(new p2.Box({ width: 60, height: 3 }), 0, 0, 0);
      if(debug.stage) { ground.body.debug = true; }

      // createGoal (x, y, rightSide);
      createGoal (0, resolution.y - 84, false);
      createGoal (resolution.x, resolution.y - 84, true);

      //TODO: descendre
      function createGoal (x, y, rightSide) {
        var barreHaut = groups.stage.create(x, y-156);
        barreHaut.body.addRectangle(242, 10, 0, -16, 0);
        barreHaut.body.angle = rightSide?-2:2;

        var barreFond = groups.stage.create(x + (rightSide? 10:-10), y);
        barreFond.body.addShape(new p2.Box({ width: 0.5, height: 8.8 }), rightSide ? 10:-10, 85, 0);
        barreFond.body.angle = rightSide?175:-175;
        barreFond.body.damping = 0.9;

        if(debug.stage) { barreHaut.body.debug = true; barreFond.body.debug = true; }
      }

      groups.stage.forEach(function (element) {
        element.body.immovable = true;
        element.body.moves = false;
        element.body.setMaterial(stageMaterial);
        element.body.setCollisionGroup(stageCollisionGroup);
        element.body.collides([playersCollisionGroup, ballsCollisionGroup]);
        element.body.static = true;
      });


      this.createPlayer (155, resolution.y - 105, 'player_italia', false);
      this.createPlayer (resolution.x - 150, resolution.y - 105, 'player_italia', true);





      /* Création des balles centrées */
      var posX0 = (resolution.x/2) - Math.floor(this.options.balls/2) * (this.options.balls%2?40:30);

      for (var i = 0; i < this.options.balls; i++) {
        var positionX = posX0 + i * 40;
        var positionY = 350;
        var ball = groups.balls.create(positionX, positionY, 'ball', 0, false);
        ball.lastPlayerHit = groups.players.children[0];
        ball.positionX = positionX;
        ball.positionY = positionY;
      }


      var i = 1;
      groups.balls.forEach(function(ball) {
        ball.body.clearShapes();
        ball.body.setCircle(18, 0, 0, 0);
        ball.scale.setTo(1.5, 1.5);
        var randomValue = ball.body.game.rnd.integerInRange(-150, 150);
        ball.body.velocity.x = randomValue;
        ball.body.collideWorldBounds = true;
        ball.exists = true;

        ball.body.setCollisionGroup(ballsCollisionGroup);
        ball.body.collides([ballsCollisionGroup, stageCollisionGroup, playersCollisionGroup, feetCollisionGroup]);
        ball.body.setMaterial(ballMaterial);
        ball.body.mass = 0.2;
        ball.body.damping = 0.2;

      }, this);



      ContactMaterial.player.world = this.game.physics.p2.createContactMaterial(playerMaterial, worldMaterial, { friction: CONFIG.CM.FRICTION.PW, restitution: CONFIG.CM.RESTITUTION.PW });
      ContactMaterial.player.stage = this.game.physics.p2.createContactMaterial(playerMaterial, stageMaterial, { friction: CONFIG.CM.FRICTION.PS, restitution: CONFIG.CM.RESTITUTION.PS });
      ContactMaterial.player.player = this.game.physics.p2.createContactMaterial(playerMaterial, playerMaterial, { friction: CONFIG.CM.FRICTION.PP, restitution: CONFIG.CM.RESTITUTION.PP });
      //ContactMaterial.player.feet = this.game.physics.p2.createContactMaterial(playerMaterial, feetMaterial, { friction: CONFIG.CM.FRICTION.PF, restitution: CONFIG.CM.RESTITUTION.PF });
      ContactMaterial.player.ball = this.game.physics.p2.createContactMaterial(playerMaterial, ballMaterial, { friction: CONFIG.CM.FRICTION.PB, restitution: CONFIG.CM.RESTITUTION.PB });

      ContactMaterial.feet.stage = this.game.physics.p2.createContactMaterial(feetMaterial, stageMaterial, { friction: CONFIG.CM.FRICTION.FS, restitution: CONFIG.CM.RESTITUTION.FS });
      ContactMaterial.feet.ball = this.game.physics.p2.createContactMaterial(feetMaterial, ballMaterial, { friction: CONFIG.CM.FRICTION.FB, restitution: CONFIG.CM.RESTITUTION.FB });
      //ContactMaterial.feet.feet = this.game.physics.p2.createContactMaterial(feetMaterial, feetMaterial, { friction: CONFIG.CM.FRICTION.FF, restitution: CONFIG.CM.RESTITUTION.FF });

      ContactMaterial.ball.world = this.game.physics.p2.createContactMaterial(ballMaterial, worldMaterial, { friction: CONFIG.CM.FRICTION.BW, restitution: CONFIG.CM.RESTITUTION.BW });
      ContactMaterial.ball.stage = this.game.physics.p2.createContactMaterial(ballMaterial, stageMaterial, { friction: CONFIG.CM.FRICTION.BS, restitution: CONFIG.CM.RESTITUTION.BS });
      ContactMaterial.ball.ball = this.game.physics.p2.createContactMaterial(ballMaterial, ballMaterial, { friction: CONFIG.CM.FRICTION.BB, restitution: CONFIG.CM.RESTITUTION.BB });




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

      display.score.left = this.game.add.text(-550, -100, "0", display.style);
      display.score.left.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      display.score.left.setTextBounds(0, 100, resolution.x, 100);

      display.score.right = this.game.add.text(550, -100, "0", display.style);
      display.score.right.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      display.score.right.setTextBounds(0, 100, resolution.x, 100);

      display.message = this.game.add.text(0, 0, "", display.style);
      display.message.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);
      display.message.setTextBounds(0, 100, resolution.x, 100);



      timer = this.game.time.create(this.game);
      timer.start();


      this.resetAndFreezeGame();
      this.createReccursiveTimedBonus();
      this.countDown(this, 3, this.releaseGame);


      //TODO: refacto
      goalSignal.add(function(context, arg) {
        console.log("goal" + arg);
        console.log(this.game.time.events);
        console.log("ADD event wait 0.2 goal");


        this.displayMessage (this, "G O A L", 1, function () {});
        //display.message.text = "G O A L";

        timedEvent = this.game.time.events.add(Phaser.Timer.SECOND * 0.2, function () {
          //this.game.time.events.remove(timedEvent);

          this.resetAndFreezeGame();

          if (score.left >= CONFIG.GAME.MAX_SCORE) {
            this.displayMessage (this, "Player 1 wins !", 1, function () {});
            //display.message.text = "Player 1 wins !"
            endGame = true;
          }
          else if (score.right >= CONFIG.GAME.MAX_SCORE) {
            this.displayMessage (this, "Player 2 wins !", 1, function () {});
            //display.message.text = "Player 2 wins !"
            endGame = true;
          }
          else {
            this.countDown(this, 3, this.releaseGame);
          }

          if (endGame) {
            console.log("ADD event endGame");
            timedEvent = this.game.time.events.add(Phaser.Timer.SECOND * 0.5, function () {
              this.game.paused = true;
              //this.game.time.events.remove(timedEvent);
              endGame = false;
            }.bind(this));
          }

          goal = false;

        }, this);

      }, this);

    },






    update: function() {

      if (debug.mouse) {
        var pos = this.game.input.activePointer.position;
        this.game.debug.text("x:" + pos.x + " y:" + pos.y, 180, 200);
      }



      /* Players controlls */
      var cursors = this.game.input.keyboard.createCursorKeys();

      groups.players.forEach(function (player) {
        if(player.body.static == false)
        {
          if(player.rightSide) {
            setKeys (player,
              cursors.up,
              cursors.left,
              cursors.right,
              player.game.input.keyboard.addKey(Phaser.KeyCode.P), false);
          }
          else {
            setKeys (player,
              player.game.input.keyboard.addKey(Phaser.Keyboard.Z),
              player.game.input.keyboard.addKey(Phaser.Keyboard.D),
              player.game.input.keyboard.addKey(Phaser.Keyboard.Q),
              player.game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR), false);
          }
        }
      });


      //TODO: refacto
      if (goal) {

      }
      else {
        groups.balls.forEach(function(ball) {
          if(ball.body.x > 1086 && ball.body.y < 680 && ball.body.y > 496) {
            score.left += 1;
            display.score.left.text = score.left;
            if (goal == false) { console.log("GOAL"); goalSignal.dispatch(this, "left"); }
            goal = true;
          }
          else if (ball.body.x < 118 && ball.body.y < 680 && ball.body.y > 496) {
            score.right += 1;
            display.score.right.text = score.right;
            if (goal == false) { console.log("GOAL"); goalSignal.dispatch(this, "right"); }
            goal = true;
          }
          else {
            groups.bonus.children.forEach(function (bon) {
              if(Phaser.Rectangle.intersects(bon.getBounds(), ball.getBounds())) {
                bon.lastPlayerHit = ball.lastPlayerHit;

                this.displayMessage (this, BONUS[bon.id].message + " " + bon.duration + " sec", CONFIG.BONUS.MESSAGE_DURATION, function() {});

                BONUS[bon.id].trigger(bon.lastPlayerHit);

                console.log("ADD event restore");
                timedEvent = this.game.time.events.add(bon.duration * Phaser.Timer.SECOND, function () {
                  BONUS[bon.id].restore(bon.lastPlayerHit);
                  //this.game.time.events.remove(timedEvent);
                }.bind(this));

                bon.destroy();
              }
            }.bind(this));
          }
        }.bind(this));
      }


    },



    render: function () {
    /* post-processing style effects  */

    },





    displayMessage: function (context, message, duration, callback) {
      display.message.text = message;

      console.log("ADD event clear text");
      timedEvent = context.game.time.events.add(duration * Phaser.Timer.SECOND, function () {
        display.message.text = "";
        context.game.time.events.remove(timedEvent);
        callback();
      });
    },


    createBonus: function () {
      var randomX = this.game.rnd.integerInRange(CONFIG.BONUS.BOUNDARY.minX/25, CONFIG.BONUS.BOUNDARY.maxX/25) * 25;
      var randomY = this.game.rnd.integerInRange(CONFIG.BONUS.BOUNDARY.minY/25, CONFIG.BONUS.BOUNDARY.maxY/25) * 25;
      var id = this.game.rnd.integerInRange(1, 18);
      var bon = groups.bonus.create(randomX, randomY, BONUS[id].name);
      bon.id = id;
      bon.duration = this.game.rnd.integerInRange(5, 20);
    },

    resetAndFreezeGame: function () {
      //TODO
      console.log("removeAll");
      this.game.time.events.removeAll();

      groups.balls.forEach(function (ball) {
        ball.body.static = true;
        ball.reset(ball.positionX, ball.positionY, false, false);
      });

      groups.bonus.children.forEach(function(bon) {
        bon.destroy();
      });

      groups.players.forEach(function(player) {
        player.body.static = true;
        player.reset(player.positionX, player.positionY, false, false);
      });
    },

    countDown: function (context, count, callback) {
      this.displayMessage (context, "3", 1, function () {
        this.displayMessage (context, "2", 1, function () {
          this.displayMessage (context, "1", 1, function () {
            callback();
          });
        }.bind(this));
      }.bind(this));

/*
      display.message.text = count--;

      console.log("ADD event 3");
      timedEvent = this.game.time.events.add(Phaser.Timer.SECOND, function () {
        this.game.time.events.remove(timedEvent);
        display.message.text = count--;

        console.log("ADD event 2");
        timedEvent = this.game.time.events.add(Phaser.Timer.SECOND, function () {
          this.game.time.events.remove(timedEvent);
          display.message.text = count--;

          console.log("ADD event 1");
          timedEvent = this.game.time.events.add(Phaser.Timer.SECOND, function () {
            this.game.time.events.remove(timedEvent);
            display.message.text = "";
            callback();
          }, this);
        }, this);
      }, this);
*/
      /*
      timedEvent = this.game.time.events.loop(Phaser.Timer.SECOND, function () {
        if(count == 0) {
          this.game.time.events.remove(timedEvent);
          callback();
        }
        else {
          display.message.text = count--;
        }
      }, this);
      */
    },

    releaseGame: function () {


      //display.message.text = "";

      /* Balles et joueurs immobiles 3s */
      groups.balls.forEach(function (ball) {
        ball.body.velocity.x = ball.game.rnd.integerInRange(-25, 25) * 10;
        ball.body.damping = 0.2;
        ball.body.mass = 0.2;
        ball.body.static = false;
      });

      groups.players.forEach(function(player) {
        player.body.static = false;
        player.body.damping = 0.5;
        player.body.mass = 6;
      });
    },

    createReccursiveTimedBonus: function () {
      var newTimer = timer.add(Phaser.Timer.SECOND * this.game.rnd.integerInRange(2, 5), function () {
        this.createBonus();
        //timer.remove(newTimer);
        //console.log(timer);
        this.createReccursiveTimedBonus ();
      }, this);
    },


    createPlayer: function (x, y, spritesheet, rightSide) {
      var player = groups.players.create(x, y, spritesheet, 0, false);
      player.positionX = x; player.positionY = y;
      player.rightSide = rightSide;
      player.frame = rightSide?1:0;

      player.JUMP_HEIGHT = CONFIG.PLAYER.JUMP_HEIGHT;
      player.SPEED_FORWARD = CONFIG.PLAYER.SPEED_FORWARD;
      player.SPEED_BACKWARD = CONFIG.PLAYER.SPEED_BACKWARD;

      player.body.clearShapes();
      var tete = new p2.Circle({radius: 1.3});
      var corps = new p2.Circle({radius: 1.4});

      /* addShape(objet, x, y, rotation); */
      player.body.addShape(tete, 0, -15, 0);
      player.body.addShape(corps, 0, 0, 0);

      player.body.setMaterial(playerMaterial);
      player.body.collideWorldBounds = true;
      player.exists = true;
      player.body.fixedRotation = true;

      // Amortissement
      player.body.damping = 0.5;
      player.body.mass = 6;

      player.body.setCollisionGroup(playersCollisionGroup);
      player.body.collides([stageCollisionGroup, playersCollisionGroup]);
      player.body.collides(ballsCollisionGroup, this.hitBall, this);

      if (rightSide) {
        player.foot = this.createFoot(x, y, 'footR', rightSide);
        player.foot.constraint = player.foot.game.physics.p2.createRevoluteConstraint(player, [ -5, -18 ], player.foot, [ -14, -45 ]);
        player.foot.constraint.lowerLimit = Phaser.Math.degToRad(0);
        player.foot.constraint.upperLimit = Phaser.Math.degToRad(90);
      }
      else {
        player.foot = this.createFoot(x, y, 'footL', rightSide);
        player.foot.constraint = player.foot.game.physics.p2.createRevoluteConstraint(player, [ 5, -18 ], player.foot, [ 14, -45 ]);
        player.foot.constraint.lowerLimit = Phaser.Math.degToRad(-90);
        player.foot.constraint.upperLimit = Phaser.Math.degToRad(0);
      }
      player.foot.constraint.lowerLimitEnabled = true;
      player.foot.constraint.upperLimitEnabled = true;
      player.foot.constraint.enableMotor();
      getFootBack(player);

      if(debug.player) { player.body.debug = true; }
      if(debug.feet) { player.foot.body.debug = true; }

      return player;
    },

    createFoot: function (x, y, spritesheet, rightSide) {
      var foot = groups.feet.create(x, y, spritesheet);
      foot.body.clearShapes();
      foot.exists = true;

      if (rightSide) {
        foot.body.addPolygon(null, [ [8, -10], [25, -10], [25, 12], [0, 12] ]);
      }
      else {
        foot.body.addPolygon(null, [ [17, -10], [0, -10], [0, 12], [25, 12] ]);
      }

      foot.body.setCollisionGroup(feetCollisionGroup);
      foot.body.collides(ballsCollisionGroup, this.hitBall, this);
      foot.body.setMaterial(feetMaterial);
      foot.body.mass = 1;

      return foot;
    },


    hitBall: function (playerBody, ballBody) {
      var ball = ballBody.sprite;
      var player = playerBody.sprite;
      ball.lastPlayerHit = player;
    }



  };


  return GameState;
});







function fireShoot (player) {
  if(player.rightSide)  { player.foot.constraint.setMotorSpeed(-15);  }
  else                { player.foot.constraint.setMotorSpeed(15);   }
}

function getFootBack (player) {
  if(player.rightSide)  { player.foot.constraint.setMotorSpeed(7);  }
  else                { player.foot.constraint.setMotorSpeed(-7); }
}


function setKeys (player, up, front, back, shoot, anim) {
  if (front.isDown) {
    player.body.velocity.x = player.SPEED_FORWARD * (player.rightSide?-1:1);
    if (anim) { player.animations.play('right'); }
  }
  else if (back.isDown) {
      player.body.velocity.x = player.SPEED_BACKWARD * (player.rightSide?1:-1);
      if (anim) { player.animations.play('left'); }
  }
  else {
    player.body.velocity.x = 0;

    if (anim) {
      player.animations.stop();
      player.frame = 4;
    }
  }
  if (up.isDown && player.position.y > 660) {
      player.body.velocity.y = player.JUMP_HEIGHT;
  }
  if (shoot.isDown) {
    fireShoot(player);
  }
  else {
    getFootBack(player);
  }
}
