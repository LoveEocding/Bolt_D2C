"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.changeCurrentEditId = exports.importData = exports.counterSlice = void 0;

var _toolkit = require("@reduxjs/toolkit");

var counterSlice = (0, _toolkit.createSlice)({
  name: 'edit_page',
  initialState: {
    //组件树的值
    value: {},
    //额外的一些辅助数据
    extral: {
      currentEditId: ''
    }
  },
  reducers: {
    //保存导入的AST数据
    importData: function importData(state, action) {
      console.log(action.payload);
      state.value = action.payload.data;
    },
    //修改当前正在编辑的ID
    changeCurrentEditId: function changeCurrentEditId(state, action) {
      state.extral.currentEditId = action.payload.value;
    }
  }
}); // Action creators are generated for each case reducer function

exports.counterSlice = counterSlice;
var _counterSlice$actions = counterSlice.actions,
    importData = _counterSlice$actions.importData,
    changeCurrentEditId = _counterSlice$actions.changeCurrentEditId;
exports.changeCurrentEditId = changeCurrentEditId;
exports.importData = importData;
var _default = counterSlice.reducer;
exports["default"] = _default;