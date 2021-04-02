"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.s_dragEnd = exports.counterSlice = void 0;

var _toolkit = require("@reduxjs/toolkit");

var _index = _interopRequireDefault(require("@src/component/tools-use/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

//引入真实使用的组件
var treeHeight = 0; //生成唯一ID

var makeOnlyId = function makeOnlyId() {
  return new Date().getTime() - 1000;
}; //物理元素添加或者插入


var containerCeilAddOrInsert = function containerCeilAddOrInsert(treeData, item, x, y, originX, originY) {
  if (item.isHave) {
    //计算已经有的物理高度
    var _resxy = getLastCeilXy(null, treeData, item.id, item.isHave);

    var resultSheet = findNode(item.id, treeData).styleSheet;
    resultSheet.marginTop = y - originY - _resxy.height - _resxy.y;
    resultSheet.marginLeft = x - originX;

    _insertNodeStyle(item.id, treeData, resultSheet);
  } else {
    treeAdd(null, item, y - originY - treeHeight, x - originX);
  } //计算已经有的物理高度


  var resxy = getLastCeilXy(null, treeData, item.id, item.isHave); //setTreeHeight(resxy.height + resxy.y);
}; //浮动元素添加或者插入


var floatCeilCeilAddOrInsert = function floatCeilCeilAddOrInsert(treeData, item, x, y, originX, originY) {
  if (item.isHave) {
    var resultSheet = findNode(item.id, treeData).styleSheet;
    resultSheet.top = y - originY;
    resultSheet.left = x - originX;

    _insertNodeStyle(item.id, treeData, resultSheet);
  } else {
    treeAdd(null, item, y - originY, x - originX);
  }
}; //获取末尾元素的offsetX offsetY


var getLastCeilXy = function getLastCeilXy(parentId, tree, chooseId, isHave) {
  var resultNode = null;
  var id = null;

  if (parentId) {
    var parentNode = findNode(parentId, tree);
    id = findConceilById(parentNode.childNode, chooseId, isHave);
  } else {
    resultNode = tree;
    id = findConceilById(tree, chooseId, isHave);
  }

  if (!id) {
    return {
      x: 0,
      y: 0,
      height: 0,
      width: 0
    };
  }

  var findDocumentNode = document.getElementById(id);
  var _ref = [findDocumentNode.offsetLeft, findDocumentNode.offsetTop, findDocumentNode.offsetHeight, findDocumentNode.offsetWidth],
      x = _ref[0],
      y = _ref[1],
      height = _ref[2],
      width = _ref[3];
  console.log(x, y, height, width);
  return {
    x: x,
    y: y,
    height: height,
    width: width
  };
}; //获取选中元素前面的第一个物理元素


var findConceilById = function findConceilById(tree, id, isHave) {
  //如果是新增
  if (isHave) {
    for (var i = tree.length - 1; i >= 0; i--) {
      if (tree[i].id === id) {
        for (var j = i - 1; j >= 0; j--) {
          if (tree[j].tag === 'div') {
            return tree[j].id;
          }
        }
      }
    }
  } else {
    for (var _i = tree.length - 1; _i >= 0; _i--) {
      if (tree[_i].tag === 'div') {
        return tree[_i].id;
      }
    }
  }

  return null;
}; //快速查找某个节点并返回


var findNode = function findNode(id, state) {
  console.log(id, state);

  if (state.length === 0) {
    return false;
  } //依次遍历兄弟结点


  for (var i = 0; i < state.length; i++) {
    if (state[i].id === id) {
      return state[i];
    }
  } //接着遍历子结点


  for (var _i2 = 0; _i2 < state.length; _i2++) {
    var result = findNode(id, state[_i2].childNode);

    if (result) {
      return result;
    }
  }

  return false;
}; //快速给某个节点添加一个子节点


var insertChildNode = function insertChildNode(id, tree, childNode) {
  if (tree.length === 0) {
    return tree;
  }

  all: for (var i = 0; i < tree.length; i++) {
    if (tree[i].id === id) {
      tree[i].childNode.push(childNode);
      break all;
    } else {
      tree[i].childNode = _insertNodeStyle(id, tree[i].childNode, childNode);
    }
  }

  return tree;
}; //往状态树插入一个div 接受一个上级节点


var treeAdd = function treeAdd(treeData, parentId, localItem, top, left) {
  var node = undefined;
  var styleSheet = {};
  console.log(localItem);

  switch (localItem.type) {
    case 'UseTool.Div':
      node = _index["default"].Div;
      styleSheet.marginTop = top;
      styleSheet.height = localItem.styleAttr.height.value;
      styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
      styleSheet.flexDirection = 'row';
      break;

    case 'UseTool.DivTwo':
      node = _index["default"].DivTwo;
      styleSheet.width = localItem.styleAttr.width.value;
      styleSheet.height = localItem.styleAttr.height.value;
      styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
      styleSheet.marginTop = top;
      styleSheet.marginLeft = left;
      break;

    case 'UseTool.Float':
      styleSheet.width = localItem.styleAttr.width.value;
      styleSheet.height = localItem.styleAttr.height.value;
      styleSheet.position = 'absolute';
      styleSheet.top = top;
      styleSheet.left = left;
      styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
      node = _index["default"].Float;
      break;

    case 'UseTool.FloatTwo':
      styleSheet.width = localItem.styleAttr.width.value;
      styleSheet.height = localItem.styleAttr.height.value;
      styleSheet.position = 'absolute';
      styleSheet.top = top;
      styleSheet.left = left;
      styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
      node = _index["default"].FloatTwo;
      break;

    default:
  }

  var item = {
    name: node,
    tag: localItem.tag,
    dataAttr: localItem.dataAttr,
    id: makeOnlyId(),
    styleAttr: localItem.styleAttr,
    styleSheet: styleSheet,
    childNode: []
  }; //如果父亲节点id 执行插入子树操作

  if (parentId) {
    insertChildNode(parentId, treeData, item);
  } else {
    treeData.push(item);
  }

  return treeData;
}; //一级组件添加一个子结点


var childDragBack = function childDragBack(treeData, parentId, item, y, x) {
  if (item.tag === 'float') {
    if (item.isHave) {
      var resultSheet = findNode(item.id, treeData).styleSheet;
      resultSheet.top = y;
      resultSheet.left = x;
      console.log(resultSheet);
      return _insertNodeStyle(item.id, treeData, resultSheet);
    } else {
      return treeAdd(treeData, parentId, item, y, x);
    }
  } else {
    if (item.isHave) {
      var _resultSheet = findNode(item.id, treeData).styleSheet;
      var resultxy = getLastCeilXy(parentId, treeData, item.id, item.isHave);
      _resultSheet.marginTop = y;
      _resultSheet.marginLeft = x - resultxy.x - resultxy.width;
      return _insertNodeStyle(item.id, treeData, _resultSheet);
    } else {
      //查询已经存在的X Y 偏量
      var _resultxy = getLastCeilXy(parentId, treeData, item.id, item.isHave);

      console.log(_resultxy);
      return treeAdd(treeData, parentId, item, y, x - _resultxy.x - _resultxy.width);
    }
  }
}; //给Node插入样式


var _insertNodeStyle = function insertNodeStyle(state, id, styleSheet) {
  console.log(id, state, styleSheet);

  if (state.length === 0) {
    return state;
  }

  all: for (var i = 0; i < state.length; i++) {
    if (state[i].id === id) {
      state[i].styleSheet = styleSheet;
      break all;
    } else {
      state[i].childNode = _insertNodeStyle(id, state[i].childNode, styleSheet);
    }
  }
};

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
  reducers: {
    //拖拽完成后
    s_dragEnd: function s_dragEnd(state, data) {
      console.log(data);
      console.log(state); //childDragBack(state, ...data);
    },
    //往状态树插入一个div 接受一个上级节点
    s_treeAdd: function s_treeAdd(state, data) {},
    //删除节点
    s_deleteNode: function s_deleteNode(state, id) {
      var lunFind = function lunFind(id, node) {
        //依次遍历兄弟结点
        for (var i = 0; i < node.length; i++) {
          if (node[i].id === id) {
            node.splice(i, 1);
            return node;
          }
        } //接着遍历子结点


        for (var _i3 = 0; _i3 < node.length; _i3++) {
          node[_i3].childNode = lunFind(id, node[_i3].childNode);
        }
      };

      state = lunFind(id, state);
    },
    //给Node插入样式
    insertNodeStyle: function insertNodeStyle(state, id, styleSheet) {
      console.log(id, state, styleSheet);

      if (state.length === 0) {
        return state;
      }

      all: for (var i = 0; i < state.length; i++) {
        if (state[i].id === id) {
          state[i].styleSheet = styleSheet;
          break all;
        } else {
          state[i].childNode = _insertNodeStyle(id, state[i].childNode, styleSheet);
        }
      }
    },
    //给节点插入额外属性
    s_insertNodeExtralData: function s_insertNodeExtralData(state, id, extralData) {
      console.log(id, state, extralData);

      var lun = function lun(id, node, extralData) {
        if (node.length === 0) {
          return node;
        }

        all: for (var i = 0; i < node.length; i++) {
          if (state[i].id === id) {
            node[i].dataAttr = extralData;
            break all;
          } else {
            node[i].childNode = lun(id, node[i].childNode, extralData);
          }
        }

        return node;
      };

      state.treeData = lun(id, state.treeData, extralData);
    }
  }
}); // Action creators are generated for each case reducer function

exports.counterSlice = counterSlice;
var s_dragEnd = counterSlice.actions.s_dragEnd;
exports.s_dragEnd = s_dragEnd;
var _default = counterSlice.reducer;
exports["default"] = _default;