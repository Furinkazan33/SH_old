/// <reference path="button.ts"/>

module phasergui.components {
  export class CheckBox extends Button {

    private value: string;
    private _checked: boolean;

    private onChange: Phaser.Signal = new Phaser.Signal();

    public constructor(game: Phaser.Game, value: string) {
      super(game, null);
      this.value = value;

      this.onClick.add(this.onClickHandler, this);
      this.onChange.add(this.onChangeHandler, this);
    }

    public setChecked(checked: boolean, triggerOnChange: boolean = true): void {
      if (this._checked == checked) {
        return;
      }

      this._checked = checked;

      if (triggerOnChange) {
        this.onChange.dispatch(this._checked, this);
      }
    }

    public isChecked(): boolean {
      return this._checked;
    }

    public drawElement(bitmapData: Phaser.BitmapData): void {
      super.drawElement(bitmapData);

      if (this._checked) {
        var radius = this.width / 5;
        bitmapData.ctx.save();
        bitmapData.ctx.rotate(Math.PI/4);
        bitmapData.ctx.fillStyle = this.theme.checkboxMarkColor;
        bitmapData.ctx.fillRect(radius*2, radius*-0.5, this.width - (radius*2), this.height - (radius*4));
        bitmapData.ctx.restore();

        bitmapData.ctx.save();
        bitmapData.ctx.rotate(Math.PI/-4);
        bitmapData.ctx.fillStyle = this.theme.checkboxMarkColor;
        bitmapData.ctx.fillRect(radius*-1.5, radius*3.0, this.width - (radius*2), this.height - (radius*4));
        bitmapData.ctx.restore();
      }
    }

    private onClickHandler(): void {
      this.setChecked(!this._checked);
    }

    private onChangeHandler(): void {
      this.redraw = true;
    }
  }
}
