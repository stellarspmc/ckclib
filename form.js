"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.Form = exports.formSend = exports.FormData = void 0;
var packetids_1 = require("bdsx/bds/packetids");
var packets_1 = require("bdsx/bds/packets");
var event_1 = require("bdsx/event");
exports.FormData = new Map();
var formJSONTYPE = /** @class */ (function () {
    function formJSONTYPE() {
    }
    return formJSONTYPE;
}());
var formJSON = /** @class */ (function () {
    function formJSON() {
        this.type = "form";
        this.title = "";
        this.content = "";
        this.buttons = [];
    }
    return formJSON;
}());
var CustomformJSON = /** @class */ (function () {
    function CustomformJSON() {
        this.type = "custom_form";
        this.title = "";
        this.content = [];
    }
    return CustomformJSON;
}());
var modalJSON = /** @class */ (function () {
    function modalJSON() {
        this.type = "modal";
        this.title = "";
        this.content = "";
        this.button1 = "";
        this.button2 = "";
    }
    return modalJSON;
}());
var formSetting = /** @class */ (function (_super) {
    __extends(formSetting, _super);
    function formSetting() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return formSetting;
}(CustomformJSON));
var FormFile = /** @class */ (function () {
    function FormFile() {
        this.json = new formJSON();
    }
    FormFile.prototype.setTitle = function (title) {
        this.json.title = title;
    };
    FormFile.prototype.setContent = function (content) {
        this.json.content = content;
    };
    FormFile.prototype.addButton = function (text, image) {
        return this.json.buttons.push({
            text: text,
            image: image
        });
    };
    FormFile.prototype.addHandler = function (handler) {
        this.handler = handler;
    };
    FormFile.prototype.send = function () {
        formSend(this.target, this.json, this.handler);
    };
    return FormFile;
}());
var CustomFormFile = /** @class */ (function () {
    function CustomFormFile() {
        this.json = new CustomformJSON();
    }
    CustomFormFile.prototype.setTitle = function (title) {
        this.json.title = title;
    };
    CustomFormFile.prototype.addContent = function (content) {
        this.json.content = content;
    };
    CustomFormFile.prototype.addHandler = function (handler) {
        this.handler = handler;
    };
    CustomFormFile.prototype.send = function () {
        formSend(this.target, this.json, this.handler);
    };
    return CustomFormFile;
}());
var ModalFile = /** @class */ (function () {
    function ModalFile() {
        this.json = new modalJSON();
    }
    ModalFile.prototype.setTitle = function (title) {
        this.json.title = title;
    };
    ModalFile.prototype.setContent = function (content) {
        this.json.content = content;
    };
    ModalFile.prototype.setButton1 = function (button) {
        this.json.button1 = button;
    };
    ModalFile.prototype.setButton2 = function (button) {
        this.json.button2 = button;
    };
    ModalFile.prototype.addHandler = function (handler) {
        this.handler = handler;
    };
    ModalFile.prototype.send = function () {
        formSend(this.target, this.json, this.handler);
    };
    return ModalFile;
}());
/**
  *JsonType example : https://github.com/NLOGPlugins/Form_Json You can use form.write instead of this
*/
function formSend(target, form, handler, id) {
    try {
        var modalPacket = packets_1.ShowModalFormPacket.create();
        var formId = Math.floor(Math.random() * 1147483647) + 1000000000;
        if (typeof id === "number")
            formId = id;
        modalPacket.setUint32(formId, 0x30);
        modalPacket.setCxxString(JSON.stringify(form), 0x38);
        modalPacket.sendTo(target, 0);
        if (handler === undefined)
            handler = function () { };
        if (!exports.FormData.has(target)) {
            exports.FormData.set(target, [
                {
                    Id: formId,
                    func: handler
                }
            ]);
        }
        else {
            var f = exports.FormData.get(target);
            f.push({
                Id: formId,
                func: handler
            });
            exports.FormData.set(target, f);
        }
        modalPacket.dispose();
    }
    catch (err) { }
}
exports.formSend = formSend;
var Form;
(function (Form) {
    Form.create = {
        form: function (target) {
            var form = new FormFile();
            form.target = target;
            return form;
        },
        custom_form: function (target) {
            var form = new CustomFormFile();
            form.target = target;
            return form;
        },
        modal: function (target) {
            var form = new ModalFile();
            form.target = target;
            return form;
        }
    };
    Form.write = formSend;
    function setSettingForm(form, handler) {
        if (handler === void 0) { handler = function (data, target, json) { }; }
        settingForm = form;
        settingHandler = handler;
    }
    Form.setSettingForm = setSettingForm;
})(Form = exports.Form || (exports.Form = {}));
var settingForm;
var settingHandler = function (data, target, json) { };
event_1.events.packetAfter(packetids_1.MinecraftPacketIds.ServerSettingsRequest).on(function (ptr, target) {
    if (settingForm === undefined)
        return;
    setTimeout(function () {
        var packet = packets_1.ServerSettingsResponsePacket.create();
        packet.setUint32(5928, 0x30);
        packet.setCxxString(JSON.stringify(settingForm(target)), 0x38);
        packet.sendTo(target);
        packet.dispose();
    }, 2000);
});
event_1.events.packetRaw(packetids_1.MinecraftPacketIds.ModalFormResponse).on(function (ptr, size, target) {
    ptr.move(1);
    var formId = ptr.readVarUint();
    var formData = ptr.readVarString();
    var data = JSON.parse(formData.replace("\n", ""));
    if (formId === 5928) {
        var f_1 = {};
        if (settingForm !== undefined)
            f_1 = settingForm(target);
        settingHandler(data, target, f_1);
        return;
    }
    var dataValue = exports.FormData.get(target).find(function (v) { return v.Id === formId; });
    if (dataValue === undefined)
        return;
    dataValue.func(data);
    var f = exports.FormData.get(target);
    f.splice(f.indexOf(dataValue), 1);
    exports.FormData.set(target, f);
});
