"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.importData = exports.counterSlice = void 0;

var _toolkit = require("@reduxjs/toolkit");

var counterSlice = (0, _toolkit.createSlice)({
  name: 'edit_page',
  initialState: {
    value: {}
  },
  reducers: {
    //保存导入的AST数据
    importData: function importData(state, action) {
      console.log(action.payload);
      state.value = action.payload.data;
    }
  }
}); // Action creators are generated for each case reducer function

exports.counterSlice = counterSlice;
var importData = counterSlice.actions.importData;
exports.importData = importData;
var _default = counterSlice.reducer;
exports["default"] = _default;