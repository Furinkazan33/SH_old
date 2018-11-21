///<reference path="sprite.ts"/>

module cetelemheads.sprites {
  export class Player extends Sprite {

    foot: cetelemheads.sprites.PlayerFoot;

    constructor(game: Phaser.Game, $attributes) {
      super(game, $attributes);

      var gameState = <cetelemheadsClient.states.GameState>game.state.getCurrentState();

      if (this.$attributes.team == 'right') {
        this.anchor.setTo(0.5, 0.5);
        this.scale.x = -1;
      }

      this.body.clearShapes();
      this.body.addShape(new p2.Circle(1.3), 2, -7, 0); // Head
      this.body.addShape(new p2.Circle(1.4), 0, 0, 0); // Body

      // Foot
      this.foot = new cetelemheads.sprites.PlayerFoot(game, this.$attributes.position.x, this.$attributes.position.y, this);

      this.body.collideWorldBounds = true;
      this.body.fixedRotation = true;
      this.body.damping = 0.5; // Amortissement
      this.body.mass = 6;

      this.body.setMaterial(gameState.materials.players);
      this.body.setCollisionGroup(gameState.collisionGroups.players);
      this.body.collides([gameState.collisionGroups.stages, gameState.collisionGroups.players]);
      this.body.collides(gameState.collisionGroups.balls, function(playerBody, ballBody) {
        this.hitBall(playerBody.sprite, ballBody.sprite);
      }, this);

      this.$attributes.isShooting = false;
    }
  }

  export class PlayerFoot extends Phaser.Sprite {

    constraint: p2.RevoluteConstraint;

    constructor(game: Phaser.Game, x: number, y: number, player: cetelemheads.sprites.Player, debug: boolean = false) {
      super(game, x, y, 'foot', 0);

      this.exists = true;

      this.body.mass = 1;
      this.body.clearShapes();
      if (player.$attributes.team == 'right') {
        this.anchor.setTo(0.5, 0.5);
        this.scale.x = -1;

        this.body.addPolygon(null, [ [8, -10], [25, -10], [25, 12], [0, 12] ]);
        this.constraint = this.game.physics.p2.createRevoluteConstraint(player, [0, -10], this, [-14, -45]);
        this.constraint.lowerLimit = Phaser.Math.degToRad(0);
        this.constraint.upperLimit = Phaser.Math.degToRad(90);
      }
      else {
        this.body.addPolygon(null, [ [17, -10], [0, -10], [0, 12], [25, 12] ]);
        this.constraint = this.game.physics.p2.createRevoluteConstraint(player, [-2, -10], this, [14, -45]);
        this.constraint.lowerLimit = Phaser.Math.degToRad(-90);
        this.constraint.upperLimit = Phaser.Math.degToRad(0);
      }

      this.constraint.lowerLimitEnabled = true;
      this.constraint.upperLimitEnabled = true;
      this.constraint.enableMotor();

      var multiplicator = (player.$attributes.team == 'right' ? -1:1);
      this.constraint.setMotorSpeed((player.$attributes.speeds.shoot*multiplicator/2)*-1);
    }
  }
}
