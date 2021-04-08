import React from 'react';
import ClassStyle from './index.module.scss';
import RenderData from '@src/testdata.js';




//组件树渲染
const treeRender = (data) => {
    console.log(data);
    return <div className={ClassStyle.tree_main}>
        <div className={ClassStyle.lable}>
            <span className={ClassStyle.dir}></span>
            <i className={'icon_' + data.componentName}>

            </i>
            <span className={ClassStyle.type}>{data.componentName}</span>
            <span className={ClassStyle.class}>{data.props.className}</span>
        </div>
        {loop(data.children)}
    </div>
}
const loop = (list) => {
    if (!list) {
        return '';
    }
    return list.map(item => <div className={ClassStyle.parent}>
        <div className={ClassStyle.lable}>
            <span className={ClassStyle.path}></span>
            {item.children ? <span className={ClassStyle.dir} ></span> : ''}
            <i className={'icon_' + item.componentName}>
            </i>
            <span className={ClassStyle.type}>{item.componentName}</span>
            <span className={ClassStyle.class}>{item.props.className}</span>
        </div>
        <div className={ClassStyle.child}>
            {loop(item.children)}
        </div>
    </div>);
}

export default function (props) {
    return <div className={ClassStyle.component_tree}>
        {treeRender(RenderData)}
    </div>
}