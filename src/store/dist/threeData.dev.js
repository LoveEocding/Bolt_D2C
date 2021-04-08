"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.counterSlice = void 0;

var _toolkit = require("@reduxjs/toolkit");

function _objectDestructuringEmpty(obj) { if (obj == null) throw new TypeError("Cannot destructure undefined"); }

var counterSlice = (0, _toolkit.createSlice)({
  name: 'edit_page',
  initialState: {
    value: {
      treeHeight: 0,
      treeData: [],
      currentStyle: {},
      localDomId: ''
    }
  },
  reducers: {}
}); // Action creators are generated for each case reducer function

exports.counterSlice = counterSlice;

_objectDestructuringEmpty(counterSlice.actions);

var _default = counterSlice.reducer;
exports["default"] = _default;