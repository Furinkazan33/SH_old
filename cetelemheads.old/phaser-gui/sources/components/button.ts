/// <reference path="guielement.ts"/>

module phasergui.components {
  export class Button extends GuiElement {

    protected onClick: Phaser.Signal;
    private text: string;

    public constructor(game: Phaser.Game, text: string) {
      super(game);

      this.setText(text);
      this.onClick = new Phaser.Signal();
    }

    public setText(text: string): void {
      this.text = text;
      this.width = this.text.length * 24; // TODO 12 is a test value (should be font width)
      this.height = 120;
    }

    public getText(): string {
      return this.text;
    }

     public drawElement(bitmapData: Phaser.BitmapData): void {
       var radius = this.height / 10;

       // Background
       bitmapData.ctx.beginPath();
       bitmapData.ctx.arc(radius, radius, radius, 1*Math.PI, 1.5*Math.PI, false);
       bitmapData.ctx.arc(this.width-radius, radius, radius, 1.5*Math.PI, 2*Math.PI, false);
       bitmapData.ctx.arc(this.width-radius, this.height-radius, radius, 2*Math.PI, 0.5*Math.PI, false);
       bitmapData.ctx.arc(radius, this.height-radius, radius, 0.5*Math.PI, 1*Math.PI, false);
       bitmapData.ctx.closePath();

      // Background
      switch (true) {
        case this._down:
          bitmapData.ctx.fillStyle = this.theme.buttonBackgroundDownColor;
          bitmapData.ctx.strokeStyle = this.theme.buttonBorderDownColor;
        break;

        case this._hover:
          bitmapData.ctx.fillStyle = this.theme.buttonBackgroundHoverColor;
          bitmapData.ctx.strokeStyle = this.theme.buttonBorderHoverColor;
        break;

        default:
          bitmapData.ctx.fillStyle = this.theme.buttonBackgroundColor;
          bitmapData.ctx.strokeStyle = this.theme.buttonBorderColor;
      }
      bitmapData.ctx.fill();

      // Text
      if (this.text != null) {
        bitmapData.ctx.fillStyle = "black";
        bitmapData.ctx.textAlign = 'center';
        bitmapData.ctx.strokeStyle = '#000';
        bitmapData.ctx.font = '20pt Calibri';
        bitmapData.ctx.textBaseline = 'center';
        bitmapData.ctx.fillText(this.text, (this.width / 2), (this.height / 2 + 10));
      }
    }

    protected onInputUpHandler(sprite, pointer): void {
      super.onInputUpHandler(sprite, pointer);
      this.onClick.dispatch(pointer, this);
    }
  }
}
