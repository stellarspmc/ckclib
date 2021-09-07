"use strict";
// sacri's json scripts
exports.__esModule = true;
exports.isFile = exports.writeJSON = exports.parseJSON = void 0;
var fs_1 = require("fs");
function parseJSON(path) {
    initJSONifNotExist(path);
    return JSON.parse(fs_1.readFileSync(path, "utf8"));
}
exports.parseJSON = parseJSON;
function initJSONifNotExist(path) {
    if (!isFile(path)) {
        initJSON(path);
    }
}
function writeJSON(path, data) {
    initJSONifNotExist(path);
    fs_1.writeFileSync(path, JSON.stringify(data));
}
exports.writeJSON = writeJSON;
function isFile(filepath) {
    try {
        return fs_1.statSync(filepath).isFile();
    }
    catch (err) {
        return false;
    }
}
exports.isFile = isFile;
function initJSON(path) {
    fs_1.appendFileSync(path, "{}");
}
