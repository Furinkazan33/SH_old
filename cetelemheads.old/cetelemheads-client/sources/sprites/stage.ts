///<reference path="sprite.ts"/>

module cetelemheads.sprites {
  export class Stage extends Sprite {
    constructor(game: Phaser.Game, $attributes) {
      super(game, $attributes);

      this.scale.setTo(3, 2);
      //this.body.addShape(new p2.Box({ width: 60, height: 3 }), 0, 0, 0);
    }
  }
}
