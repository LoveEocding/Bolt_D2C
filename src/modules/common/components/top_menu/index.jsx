/**
 * 头部标签菜单
 */
import React from 'react';
import ClassStyle from './index.module.scss';
import { useState } from 'react';
import StyleEdit from '@src/modules/edit/components/style_edit';
import AttrEdit from '@src/modules/edit/components/attribute_panel';
const menuType = [
    {
        name: '样式',
        component: <StyleEdit />
    },
    {
        name: '属性',
        component: <AttrEdit />
    },
    {
        name: '动画',
        component: ''
    },
    {
        name: '事件',
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
    //编辑内容显示
    const r_edit = menuType.map((item, key) => <div key={key} style={{ width: '100%', position: 'absolute', top: 0, left: `${key * 100 + '%'}` }}>{item.component}</div>);
    return <div className={ClassStyle.left_menu}>
        <div className={ClassStyle.l}>
            {r_menuType}
        </div>
        <div className={ClassStyle.slider} style={{ transform: `translate(${activeIndex * 48 + 15}px,-2px)` }}></div>
        <div className={ClassStyle.r}>
            <div style={{ transform: `translateX(${activeIndex * -100 + '%'})`, position: 'relative' }}>
                {r_edit}
            </div>
        </div>
    </div>
}