import React from 'react';
import ClassStyle from './index.module.scss';
import { useSelector, useDispatch } from 'react-redux';

import { changeCurrentEditId, changeCurrentStyle, changeCurrentAttr } from '@src/store/threeData.js';



export default function (props) {
    const treeData = useSelector((state) => state.three.value);
    const extralData = useSelector((state) => state.three.extral);
    const dispatch = useDispatch();

    //组件点击事件
    const handerClick = (item) => {
        dispatch(changeCurrentEditId({ value: item.id }));
        dispatch(changeCurrentStyle({ value: item.props.style }));
        const { style, ...attr } = item.props;
        dispatch(changeCurrentAttr({ value: attr }));
    }

    //组件树渲染
    const treeRender = (data) => {
        if (typeof data === 'object' && Object.keys(data).length === 0) {
            return '';
        }
        console.log(data);
        return <div className={ClassStyle.tree_main}>
            <div className={ClassStyle.lable} >
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
            <div onClick={() => { handerClick(item) }} className={ClassStyle.lable} style={{ outline: item.id === extralData.currentEditId ? '1px solid red' : '' }} >
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
    return <div className={ClassStyle.component_tree}>
        {treeRender(treeData)}
    </div>
}