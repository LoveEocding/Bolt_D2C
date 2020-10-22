/**
 * 虚拟DOM树操作
 */

//快速给某个节点添加一个子节点
const insertChildNode = (id, tree, childNode) => {
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
//快速给某个节点插入样式
const insertNodeStyle = (id, tree, styleSheet) => {
    console.log(id, tree, styleSheet);
    if (tree.length === 0) {
        return tree;
    }
    all: for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === id) {
            tree[i].styleSheet = styleSheet;
            break all;
        } else {
            tree[i].childNode = insertNodeStyle(id, tree[i].childNode, styleSheet);
        }
    }
    return tree;
}
//快速给某节点插入额外属性
const insertNodeExtralData = (id, tree, extralData) => {
    console.log(id, tree, extralData);
    if (tree.length === 0) {
        return tree;
    }
    all: for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === id) {
            tree[i].dataAttr = extralData;
            break all;
        } else {
            tree[i].childNode = insertNodeExtralData(id, tree[i].childNode, extralData);
        }
    }
    return tree;
}

//快速查找某个节点并返回
const findNode = (id, tree) => {
    console.log(id, tree);
    if (tree.length === 0) {
        return false;
    }
    //依次遍历兄弟结点
    for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === id) {
            return tree[i];
        }
    }
    //接着遍历子结点
    for (let i = 0; i < tree.length; i++) {
        let result = findNode(id, tree[i].childNode);
        if (result) {
            return result;
        }
    }
    return false;
}

//快速删除某个节点
const deleteNode = (id, tree) => {
    const lunFind = (id, tree) => {
        //依次遍历兄弟结点
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                tree.splice(i, 1);
                return tree;
            }
        }
        //接着遍历子结点
        for (let i = 0; i < tree.length; i++) {
            tree[i].childNode = lunFind(id, tree[i].childNode);
        }
        return tree;
    };
    let result = lunFind(id, tree);
    return result;
}
//生成唯一ID
const makeOnlyId = () => {
    return new Date().getTime() - 1000;
}

//获取选中元素前面的第一个物理元素ID 
const findConceilById = (tree, id, isHave) => {
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

//获取末尾元素的offsetX offsetY
const getLastCeilXy = (parentId, tree, chooseId, isHave) => {
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
        return {
            x: 0,
            y: 0,
            height: 0,
            width: 0
        };
    }
    let findDocumentNode = document.getElementById(id);
    let [x, y, height, width] = [findDocumentNode.offsetLeft, findDocumentNode.offsetTop, findDocumentNode.offsetHeight, findDocumentNode.offsetWidth];
    console.log(x, y, height, width);
    return {
        x,
        y,
        height,
        width
    };
}

//根据当前的拖拽元素的type 返回虚拟DOM
const getDomByType=(item,top,left)=>{
    
}