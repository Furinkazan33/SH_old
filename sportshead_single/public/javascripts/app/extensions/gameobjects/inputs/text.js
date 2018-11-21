var PhaserExt = PhaserExt || {};
var KEY_BACKSPACE = 8;
var KEY_ENTER = 13;
var KEY_SHIFT = 16;
var KEY_CTRL = 17;
var KEY_ALT = 18;
var KEY_ESC = 27;
var KEY_PAGEUP = 33;
var KEY_PAGEDOWN = 34;
var KEY_END = 35;
var KEY_HOME = 36;
var KEY_LEFTARROW = 37;
var KEY_UPARROW = 38;
var KEY_RIGHTARROW = 39;
var KEY_DOWNARROW = 40;
var KEY_INSERT = 45;
var KEY_DELETE = 46;
var KEY_F1 = 112;
var KEY_F2 = 113;
var KEY_F3 = 114;
var KEY_F4 = 115;
var KEY_F5 = 116;
var KEY_F6 = 117;
var KEY_F7 = 118;
var KEY_F8 = 119;
var KEY_F9 = 120;
var KEY_F10 = 121;
var KEY_F11 = 122;
var KEY_F12 = 123;
PhaserExt.Text = function (game, x, y, frameKey, tickKey, options) {
    this._game = game;
    this._x = x;
    this._y = y;
    this._selected = false;
    this._cursorPosition = 0;
    options = options || {};
    var defaultOptions = {
        length: 10
    };
    for (var index in defaultOptions) {
        if (!options.hasOwnProperty(index)) {
            options[index] = defaultOptions[index];
        }
    }
    var that = this;
    game.input.mouse.mouseDownCallback = function () {
        that.onBlur();
    };
    this.length = options.length;
    this._bgSprite = this._game.add.sprite(x, y, frameKey);
    this._bgSprite.inputEnabled = true;
    this._bgSprite.events.onInputDown.add(this.onFocus, this);
    this._tickSprite = this._game.add.sprite(x + 5, y + 3, tickKey);
    this._tickSprite.visible = false;
    this._text = this._game.add.text(x + 9, y + 5, '');
    this._text.fontSize = 16;
    this._text.fill = '#000';
    this._game.input.keyboard.addCallbacks(this, null, null, this.onKeyPress);
    this._game.time.events.loop(Phaser.Timer.SECOND / 2, this.onTick, this);
};
PhaserExt.Text.prototype.onKeyPress = function (char, keyPressEvent) {
    if (!this._selected) {
        return;
    }
    switch (keyPressEvent.keyCode) {
        case KEY_BACKSPACE:
            keyPressEvent.preventDefault();
            var textLength = this._text.text.length;
            if (textLength > 0) {
                this._text.text = this._text.text.substring(0, textLength - 1);
                this._cursorPosition--;
            }
            break;
        case KEY_DELETE:
            var textLength = this._text.text.length;
            if (textLength > 0) {
                var text = this._text.text.split('');
                delete text[this._cursorPosition];
                this._text.text = text.join('');
            }
            break;
        case KEY_LEFTARROW:
            this._cursorPosition--;
            break;
        case KEY_RIGHTARROW:
            this._cursorPosition++;
            break;
        case KEY_ENTER:
            this.onSubmit.call(this, this._text.text);
            break;
        case KEY_SHIFT:
        case KEY_CTRL:
        case KEY_ALT:
        case KEY_ESC:
        case KEY_PAGEUP:
        case KEY_PAGEDOWN:
        case KEY_INSERT:
        case KEY_F1:
        case KEY_F2:
        case KEY_F3:
        case KEY_F4:
        case KEY_F5:
        case KEY_F6:
        case KEY_F7:
        case KEY_F8:
        case KEY_F9:
        case KEY_F10:
        case KEY_F11:
        case KEY_F12:
            break;
        default:
            if ((this._text.text.length + 1) <= this.length) {
                if (char.length > 0) {
                    this._text.text += char;
                    this._cursorPosition++;
                }
            }
    }
    this._tickSprite.x = 9 + (this._cursorPosition * 10);
};
PhaserExt.Text.prototype.onTick = function () {
    if (this._selected) {
        this._tickSprite.visible = !this._tickSprite.visible;
    }
    else {
        this._tickSprite.visible = false;
    }
};
PhaserExt.Text.prototype.onFocus = function () {
    this._selected = true;
};
PhaserExt.Text.prototype.onBlur = function () {
    this._selected = false;
};
Phaser.GameObjectFactory.prototype.textinput = function (x, y, frameKey, tickKey, options) {
    return new PhaserExt.Text(this.game, x, y, frameKey, tickKey, options);
};
