import { createSlice } from '@reduxjs/toolkit'
import UseTool from '@src/component/tools-use/index.js'; //引入真实使用的组件

var treeHeight = 0;

//生成唯一ID
const makeOnlyId = () => {
    return new Date().getTime() - 1000;
}

//物理元素添加或者插入
var containerCeilAddOrInsert = (treeData, item, x, y, originX, originY) => {
    if (item.isHave) {
        //计算已经有的物理高度
        let resxy = getLastCeilXy(null, treeData, item.id, item.isHave);
        let resultSheet = findNode(item.id, treeData).styleSheet;
        resultSheet.marginTop = y - originY - resxy.height - resxy.y;
        resultSheet.marginLeft = x - originX;
        insertNodeStyle(item.id, treeData, resultSheet);
    } else {
        treeAdd(null, item, y - originY - treeHeight, x - originX);
    }
    //计算已经有的物理高度
    let resxy = getLastCeilXy(null, treeData, item.id, item.isHave);
    //setTreeHeight(resxy.height + resxy.y);
}
//浮动元素添加或者插入
var floatCeilCeilAddOrInsert = (treeData, item, x, y, originX, originY) => {
    if (item.isHave) {
        let resultSheet = findNode(item.id, treeData).styleSheet;
        resultSheet.top = y - originY;
        resultSheet.left = x - originX;
        insertNodeStyle(item.id, treeData, resultSheet);
    } else {
        treeAdd(null, item, y - originY, x - originX);
    }
}
//获取末尾元素的offsetX offsetY
var getLastCeilXy = (parentId, tree, chooseId, isHave) => {
    let resultNode = null;
    let id = null;
    if (parentId) {
        let parentNode = findNode(parentId, tree);
        id = findConceilById(parentNode.childNode, chooseId, isHave);
    } else {
        resultNode = tree;
        id = findConceilById(tree, chooseId, isHave);
    }

    if (!id) {
        return { x: 0, y: 0, height: 0, width: 0 };
    }
    let findDocumentNode = document.getElementById(id);
    let [x, y, height, width] = [findDocumentNode.offsetLeft, findDocumentNode.offsetTop, findDocumentNode.offsetHeight, findDocumentNode.offsetWidth];
    console.log(x, y, height, width);
    return { x, y, height, width };
}
//获取选中元素前面的第一个物理元素
var findConceilById = (tree, id, isHave) => {
    //如果是新增
    if (isHave) {
        for (let i = tree.length - 1; i >= 0; i--) {
            if (tree[i].id === id) {
                for (let j = i - 1; j >= 0; j--) {
                    if (tree[j].tag === 'div') {
                        return tree[j].id;
                    }
                }
            }
        }
    } else {
        for (let i = tree.length - 1; i >= 0; i--) {
            if (tree[i].tag === 'div') {
                return tree[i].id;
            }
        }
    }
    return null;
}
//快速查找某个节点并返回
var findNode = (id, state) => {
    console.log(id, state);
    if (state.length === 0) {
        return false;
    }
    //依次遍历兄弟结点
    for (let i = 0; i < state.length; i++) {
        if (state[i].id === id) {
            return state[i];
        }
    }
    //接着遍历子结点
    for (let i = 0; i < state.length; i++) {
        let result = findNode(id, state[i].childNode);
        if (result) {
            return result;
        }
    }
    return false;
}
//快速给某个节点添加一个子节点
var insertChildNode = (id, tree, childNode) => {
    if (tree.length === 0) {
        return tree;
    }
    all: for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === id) {
            tree[i].childNode.push(childNode);
            break all;
        } else {
            tree[i].childNode = insertNodeStyle(id, tree[i].childNode, childNode);
        }
    }
    return tree;
}

