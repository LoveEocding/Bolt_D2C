"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _prettier = _interopRequireDefault(require("prettier"));

var _vue = _interopRequireDefault(require("./vue.js"));

var _react = _interopRequireDefault(require("./react.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var result = {};

function _default(data, type) {
  switch (type) {
    case 'vue':
      result = (0, _vue["default"])(data);
      return result;

    case 'react':
      result = (0, _react["default"])(data);
      return result;
  }
}