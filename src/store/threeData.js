import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
    name: 'edit_page',
    initialState: {
        value: {
        },
    },
    reducers: {
        //保存导入的AST数据
        importData(state, action) {
            console.log(action.payload);
            state.value = action.payload.data;
        }
    },
})

// Action creators are generated for each case reducer function
export const { importData } = counterSlice.actions

export default counterSlice.reducer