//往状态树插入一个div 接受一个上级节点
var treeAdd = (treeData, parentId, localItem, top, left) => {
    let node = undefined;
    let styleSheet = {};
    console.log(localItem);
    switch (localItem.type) {
        case 'UseTool.Div':
            node = UseTool.Div;
            styleSheet.marginTop = top;
            styleSheet.height = localItem.styleAttr.height.value;
            styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
            styleSheet.flexDirection = 'row';
            break;
        case 'UseTool.DivTwo':
            node = UseTool.DivTwo;
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
            node = UseTool.Float;
            break;
        case 'UseTool.FloatTwo':
            styleSheet.width = localItem.styleAttr.width.value;
            styleSheet.height = localItem.styleAttr.height.value;
            styleSheet.position = 'absolute';
            styleSheet.top = top;
            styleSheet.left = left;
            styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
            node = UseTool.FloatTwo;
            break;
        default:
    }
    let item = { name: node, tag: localItem.tag, dataAttr: localItem.dataAttr, id: makeOnlyId(), styleAttr: localItem.styleAttr, styleSheet: styleSheet, childNode: [] };
    //如果父亲节点id 执行插入子树操作
    if (parentId) {
        insertChildNode(parentId, treeData, item);
    } else {
        treeData.push(item);
    }
    return treeData;
}
//一级组件添加一个子结点
var childDragBack = (treeData, parentId, item, y, x) => {

    if (item.tag === 'float') {
        if (item.isHave) {
            let resultSheet = findNode(item.id, treeData).styleSheet;
            resultSheet.top = y;
            resultSheet.left = x;
            console.log(resultSheet);
            return insertNodeStyle(item.id, treeData, resultSheet);
        } else {
            return treeAdd(treeData, parentId, item, y, x);
        }
    } else {
        if (item.isHave) {
            let resultSheet = findNode(item.id, treeData).styleSheet;
            let resultxy = getLastCeilXy(parentId, treeData, item.id, item.isHave);
            resultSheet.marginTop = y;
            resultSheet.marginLeft = x - resultxy.x - resultxy.width;
            return insertNodeStyle(item.id, treeData, resultSheet);
        } else {
            //查询已经存在的X Y 偏量
            let resultxy = getLastCeilXy(parentId, treeData, item.id, item.isHave);
            console.log(resultxy);
            return treeAdd(treeData, parentId, item, y, x - resultxy.x - resultxy.width);
        }
    }


}

//给Node插入样式
var insertNodeStyle = (state, id, styleSheet) => {
    console.log(id, state, styleSheet);
    if (state.length === 0) {
        return state;
    }
    all: for (let i = 0; i < state.length; i++) {
        if (state[i].id === id) {
            state[i].styleSheet = styleSheet;
            break all;
        } else {
            state[i].childNode = insertNodeStyle(id, state[i].childNode, styleSheet);
        }
    }
}

export const counterSlice = createSlice({
    name: 'edit_page',
    initialState: {
        value: {
            treeHeight: 0,
            treeData: [],
            currentStyle: {},
            localDomId: ''
        },
    },
    reducers: {
        //拖拽完成后
        s_dragEnd: (state, data) => {
            console.log(data);
            console.log(state);
            //childDragBack(state, ...data);
        },
        //往状态树插入一个div 接受一个上级节点
        s_treeAdd: (state, data) => {

        },
        //删除节点
        s_deleteNode: (state, id) => {

            var lunFind = (id, node) => {
                //依次遍历兄弟结点
                for (let i = 0; i < node.length; i++) {
                    if (node[i].id === id) {
                        node.splice(i, 1);
                        return node;
                    }
                }
                //接着遍历子结点
                for (let i = 0; i < node.length; i++) {
                    node[i].childNode = lunFind(id, node[i].childNode);
                }
            }
            state = lunFind(id, state);

        },
        //给Node插入样式
        insertNodeStyle: (state, id, styleSheet) => {
            console.log(id, state, styleSheet);
            if (state.length === 0) {
                return state;
            }
            all: for (let i = 0; i < state.length; i++) {
                if (state[i].id === id) {
                    state[i].styleSheet = styleSheet;
                    break all;
                } else {
                    state[i].childNode = insertNodeStyle(id, state[i].childNode, styleSheet);
                }
            }
        },
        //给节点插入额外属性
        s_insertNodeExtralData: (state, id, extralData) => {

            console.log(id, state, extralData);
            var lun = function (id, node, extralData) {
                if (node.length === 0) {
                    return node;
                }

                all: for (let i = 0; i < node.length; i++) {
                    if (state[i].id === id) {
                        node[i].dataAttr = extralData;
                        break all;
                    } else {
                        node[i].childNode = lun(id, node[i].childNode, extralData);
                    }
                }
                return node;
            }
            state.treeData = lun(id, state.treeData, extralData);

        }

    },
})

// Action creators are generated for each case reducer function
export const { s_dragEnd } = counterSlice.actions

export default counterSlice.reducer