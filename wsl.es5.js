"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.codeNlFix = undefined;

var _constants = require("./constants.js");

var consts = _interopRequireWildcard(_constants);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function codeNlFix() {
    Array.from(document.querySelectorAll("pre code")).map(function (p) {
        return p.innerHTML = p.innerHTML.trim();
    });
}

if (window) {
    window.codeNlFix = codeNlFix;
}

exports.codeNlFix = codeNlFix;