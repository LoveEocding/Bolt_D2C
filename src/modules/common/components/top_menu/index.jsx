/**
 * 头部标签菜单
 */
import React from 'react';
import ClassStyle from './index.module.scss';
import { useState } from 'react';

const menuType = [
    {
        name: '属性',
        component: ''
    },
    {
        name: '动画',
        component: ''
    },
    {
        name: '动作',
        component: ''
    },
    {
        name: '数据',
        component: ''
    },
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
        <div className={ClassStyle.slider} style={{ transform: `translate(${activeIndex * 48 + 15}px,-2px)` }}></div>
        <div className={ClassStyle.r}>
            {menuType[activeIndex].component}
        </div>
    </div>
}