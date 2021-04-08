import React from 'react';
import ClassStyle from './index.module.scss';
import { useState } from 'react';
import Tool from '@src/modules/common/components/component_tree';
const menuType = [
    {
        name: '组件树',
        component: <Tool />
    },
    {
        name: '页面',
        component: <Tool />
    },
    {
        name: '基础组件',
        component: <Tool />
    },

    {
        name: '活动组件',
        component: <Tool />
    }
]


export default function (props) {
    //设置激活菜单index
    const [activeIndex, setActiveIndex] = useState(0);

    //菜单渲染
    const r_menuType = menuType.map((item, index) => <div className={activeIndex === index ? `${ClassStyle.menu_item} ${ClassStyle.active}` : `${ClassStyle.menu_item}`} key={index} onClick={() => {
        setActiveIndex(index);
    }}>{item.name}</div>);

    return <div className={ClassStyle.left_menu}>
        <div className={ClassStyle.l}>
            {r_menuType}
        </div>
        <div className={ClassStyle.slider} style={{ transform: `translate(-2px,${activeIndex * 40 + 15}px)` }}></div>
        <div className={ClassStyle.r}>
            {menuType[activeIndex].component}
        </div>
    </div>
}