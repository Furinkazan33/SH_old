/// <reference path="../dependencies/phaser.d.ts"/>
/// <reference path="guifactory.ts"/>

module phasergui {
  export class PhaserGui {

    add: phasergui.GuiFactory;

    constructor(game: Phaser.Game) {
      this.add = new phasergui.GuiFactory(game);
    }
  }
}
