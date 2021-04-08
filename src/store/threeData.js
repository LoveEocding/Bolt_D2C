import { createSlice } from '@reduxjs/toolkit'

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


    },
})

// Action creators are generated for each case reducer function
export const { } = counterSlice.actions

export default counterSlice.reducer