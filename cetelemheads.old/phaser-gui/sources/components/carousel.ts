/// <reference path="table.ts"/>

module phasergui.components {
  export class Carousel extends Table {
    public constructor(game: Phaser.Game, width: number, height: number, sprites: Array<string>) {
      super(game, width, height, 1, 3);

      var previousButton: phasergui.components.Button = new phasergui.components.Button(game, "Prev");
      this.addElement(previousButton, 0, 0);

      var nextButton: phasergui.components.Button = new phasergui.components.Button(game, "Next");
      this.addElement(nextButton, 0, 2);
    }
  }
}
