import React from 'react';
import Edit from './modules/edit';
import Test from './modules/edit/components/container';
export default [
    {
        path: '/edit',
        component: <Edit />,
        meta: {
            title: '编辑'
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