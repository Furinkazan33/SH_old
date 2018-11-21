///<reference path="sprite.ts"/>

module cetelemheads.sprites {
  export class Goal extends Sprite {
    constructor(game: Phaser.Game, $attributes) {
      super(game, $attributes, 'goal');

      var gameState = <cetelemheadsClient.states.GameState>game.state.getCurrentState();

      var topBar = gameState.groups.stages.create($attributes.position.x + ($attributes.team == 'right'? 0 : 61), $attributes.position.y+5);
      topBar.body.setRectangle(120, 10);
      topBar.body.angle = ($attributes.team == 'right'? -2 : 2);
      topBar.body.static = true;

      var backBar = gameState.groups.stages.create($attributes.position.x + ($attributes.team == 'right'? 50 : 15), $attributes.position.y+100);
      backBar.body.setRectangle(10, 200);
      backBar.body.angle = ($attributes.team == 'right'? 175: -175);
      backBar.body.static = true;

      var goalArea = gameState.groups.areas.create($attributes.position.x + ($attributes.team == 'right'? 12 : 52), $attributes.position.y+100);
      var goalAreaShape = goalArea.body.setRectangle(80, 180);
      goalAreaShape.sensor = true;

      goalArea.body.setCollisionGroup(gameState.collisionGroups.areas);
      goalArea.body.collides([gameState.collisionGroups.balls]);
    }
  }
}
