"use strict";
// mineyee2913's code
exports.__esModule = true;
exports.NameById = exports.IdByName = void 0;
var common_1 = require("bdsx/common");
var event_1 = require("bdsx/event");
var packetIds_1 = require("bdsx/bds/packetIds");
var nIt = new Map();
var nMt = new Map();
var nXt = new Map();
var nSt = new Map();
event_1.events.packetAfter(packetIds_1.MinecraftPacketIds.Login).on(function (ptr, networkIdentifier) {
    var conq = ptr.connreq;
    if (conq === null)
        return;
    var cert = conq.cert;
    var device = common_1.DeviceOS[conq.getDeviceOS()];
    var xuid = cert.getXuid();
    var username = cert.getId();
    var _a = String(networkIdentifier).split('|'), ip = _a[0], port = _a[1];
    console.log(username + " : " + ip + " [" + port + "]");
    nXt.set(username, xuid);
    nIt.set(username, networkIdentifier);
    nMt.set(networkIdentifier, username);
    nSt.set(networkIdentifier, device);
});
/**
  *get playerId by Name
*/
function IdByName(PlayerName) {
    var Rlt = nIt.get(PlayerName);
    return Rlt;
}
exports.IdByName = IdByName;
/**
  *get playerName by Id
*/
function NameById(networkIdentifier) {
    var actor = networkIdentifier.getActor();
    var playerName;
    try {
        playerName = actor.getName();
    }
    catch (_a) {
        playerName = nMt.get(networkIdentifier);
    }
    return playerName;
}
exports.NameById = NameById;
