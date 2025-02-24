"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeJson = decodeJson;
exports.encodeJson = encodeJson;
function decodeJson(json) {
    return JSON.parse(json);
}
function encodeJson(json) {
    return JSON.stringify(json);
}
