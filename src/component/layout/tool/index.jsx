import React, { useEffect } from 'react'
import './index.scss'
import { useDrag } from 'react-dnd'
import ImgComponent from '../../tools-mode/Img';
import WheelCompontent from '../../tools-mode/wheel';
import TextCompontent from '../../tools-mode/text';
import DivComponent from '../../tools-mode/container/div';
function Tool() {
    return <div className="tool">
        <div className="base-conent">
            <div className="lable">
               基础组件
            </div>
            <WheelCompontent></WheelCompontent>
            <ImgComponent></ImgComponent>
            <TextCompontent></TextCompontent>
        </div>
        <div className="base-conent">
            <div className="lable">
               容器组件
            </div>
            <DivComponent></DivComponent>
        </div>

    </div>
}


export default Tool;