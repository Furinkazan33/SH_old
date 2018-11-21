/// <reference path="guielement.ts"/>

module phasergui.components {
  export class Table extends GuiElement {

    private rows: number;
    private columns: number;
    private guiElements: GuiElement[][];

    public constructor(game: Phaser.Game, width: number, height: number, rows: number, columns: number) {
      super(game);
      this.height = height;
      this.width = width;
      this.rows = rows;
      this.columns = columns;
      this.guiElements = [];

      for (let y = 0; y < this.rows; y++) {
        this.guiElements[y] = [];
        for (let x = 0; x < this.columns; x++) {
          this.guiElements[y][x] = null;
        }
      }
    }

    public addElement(guiElement: GuiElement, row: number, column: number): void {
      super.addChild(guiElement);
      this.guiElements[row][column] = guiElement;

      var rowHeight = this.height/this.rows;
      var columnWidth = this.width/this.columns;

      guiElement.y = (this.y + row*rowHeight);
      guiElement.x = (this.x + column*columnWidth);
      guiElement.height = rowHeight;
      guiElement.width = columnWidth;

      this.redraw = true;
    }

    protected drawElement(bitmapData: Phaser.BitmapData): void {
      for (let y = 0; y < this.rows; y++) {
        for (let x = 0; x < this.columns; x++) {
          var guiElement: GuiElement = this.guiElements[y][x];
          if (guiElement != null) {
            guiElement.draw();
          }
        }
      }
    }
  }
}
