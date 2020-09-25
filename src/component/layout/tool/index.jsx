import React ,{useEffect} from 'react'
import './index.scss'
import { useDrag } from 'react-dnd'


function Tool() {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'btn',value:'大转盘' },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    return <div className="tool"><div className="btn" id="btn" ref={drag}
        style={{
            opacity: isDragging ? 0.5 : 1,
            fontSize: 25,
            fontWeight: 'bold',
            cursor: 'move',
        }}>大转盘</div></div>
}


export default Tool;