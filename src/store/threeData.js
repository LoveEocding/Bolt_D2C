import { createSlice } from '@reduxjs/toolkit'

//快速查找某个节点并返回
const findNode = (id, state) => {
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

export const counterSlice = createSlice({
    name: 'threeData',
    initialState: {
        value: [],
    },
    reducers: {
        //删除节点
        deleteNode = (state, id) => {
            //依次遍历兄弟结点
            for (let i = 0; i < state.length; i++) {
                if (state[i].id === id) {
                    state.splice(i, 1);
                    return state;
                }
            }
            //接着遍历子结点
            for (let i = 0; i < state.length; i++) {
                state[i].childNode = lunFind(id, state[i].childNode);
            }
        },
        //给Node插入样式
        insertNodeStyle = (state, id, styleSheet) => {
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
        insertNodeExtralData = (state, id, extralData) => {
            console.log(id, state, extralData);
            if (state.length === 0) {
                return state;
            }
            all: for (let i = 0; i < state.length; i++) {
                if (state[i].id === id) {
                    state[i].dataAttr = extralData;
                    break all;
                } else {
                    state[i].childNode = insertNodeExtralData(id, state[i].childNode, extralData);
                }
            }
            return state;
        }

    },
})

// Action creators are generated for each case reducer function
export const { deleteNode, insertNodeExtralData } = counterSlice.actions

export default counterSlice.reducer