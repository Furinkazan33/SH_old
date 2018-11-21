var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var PhaserExt;
(function (PhaserExt) {
    var Form;
    (function (Form) {
        var FormElement = (function (_super) {
            __extends(FormElement, _super);
            function FormElement() {
                _super.call(this);
            }
            return FormElement;
        }(PhaserExt.GuiElement));
        Form.FormElement = FormElement;
    })(Form = PhaserExt.Form || (PhaserExt.Form = {}));
})(PhaserExt || (PhaserExt = {}));
