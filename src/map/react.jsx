/* 
AST其中和对应react组件的映射关系
**/
import React from 'react';
import { useSelector } from 'react-redux'



//组件树渲染
export const ThreeRender = (tree) => {
    const extralData = useSelector((state) => state.three.extral);
    //递推循环组件树
    const loop = (node) => {
        if (!node) return '';
        return node.map(item => componetByType(item))
    }

    // 图片
    const ImageComponent = (item) => {
        return <img src={item.props.src} id={item.id} style={{ ...item.props.style, outline: item.id === extralData.currentEditId ? '1px solid red' : '' }} className={item.props.className} alt="" />
    }

    //文本
    const TextComponent = (item) => {
        return <p style={{ ...item.props.style, outline: item.id === extralData.currentEditId ? '1px solid red' : '' }} id={item.id} className={item.props.className}>{item.props.text}</p>
    }

    //Div
    const DivComponent = (item) => {
        return <div style={{ ...item.props.style, outline: item.id === extralData.currentEditId ? '1px solid red' : '' }} id={item.id} className={item.props.className} >{loop(item.children)}</div>
    }

    //根据不同的component选择不同的component
    const componetByType = (item) => {
        switch (item.componentName) {
            case 'Div':
                return DivComponent(item);
            case 'Image':
                return ImageComponent(item);
            case 'Text':
                return TextComponent(item);
            case 'Block':
                return DivComponent(item);
        }
    }
    if (typeof tree === 'object' && Object.keys(tree).length === 0) {
        return '';
    }
    return <div className={tree.props.className} id={tree.id} style={tree.props.style}>{loop(tree.children)}</div>
}