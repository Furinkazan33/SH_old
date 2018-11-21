// Type definition for phasergui
declare module phasergui {
  export class PhaserGui {
    add: GuiFactory;
    constructor(game: Phaser.Game);
  }

  export class GuiFactory {
    button();
  }
}
