module cetelemheads.sprites {
  export class Sprite extends Phaser.Sprite {

    public $attributes;
    public $defaultAttributes;

    constructor(game: Phaser.Game, $attributes, sprite: string = '') {
      super(game, $attributes.position.x, $attributes.position.y, sprite);
      this.$attributes = $attributes;
      this.$defaultAttributes = cetelemheads.utils.ObjectUtils.clone(this.$attributes, this.getTransientAttributes());

      this.debug = $attributes.debug;
    }

    public getTransientAttributes(): Array<string> {
      return [];
    }
  }
}
