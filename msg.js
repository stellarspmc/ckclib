"use strict";
exports.__esModule = true;
exports.sendMessage = void 0;
var packets_1 = require("bdsx/bds/packets");
function sendMessage(actor, message, type) {
    if (type === void 0) { type = 1; }
    var packet = packets_1.TextPacket.create();
    packet.message = message;
    packet.type = type;
    packet.sendTo(actor.getNetworkIdentifier());
    packet.dispose();
}
exports.sendMessage = sendMessage;
