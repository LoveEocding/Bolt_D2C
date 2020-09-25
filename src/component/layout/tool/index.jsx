import React ,{useEffect} from 'react'
import './index.scss'
import { useDrag } from 'react-dnd'
import ImgComponent from '../../tools/Img';
import WheelCompontent from '../../tools/wheel';
import TextCompontent from '../../tools/text';
function Tool() {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'btn',value:'大转盘' },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    return <div className="tool">
        <WheelCompontent></WheelCompontent>
        <ImgComponent></ImgComponent>
        <TextCompontent></TextCompontent>
        </div>
}


export default Tool;