import React from 'react';
import { useDrag } from 'react-dnd'



function DivUse({styleSheet,dataAttr,styleAttr,callback,id,localDomId}) {
    console.log(id,localDomId);
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'UseComponent.Div', id:id,isHave:true},
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    return <div id={id} key={id}  ref={drag} onClick={callback.bind(this,{styleSheet,dataAttr,styleAttr,id})}
        style={{
            opacity: isDragging ? 0 : 1,
            cursor: 'move',
            marginRight: 20,
            height: 64,
            width: 64,
            border:localDomId===id?'1px dotted red':'',
            ...styleSheet
        }}  >
        点击
        </div>

}


export default DivUse;

