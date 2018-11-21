///<reference path="sprite.ts"/>

module cetelemheads.sprites {
  export class Pitch extends Sprite {
    constructor(game: Phaser.Game, $attributes) {
      super(game, $attributes);

      var gameState = <cetelemheadsClient.states.GameState>game.state.getCurrentState();

      this.body.clearShapes();
      for (let index = 0; index < $attributes.definition.length; index++) {
        var definition = $attributes.definition[index];

        var color = Phaser.Color.createColor(definition.color.red, definition.color.green, definition.color.blue, 0, 0, 0, 0, 0);
        var graphics = this.game.add.graphics(0, 0);
        graphics.lineStyle(5, color.color, 0.5);
        graphics.beginFill(color.color);

        if (definition.type == "polygon") {
          graphics.moveTo(definition.points[0][0], definition.points[0][1]);
          for (var j = 1; j < definition.points.length; j++) {
            graphics.lineTo(definition.points[j][0], definition.points[j][1]);
          }

          this.body.addPolygon(null, definition.points);
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

          var convex = new p2.Convex(vertices, []);
          this.body.addShape(convex, 0, 0, 0);
        }
        else if (definition.type == "circle") {
          graphics.moveTo(0, 0);
          graphics.drawCircle(definition.x, definition.y, 40*definition.diameter);

          var circle = new p2.Circle(definition.diameter);
          this.body.addShape(circle, definition.x-600, definition.y-122, 0);
        }
        graphics.endFill();

        gameState.groups.pitchs.add(graphics);
      }
    }
  }
}
