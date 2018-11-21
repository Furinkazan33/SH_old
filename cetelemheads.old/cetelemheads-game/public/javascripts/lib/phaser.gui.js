var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var phasergui;
(function (phasergui) {
    var components;
    (function (components) {
        var GuiElement = (function (_super) {
            __extends(GuiElement, _super);
            function GuiElement(game) {
                _super.call(this, game, 0, 0, new Phaser.BitmapData(game, '', 0, 0));
                this.theme = new phasergui.Theme();
                this.redraw = true;
                this._enabled = true;
                this._hover = false;
                this._down = false;
                this._focus = false;
                this.onFocus = new Phaser.Signal();
                this.onBlur = new Phaser.Signal();
                this.inputEnabled = true;
                this.events.onInputDown.add(this.onInputDownHandler, this);
                this.events.onInputUp.add(this.onInputUpHandler, this);
                this.events.onInputOver.add(this.onInputOverHandler, this);
                this.events.onInputOut.add(this.onInputOutHandler, this);
            }
            GuiElement.prototype.update = function () {
                if (this.redraw) {
                    this.draw();
                    this.redraw = false;
                }
            };
            GuiElement.prototype.setEnabled = function (enabled) {
                this._enabled = enabled;
            };
            GuiElement.prototype.isEnabled = function () {
                return this._enabled;
            };
            GuiElement.prototype.focus = function () {
                this.setFocus(true);
            };
            GuiElement.prototype.blur = function () {
                this.setFocus(false);
            };
            GuiElement.prototype.setFocus = function (focus) {
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
            };
            GuiElement.prototype.hasFocus = function () {
                return this._focus;
            };
            GuiElement.prototype.draw = function () {
                var bitmapData = this.key;
                bitmapData.cls();
                this.drawElement(bitmapData);
                if (!this._enabled) {
                    bitmapData.ctx.globalCompositeOperation = "source-atop";
                    bitmapData.ctx.fillStyle = 'rgba(192, 192, 192, 0.5)';
                    bitmapData.ctx.fillRect(0, 0, this.width, this.height);
                }
            };
            GuiElement.prototype.onInputDownHandler = function (sprite, pointer) {
                this.focus();
                this._down = true;
                this.redraw = true;
                return true;
            };
            GuiElement.prototype.onInputUpHandler = function (sprite, pointer) {
                this._down = false;
                this.redraw = true;
                return true;
            };
            GuiElement.prototype.onInputOverHandler = function (sprite, pointer) {
                this._hover = true;
                this.redraw = true;
                return true;
            };
            GuiElement.prototype.onInputOutHandler = function (sprite, pointer) {
                this._hover = false;
                this.redraw = true;
                return true;
            };
            return GuiElement;
        }(Phaser.Sprite));
        components.GuiElement = GuiElement;
    })(components = phasergui.components || (phasergui.components = {}));
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var components;
    (function (components) {
        var Button = (function (_super) {
            __extends(Button, _super);
            function Button(game, text) {
                _super.call(this, game);
                this.setText(text);
                this.onClick = new Phaser.Signal();
            }
            Button.prototype.setText = function (text) {
                this.text = text;
                this.width = this.text.length * 24;
                this.height = 120;
            };
            Button.prototype.getText = function () {
                return this.text;
            };
            Button.prototype.drawElement = function (bitmapData) {
                var radius = this.height / 10;
                bitmapData.ctx.beginPath();
                bitmapData.ctx.arc(radius, radius, radius, 1 * Math.PI, 1.5 * Math.PI, false);
                bitmapData.ctx.arc(this.width - radius, radius, radius, 1.5 * Math.PI, 2 * Math.PI, false);
                bitmapData.ctx.arc(this.width - radius, this.height - radius, radius, 2 * Math.PI, 0.5 * Math.PI, false);
                bitmapData.ctx.arc(radius, this.height - radius, radius, 0.5 * Math.PI, 1 * Math.PI, false);
                bitmapData.ctx.closePath();
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
                if (this.text != null) {
                    bitmapData.ctx.fillStyle = "black";
                    bitmapData.ctx.textAlign = 'center';
                    bitmapData.ctx.strokeStyle = '#000';
                    bitmapData.ctx.font = '20pt Calibri';
                    bitmapData.ctx.textBaseline = 'center';
                    bitmapData.ctx.fillText(this.text, (this.width / 2), (this.height / 2 + 10));
                }
            };
            Button.prototype.onInputUpHandler = function (sprite, pointer) {
                _super.prototype.onInputUpHandler.call(this, sprite, pointer);
                this.onClick.dispatch(pointer, this);
            };
            return Button;
        }(components.GuiElement));
        components.Button = Button;
    })(components = phasergui.components || (phasergui.components = {}));
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var components;
    (function (components) {
        var Table = (function (_super) {
            __extends(Table, _super);
            function Table(game, width, height, rows, columns) {
                _super.call(this, game);
                this.height = height;
                this.width = width;
                this.rows = rows;
                this.columns = columns;
                this.guiElements = [];
                for (var y = 0; y < this.rows; y++) {
                    this.guiElements[y] = [];
                    for (var x = 0; x < this.columns; x++) {
                        this.guiElements[y][x] = null;
                    }
                }
            }
            Table.prototype.addElement = function (guiElement, row, column) {
                _super.prototype.addChild.call(this, guiElement);
                this.guiElements[row][column] = guiElement;
                var rowHeight = this.height / this.rows;
                var columnWidth = this.width / this.columns;
                guiElement.y = (this.y + row * rowHeight);
                guiElement.x = (this.x + column * columnWidth);
                guiElement.height = rowHeight;
                guiElement.width = columnWidth;
                this.redraw = true;
            };
            Table.prototype.drawElement = function (bitmapData) {
                for (var y = 0; y < this.rows; y++) {
                    for (var x = 0; x < this.columns; x++) {
                        var guiElement = this.guiElements[y][x];
                        if (guiElement != null) {
                            guiElement.draw();
                        }
                    }
                }
            };
            return Table;
        }(components.GuiElement));
        components.Table = Table;
    })(components = phasergui.components || (phasergui.components = {}));
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var components;
    (function (components) {
        var Carousel = (function (_super) {
            __extends(Carousel, _super);
            function Carousel(game, width, height, sprites) {
                _super.call(this, game, width, height, 1, 3);
                var previousButton = new phasergui.components.Button(game, "Prev");
                this.addElement(previousButton, 0, 0);
                var nextButton = new phasergui.components.Button(game, "Next");
                this.addElement(nextButton, 0, 2);
            }
            return Carousel;
        }(components.Table));
        components.Carousel = Carousel;
    })(components = phasergui.components || (phasergui.components = {}));
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var components;
    (function (components) {
        var CheckBox = (function (_super) {
            __extends(CheckBox, _super);
            function CheckBox(game, value) {
                _super.call(this, game, null);
                this.onChange = new Phaser.Signal();
                this.value = value;
                this.onClick.add(this.onClickHandler, this);
                this.onChange.add(this.onChangeHandler, this);
            }
            CheckBox.prototype.setChecked = function (checked, triggerOnChange) {
                if (triggerOnChange === void 0) { triggerOnChange = true; }
                if (this._checked == checked) {
                    return;
                }
                this._checked = checked;
                if (triggerOnChange) {
                    this.onChange.dispatch(this._checked, this);
                }
            };
            CheckBox.prototype.isChecked = function () {
                return this._checked;
            };
            CheckBox.prototype.drawElement = function (bitmapData) {
                _super.prototype.drawElement.call(this, bitmapData);
                if (this._checked) {
                    var radius = this.width / 5;
                    bitmapData.ctx.save();
                    bitmapData.ctx.rotate(Math.PI / 4);
                    bitmapData.ctx.fillStyle = this.theme.checkboxMarkColor;
                    bitmapData.ctx.fillRect(radius * 2, radius * -0.5, this.width - (radius * 2), this.height - (radius * 4));
                    bitmapData.ctx.restore();
                    bitmapData.ctx.save();
                    bitmapData.ctx.rotate(Math.PI / -4);
                    bitmapData.ctx.fillStyle = this.theme.checkboxMarkColor;
                    bitmapData.ctx.fillRect(radius * -1.5, radius * 3.0, this.width - (radius * 2), this.height - (radius * 4));
                    bitmapData.ctx.restore();
                }
            };
            CheckBox.prototype.onClickHandler = function () {
                this.setChecked(!this._checked);
            };
            CheckBox.prototype.onChangeHandler = function () {
                this.redraw = true;
            };
            return CheckBox;
        }(components.Button));
        components.CheckBox = CheckBox;
    })(components = phasergui.components || (phasergui.components = {}));
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var components;
    (function (components) {
        var RadioButton = (function (_super) {
            __extends(RadioButton, _super);
            function RadioButton(game, group) {
                _super.call(this, game, null);
                this._selected = false;
                this.onChange = new Phaser.Signal();
                this.group = group;
                this.onClick.add(this.onClickHandler, this);
                this.onChange.add(this.onChangeHandler, this);
            }
            RadioButton.prototype.setSelected = function (selected, triggerOnChange) {
                if (triggerOnChange === void 0) { triggerOnChange = true; }
                if (this._selected == selected) {
                    return;
                }
                this._selected = selected;
                if (triggerOnChange) {
                    this.onChange.dispatch(this._selected, this);
                }
            };
            RadioButton.prototype.isSelected = function () {
                return this._selected;
            };
            RadioButton.prototype.drawElement = function (bitmapData) {
                _super.prototype.drawElement.call(this, bitmapData);
                if (this._selected) {
                    var radius = this.height / 2;
                    bitmapData.ctx.beginPath();
                    bitmapData.ctx.arc(radius, radius, radius / 2, 0, 2 * Math.PI, true);
                    bitmapData.ctx.closePath();
                    bitmapData.ctx.fillStyle = this.theme.radioMarkColor;
                    bitmapData.ctx.fill();
                }
            };
            RadioButton.prototype.onClickHandler = function () {
                this.setSelected(true);
            };
            RadioButton.prototype.onChangeHandler = function () {
                this.redraw = true;
            };
            return RadioButton;
        }(components.Button));
        components.RadioButton = RadioButton;
    })(components = phasergui.components || (phasergui.components = {}));
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var components;
    (function (components) {
        var TextField = (function (_super) {
            __extends(TextField, _super);
            function TextField(game, value) {
                _super.call(this, game);
                this.value = "";
                this.onChange = new Phaser.Signal();
                this.showBar = false;
                this.createHtmlTextInput();
                this.onFocus.add(this.onFocusHandler, this);
                this.onBlur.add(this.onBlurHandler, this);
                this.onChange.add(this.onChangeHandler, this);
            }
            TextField.prototype.setValue = function (value) {
                this.value = value;
                this.onChange.dispatch(this);
            };
            TextField.prototype.getValue = function () {
                return this.value;
            };
            TextField.prototype.drawElement = function (bitmapData) {
                bitmapData.ctx.fillStyle = '#eee';
                bitmapData.ctx.fillRect(0, 0, this.width, this.height);
                bitmapData.ctx.strokeRect(0, 0, this.width, this.height);
                var fontSize = this.height / 2;
                bitmapData.ctx.fillStyle = "black";
                bitmapData.ctx.font = fontSize + 'px Arial';
                bitmapData.ctx.textBaseline = 'center';
                bitmapData.ctx.fillText(this.value, 25, this.height / 1.5);
                if (this.showBar) {
                    bitmapData.ctx.strokeStyle = '#000';
                    bitmapData.ctx.strokeRect(25 + (this.value.length * 6), 12, 1, this.height - 24);
                }
            };
            TextField.prototype.onFocusHandler = function () {
                var _this = this;
                window.setTimeout(function () {
                    _this.inputElement.focus();
                }, 0);
                var currentTime = Date.now();
                var internalTimer = 0;
                this.timerId = window.setInterval(function () {
                    internalTimer += (Date.now() - currentTime);
                    currentTime = Date.now();
                    if (internalTimer > 500) {
                        internalTimer = 0;
                        _this.showBar = !_this.showBar;
                    }
                    _this.setValue(_this.inputElement.value);
                }, 0);
                this.redraw = true;
            };
            TextField.prototype.onBlurHandler = function () {
                window.clearInterval(this.timerId);
                this.showBar = false;
                this.redraw = true;
            };
            TextField.prototype.onChangeHandler = function () {
                this.redraw = true;
            };
            TextField.prototype.createHtmlTextInput = function () {
                var self = this;
                this.inputElement = document.createElement("input");
                this.inputElement.type = "text";
                this.inputElement.style.opacity = "0";
                this.inputElement.style.left = '0px';
                this.inputElement.style.top = '0px';
                this.inputElement.style.width = '1px';
                this.inputElement.style.height = '1px';
                document.body.appendChild(this.inputElement);
            };
            return TextField;
        }(components.GuiElement));
        components.TextField = TextField;
    })(components = phasergui.components || (phasergui.components = {}));
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var GuiFactory = (function () {
        function GuiFactory(game) {
            this.guiElements = [];
            this.radioButtonGroups = {};
            this.game = game;
        }
        GuiFactory.prototype.table = function (width, height, rows, columns) {
            var table = new phasergui.components.Table(this.game, width, height, rows, columns);
            this.addTo(table);
            return table;
        };
        GuiFactory.prototype.button = function (text, x, y) {
            if (x === void 0) { x = 0; }
            if (y === void 0) { y = 0; }
            var button = new phasergui.components.Button(this.game, text);
            button.x = x;
            button.y = y;
            this.addTo(button);
            return button;
        };
        GuiFactory.prototype.radioButton = function (group) {
            var radio = new phasergui.components.RadioButton(this.game, group);
            var radioButtons = this.radioButtonGroups[group];
            if (radioButtons == null) {
                radioButtons = [];
                this.radioButtonGroups[group] = radioButtons;
            }
            radioButtons.push(radio);
            radio.onChange.add(function (value) {
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
        };
        GuiFactory.prototype.textfield = function (value) {
            if (value === void 0) { value = ""; }
            var input = new phasergui.components.TextField(this.game, value);
            this.addTo(input);
            return input;
        };
        GuiFactory.prototype.checkbox = function (x, y, value) {
            var checkbox = new phasergui.components.CheckBox(this.game, value);
            this.addTo(checkbox);
            return checkbox;
        };
        GuiFactory.prototype.carousel = function (width, height, sprites) {
            var carousel = new phasergui.components.Carousel(this.game, width, height, sprites);
            this.addTo(carousel);
            return carousel;
        };
        GuiFactory.prototype.addTo = function (object, container) {
            if (container == null) {
                this.game.world.add(object);
            }
            else {
                container.addChild(object);
            }
            this.guiElements.push(object);
            var self = this;
            object.onFocus.add(function () {
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
        };
        return GuiFactory;
    }());
    phasergui.GuiFactory = GuiFactory;
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var PhaserGui = (function () {
        function PhaserGui(game) {
            this.add = new phasergui.GuiFactory(game);
        }
        return PhaserGui;
    }());
    phasergui.PhaserGui = PhaserGui;
})(phasergui || (phasergui = {}));
var phasergui;
(function (phasergui) {
    var Theme = (function () {
        function Theme() {
            this.border = 2;
            this.buttonBackgroundColor = '#fff';
            this.buttonBorderColor = '#fff';
            this.buttonBackgroundHoverColor = '#eee';
            this.buttonBorderHoverColor = '#fff';
            this.buttonBackgroundDisabledColor = '';
            this.buttonBorderDisabledColor = '';
            this.buttonBackgroundDownColor = '#aaa';
            this.buttonBorderDownColor = '#fff';
            this.checkboxMarkColor = '#000';
            this.radioMarkColor = '#000';
        }
        return Theme;
    }());
    phasergui.Theme = Theme;
})(phasergui || (phasergui = {}));
