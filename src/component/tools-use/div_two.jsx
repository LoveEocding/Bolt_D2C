import React from 'react';
import { useDrag } from 'react-dnd'



function DivUseTwo({styleSheet,dataAttr,styleAttr,callback,id,localDomId}) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'UseComponent.DivTwo', id:id,isHave:true},
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    return <div id={id} key={id}  ref={drag} onClick={(e)=>callback(e,{styleSheet,dataAttr,styleAttr,id})}
        style={{
            opacity: isDragging ? 0 : 1,
            cursor: 'move',
            display:'flex',
            border:localDomId===id?'1px dotted red':'',
            ...styleSheet
        }}  >
        
        </div>

}


export default DivUseTwo;

