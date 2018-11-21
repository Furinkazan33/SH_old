///<reference path="sprite.ts"/>

module cetelemheads.sprites {
  export class Ball extends Sprite {
    public constructor(game: Phaser.Game, $attributes) {
      super(game, $attributes);

      var gameState = <cetelemheadsClient.states.GameState>game.state.getCurrentState();

      this.body.setCircle(this.$attributes.radius, 0, 0, 0);
      this.body.mass = 0.2;
      this.body.damping = 0.2;
      this.body.setMaterial(gameState.materials.balls);
      this.body.setCollisionGroup(gameState.collisionGroups.balls);
      this.body.collides([
        gameState.collisionGroups.balls,
        gameState.collisionGroups.stages,
        gameState.collisionGroups.players,
        gameState.collisionGroups.feets,
        gameState.collisionGroups.areas
      ]);
    }

    public getTransientAttributes() {
      return ['lastPlayerHit', 'hasScored'];
    }
  }
}
