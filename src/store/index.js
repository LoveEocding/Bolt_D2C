import { configureStore } from '@reduxjs/toolkit'
import Three from './threeData';
export default configureStore({
    reducer: {
        three: Three
    },
})