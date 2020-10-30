import React, { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import './div.scss';

function DivUseTwo({ styleSheet, dataAttr, styleAttr, callback, childClick, id,parentId,localDomId, dragCallBack, childNodeList }) {
    const [{ isDragging }, drag, preview] = useDrag({
        item: { type: 'UseComponent.DivTwo', id: id, isHave: true, width: styleSheet.width, height: styleSheet.height },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    }, []);
    //设置可以被存放
    const [{ isOver }, drop] = useDrop({
        accept: ['UseTool.DivThree','UseTool.FloatThree', 'UseComponent.DivThree','UseComponent.FloatThree'],
        drop: (item, monitor) => dragEnd(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    //拖拽完成函数
    const dragEnd = (item, monitor) => {
        let parentNode = document.getElementById(id);//二级节点
        let grandNode = document.getElementById(parentId);//一级节点
        let phoneNode = document.getElementById('phone_canvas');//根节点
        let { x, y } = monitor.getSourceClientOffset();
        let [originY, originX] = [phoneNode.offsetTop + parentNode.offsetTop+grandNode.offsetTop, phoneNode.offsetLeft + parentNode.offsetLeft+grandNode.offsetLeft];
        //还有Y轴的滚动的距离
        let scrollY=phoneNode.scrollTop||phoneNode.pageYOffset||0;
        console.log(x, y, originX, originY,scrollY);
        dragCallBack(id, item, y - originY+scrollY, x - originX);
    }
    //渲染子节点
    const treeRender = (tree) => {
        return tree.map(item => <item.name callback={localEditComponent} dataAttr={item.dataAttr} styleAttr={item.styleAttr} styleSheet={item.styleSheet} key={item.id} localDomId={localDomId} id={item.id} childNodeList={item.childNode}></item.name>);
    }
    //点击编辑当前 
    const localEditComponent = (e, item) => {
        console.log('点击子节点');
        childClick(item);
        e.stopPropagation();
    }
    return <div className="use-div2" id={id} key={id} ref={drag} onClick={(e) => callback(e, { styleSheet, dataAttr, styleAttr, id })}
        style={{
            opacity: isDragging ? 0 : 1,
            cursor: 'move',
            display: 'flex',
            position: 'relative',
            border: localDomId === id ? '1px dotted red' : '',
            ...styleSheet,
            backgroundImage: `url(${styleSheet.backgroundImage})`,
            backgroundSize: '100% 100%',
            flexWrap:'wrap'
        }}>
        {/* 上线差距 */}
        <div className="line" style={{ position: 'absolute', left: '50%', top: -1 * styleSheet.marginTop, height: styleSheet.marginTop, width: 1, border: '1px solid red' }}>
            <div style={{ position: 'absolute', top: '50%', left: 3 }}>{styleSheet.marginTop + 'px'}</div>
        </div>
        {/* 左线差距 */}
        <div className='line' style={{ position: 'absolute', top: '50%', left: -1 * styleSheet.marginLeft, width: styleSheet.marginLeft, height: 1, border: '1px solid red' }}>
            <div style={{ position: 'absolute', left: '50%', top: 3 }}>{styleSheet.marginTop + 'px'}</div>
        </div>
        <div ref={drop} style={{
            display: 'inherit', alignItems: 'inherit',
            flexWrap:'inherit',
            justifyContent: 'inherit', flexDirection: 'inherit', width: '100%', minHeight: 'inherit', height: '100%', border: isOver ? '1px solid #50e3c2' : ''
        }}>
            {dataAttr.text.value}
            {treeRender(childNodeList)}
        </div>
    </div>

}


export default DivUseTwo;

