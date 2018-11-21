module phasergui {
  export class GuiFactory {
    game: Phaser.Game;

    guiElements: Array<phasergui.components.GuiElement> = []
    radioButtonGroups: {} = {};

    constructor(game: Phaser.Game) {
      this.game = game;
    }

    public table(width: number, height: number, rows: number, columns: number): phasergui.components.Table {
      var table: phasergui.components.Table = new phasergui.components.Table(this.game, width, height, rows, columns);
      this.addTo(table);
      return table;
    }

    public button(text: string, x: number = 0, y: number = 0): phasergui.components.Button {
      var button: phasergui.components.Button = new phasergui.components.Button(this.game, text);
      button.x = x;
      button.y = y;

      this.addTo(button);
      return button;
    }

    public radioButton(group: string) {
      var radio: phasergui.components.RadioButton = new phasergui.components.RadioButton(this.game, group);

      var radioButtons = this.radioButtonGroups[group];
      if (radioButtons == null) {
        radioButtons = [];
        this.radioButtonGroups[group] = radioButtons;
      }
      radioButtons.push(radio);

      radio.onChange.add(function(value) {
        if (value) {
          for (var index = 0; index < radioButtons.length; index++) {
            var radioButton = radioButtons[index];
            if (radioButton != radio && radioButton.isSelected()) {
              radioButton.setSelected(false);
              break;
            }
          }
        }
      });

      this.addTo(radio);
      return radio;
    }

    public textfield(value: string = "") {
      var input: phasergui.components.TextField = new phasergui.components.TextField(this.game, value);
      this.addTo(input);
      return input;
    }

    public checkbox(x: number, y: number, value: string) {
      var checkbox: phasergui.components.CheckBox = new phasergui.components.CheckBox(this.game, value);
      this.addTo(checkbox);
      return checkbox;
    }

    public carousel(width: number, height: number, sprites: Array<string>) {
      var carousel: phasergui.components.Carousel = new phasergui.components.Carousel(this.game, width, height, sprites);
      this.addTo(carousel);
      return carousel;
    }

    private addTo(object, container?): void {
      if (container == null) {
        this.game.world.add(object);
      } else {
        container.addChild(object);
      }

      this.guiElements.push(object);

      var self = this;
      object.onFocus.add(function() {
        for (var index = 0; index < self.guiElements.length; index++) {
          var guiElement = self.guiElements[index];
          if (!guiElement.hasFocus()) {
            continue;
          }

          if (guiElement == object) {
            continue;
          }

          guiElement.blur();
        }
      });
    }
  }
}
