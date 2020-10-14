import React ,{ useState } from 'react';
import { useDrag, useDrop } from 'react-dnd'

import UseTool from '../tools-use/index.js'; //引入真实使用的组件


function DivUse({ styleSheet, dataAttr, styleAttr, callback,childClick,id, localDomId, dragCallBack, childNodeList }) {
    //设置可以被拖拽
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'UseComponent.Div', id: id, isHave: true },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    //设置可以被存放
    const [{ isOver }, drop] = useDrop({
        accept: ['UseTool.DivTwo', 'UseTool.FloatTwo','UseComponent.DivTwo'],
        drop: (item, monitor) => dragEnd(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    //拖拽完成函数
    const dragEnd = (item, monitor) => {
        let parentNode = document.getElementById(id);
        let phoneNode = document.getElementById('phone_canvas');
        let { x, y } = monitor.getSourceClientOffset();
        let [originY, originX] = [phoneNode.offsetTop + parentNode.offsetTop, phoneNode.offsetLeft + parentNode.offsetLeft];
        console.log(x, y, originX, originY);
        dragCallBack(id, item, y - originY, x - originX);
    }
    //设置右键鼠标显示与否
    const [rightMenuShow,setRightMenuShow]=useState(true);
    //渲染子节点
    const treeRender = (tree) => {
        return tree.map(item => <item.name callback={localEditComponent} dataAttr={item.dataAttr} styleAttr={item.styleAttr} styleSheet={item.styleSheet} key={item.id} localDomId={localDomId} id={item.id} childNodeList={item.childNode}></item.name>);
    }
    //点击编辑当前 
    const localEditComponent = (e,item) => {
       console.log('点击子节点');
       childClick(item);
       e.stopPropagation();
    }
    //右键点击事件
    const rightMenuClick=(e)=>{
        e.preventDefault();
        console.log('右键点击');
    }
    return <div id={id} key={id} ref={drag} onContextMenu={(e)=>rightMenuClick(e)}  onClick={callback.bind(this, { styleSheet, dataAttr, styleAttr, id })}
        style={{
            opacity: isDragging ? 0 : 1,
            cursor: 'move',
            display: 'flex',
            border: localDomId === id ? '3px dotted red' : '',
            ...styleSheet
        }}  >
        <div ref={drop} style={{ display:'inherit',flexDirection:'inherit', width: '100%', height: '100%', border: isOver ? '1px solid #50e3c2' : '' }}>物理元素
        {treeRender(childNodeList)}
        </div>
    </div>

}


export default DivUse;

