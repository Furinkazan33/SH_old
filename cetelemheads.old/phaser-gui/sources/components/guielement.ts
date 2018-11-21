module phasergui.components {
  export abstract class GuiElement extends Phaser.Sprite {

    theme: phasergui.Theme = new phasergui.Theme();

    protected redraw: boolean = true;
    protected _enabled: boolean = true;

    protected _hover: boolean = false;
    protected _down: boolean = false;
    protected _focus: boolean = false;

    protected onFocus: Phaser.Signal = new Phaser.Signal();
    protected onBlur: Phaser.Signal = new Phaser.Signal();

    constructor(game: Phaser.Game) {
      super(game, 0, 0, new Phaser.BitmapData(game, '', 0, 0));

      this.inputEnabled = true;
      this.events.onInputDown.add(this.onInputDownHandler, this);
      this.events.onInputUp.add(this.onInputUpHandler, this);
      this.events.onInputOver.add(this.onInputOverHandler, this);
      this.events.onInputOut.add(this.onInputOutHandler, this);
    }

    public update(): void {
      if (this.redraw) {
        this.draw();
        this.redraw = false;
      }
    }

    public setEnabled(enabled: boolean): void {
      this._enabled = enabled;
    }

    public isEnabled(): boolean {
      return this._enabled;
    }

    public focus(): void {
      this.setFocus(true);
    }

    public blur(): void {
      this.setFocus(false);
    }

    public setFocus(focus: boolean): void {
      if (focus == this._focus) {
        return;
      }

      if (focus) {
        this.onFocus.dispatch(this);
      }
      else {
        this.onBlur.dispatch(this);
      }

      this._focus = focus;
    }

    public hasFocus(): boolean {
      return this._focus;
    }

    public draw(): void {
      var bitmapData = <Phaser.BitmapData>this.key;
      bitmapData.cls();
      this.drawElement(bitmapData);

      if (!this._enabled) {
	      bitmapData.ctx.globalCompositeOperation = "source-atop";
        bitmapData.ctx.fillStyle='rgba(192, 192, 192, 0.5)';
        bitmapData.ctx.fillRect(0, 0, this.width, this.height);
      }
    }

    protected onInputDownHandler(sprite, pointer): boolean {
      this.focus();

      this._down = true;
      this.redraw = true;
      return true;
    }

    protected onInputUpHandler(sprite, pointer): boolean {
      this._down = false;
      this.redraw = true;
      return true;
    }

    protected onInputOverHandler(sprite, pointer): boolean {
      this._hover = true;
      this.redraw = true;
      return true;
    }

    protected onInputOutHandler(sprite, pointer): boolean {
      this._hover = false;
      this.redraw = true;
      return true;
    }

    protected abstract drawElement(bitmapData: Phaser.BitmapData): void;
  }
}
