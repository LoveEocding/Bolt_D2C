import React from 'react';
import { useDrag } from 'react-dnd'



function ImgUse({styleSheet,dataAttr,styleAttr,callback}) {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'img', id: 'img-use' },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    return <div id="img-origin"  ref={drag} onClick={callback.bind(this,{styleSheet,dataAttr,styleAttr})}
        style={{
            opacity: isDragging ? 0 : 1,
            cursor: 'move',
            marginRight: 20,
            height: 64,
            width: 64,
            
        },styleSheet}  >
        点击
        </div>

}


export default ImgUse;

