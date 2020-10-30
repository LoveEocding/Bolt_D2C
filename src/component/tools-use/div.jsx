import React ,{ useState,useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

import UseTool from '../tools-use/index.js'; //引入真实使用的组件
import './div.scss';
function DivUse({ styleSheet, dataAttr, styleAttr, callback,childClick,id, localDomId, dragCallBack, childNodeList }) {
    //设置可以被拖拽
    const [{ isDragging }, drag,preview] = useDrag({
        item: { type: 'UseComponent.Div', id: id, isHave: true,width:styleSheet.width,height:styleSheet.height },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    },[]);
    //设置可以被存放
    const [{ isOver }, drop] = useDrop({
        accept: ['UseTool.DivTwo', 'UseTool.FloatTwo','UseComponent.FloatTwo','UseComponent.DivTwo'],
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
         //还有Y轴的滚动的距离
        let scrollY=phoneNode.scrollTop||phoneNode.pageYOffset||0;
        console.log(x, y, originX, originY,scrollY);
        dragCallBack(id, item, y - originY+scrollY, x - originX);
    }
    //渲染子节点
    const treeRender = (tree) => {
        return tree.map(item => <item.name callback={localEditComponent} childClick={childClick} dataAttr={item.dataAttr} styleAttr={item.styleAttr} styleSheet={item.styleSheet} key={item.id} localDomId={localDomId} id={item.id} parentId={id} childNodeList={item.childNode} dragCallBack={dragCallBack} ></item.name>);
    }
    //点击编辑当前 
    const localEditComponent = (e,item) => {
       console.log('点击子节点');
       childClick(item);
       e.stopPropagation();
    }
    //点击编辑当前样式
    const localClick=(e)=>{
        callback({ styleSheet, dataAttr, styleAttr, id });
        e.stopPropagation();
    }
    //右键点击事件
    const rightMenuClick=(e)=>{
        e.preventDefault();
        console.log('右键点击');
    }
    return<>
     <div className="use-div" id={id} key={id} ref={drag} onContextMenu={(e)=>rightMenuClick(e)}  onClick={(e)=>localClick(e)}
        style={{
            opacity: isDragging ? 0 : 1,
            cursor: 'move',
            display: 'flex',
            position:'relative',
            border: localDomId === id ? '2px solid red' : '',
            ...styleSheet,
            backgroundImage:`url(${styleSheet.backgroundImage})`,
            backgroundSize:'100% 100%',
            flexWrap:'wrap'
        }}  >
        {/* 上线差距 */}
        <div className='top-line'  style={{  position:'absolute',left:'50%',top:-1*styleSheet.marginTop,height:styleSheet.marginTop,width:1,border:'1px solid red'}}>
            <div style={{ position:'absolute',top:'50%',left:3,fontSize:12 }}>{ styleSheet.marginTop+'px' }</div> 
        </div>
            {/* 左线差距 */}
        <div className='line' style={{ position: 'absolute', top: '50%', left: -1 * styleSheet.marginLeft, width: styleSheet.marginLeft, height: 1, border: '1px solid red' }}>
            <div style={{ position: 'absolute', left: '50%', top: 3,fontSize:12 }}>{styleSheet.marginLeft + 'px'}</div>
        </div>
        <div className="use-div-content" ref={drop} style={{ display:'inherit',alignItems: 'inherit',flexWrap:'inherit',
        justifyContent:'inherit',flexDirection:'inherit', width: '100%', height: '100%', border: isOver ? '1px solid #50e3c2' : '' }}> 
        {dataAttr.text.value}
        {treeRender(childNodeList)}
        </div>
    </div>
    </>

}


export default DivUse;

