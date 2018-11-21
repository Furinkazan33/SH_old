/// <reference path="button.ts"/>

module phasergui.components {
  export class RadioButton extends Button {

    private group: string;
    private _selected: boolean = false;

    onChange: Phaser.Signal = new Phaser.Signal();

    constructor(game: Phaser.Game, group: string) {
      super(game, null);
      this.group = group;

      this.onClick.add(this.onClickHandler, this);
      this.onChange.add(this.onChangeHandler, this);
    }

    setSelected(selected: boolean, triggerOnChange: boolean = true): void {
      if (this._selected == selected) {
        return;
      }

      this._selected = selected;

      if (triggerOnChange) {
        this.onChange.dispatch(this._selected, this);
      }
    }

    public isSelected(): boolean {
      return this._selected;
    }

    public drawElement(bitmapData: Phaser.BitmapData): void {
      super.drawElement(bitmapData);

      if (this._selected) {
        var radius = this.height / 2;
        bitmapData.ctx.beginPath();
        bitmapData.ctx.arc(radius, radius, radius/2, 0, 2 * Math.PI, true);
        bitmapData.ctx.closePath();

        bitmapData.ctx.fillStyle = this.theme.radioMarkColor;
        bitmapData.ctx.fill();
      }
    }

    private onClickHandler(): void {
      this.setSelected(true);
    }

    private onChangeHandler(): void {
      this.redraw = true;
    }
  }
}
