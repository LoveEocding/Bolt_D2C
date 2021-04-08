import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'edit_page',
    initialState: {
        //组件树的值
        value: {

        },
        //额外的一些辅助数据
        extral: {
            currentEditId: ''
        }

    },
    reducers: {
        //保存导入的AST数据
        importData(state, action) {
            console.log(action.payload);
            state.value = action.payload.data;
        },
        //修改当前正在编辑的ID
        changeCurrentEditId(state, action) {
            state.extral.currentEditId = action.payload.value;
        }
    },
})

// Action creators are generated for each case reducer function
export const { importData, changeCurrentEditId } = counterSlice.actions

export default counterSlice.reducer