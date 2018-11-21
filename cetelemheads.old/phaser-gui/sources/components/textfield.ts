/// <reference path="guielement.ts"/>

module phasergui.components {
  export class TextField extends GuiElement {

    inputElement: HTMLInputElement;

    value: string = "";

    onChange: Phaser.Signal = new Phaser.Signal();

    timerId: number;
    showBar: boolean = false;

    constructor(game: Phaser.Game, value: string) {
      super(game);

      this.createHtmlTextInput();
      this.onFocus.add(this.onFocusHandler, this);
      this.onBlur.add(this.onBlurHandler, this);
      this.onChange.add(this.onChangeHandler, this);
    }

    setValue(value: string): void {
      this.value = value;
      this.onChange.dispatch(this);
    }

    getValue(): string {
      return this.value;
    }

    public drawElement(bitmapData: Phaser.BitmapData): void {

      // Background
      bitmapData.ctx.fillStyle = '#eee';
      bitmapData.ctx.fillRect(0, 0, this.width, this.height);

      // Frame
      bitmapData.ctx.strokeRect(0, 0, this.width, this.height);

      // Text
      var fontSize = this.height / 2;
      bitmapData.ctx.fillStyle = "black";
      bitmapData.ctx.font = fontSize+'px Arial';
      bitmapData.ctx.textBaseline = 'center';
      bitmapData.ctx.fillText(this.value, 25, this.height / 1.5);

      // Carret
      if (this.showBar) {
        bitmapData.ctx.strokeStyle = '#000';
        bitmapData.ctx.strokeRect(25+(this.value.length*6), 12, 1, this.height - 24);
      }
    }

    protected onFocusHandler(): void {
      window.setTimeout(() => {
    		this.inputElement.focus();
      }, 0);

      var currentTime: number = Date.now();
      var internalTimer: number = 0;
      this.timerId = window.setInterval(() => {
        internalTimer += (Date.now() - currentTime);
        currentTime = Date.now();

        if (internalTimer > 500) {
          internalTimer = 0;
          this.showBar = !this.showBar;
        }

        this.setValue(this.inputElement.value);
      }, 0);
      this.redraw = true;
    }

    protected onBlurHandler(): void {
      window.clearInterval(this.timerId);
      this.showBar = false;
      this.redraw = true;
    }

    protected onChangeHandler(): void {
      this.redraw = true;
    }

    private createHtmlTextInput(): void {
      var self = this;

      this.inputElement = document.createElement("input");
      this.inputElement.type = "text";
      this.inputElement.style.opacity = "0";
      this.inputElement.style.left = '0px';
      this.inputElement.style.top = '0px';
      this.inputElement.style.width = '1px';
      this.inputElement.style.height = '1px';

      document.body.appendChild(this.inputElement);
    }
  }
}
