import React from 'react';
import Edit from './modules/edit';
import Test from './modules/common/components/left_menu';
import Old from './modules/old';
export default [
    {
        path: '/edit',
        component: <Edit />,
        meta: {
            title: '编辑'
        }
    },
    {
        path: '/old',
        component: <Old />,
        meta: {
            title: '历史模式'
        }
    },
    {
        path: '/test',
        component: <Test />,
        meta: {
            title: '测试'
        }
    },
]