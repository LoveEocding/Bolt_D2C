import React, { useEffect } from 'react'
import './index.scss'
import ImgComponent from '../../tools-mode/Img';
import ToolDiv from '../../tools-mode/div';
import WheelCompontent from '../../tools-mode/wheel';
import TextCompontent from '../../tools-mode/text';
import DivComponent from '../../tools-mode/container/div';
function Tool() {
    return <div className="tool">
        <div className="base-conent">
            <div className="lable">
               基础组件
            </div>
            <ToolDiv></ToolDiv>
            <ImgComponent></ImgComponent>
            <TextCompontent></TextCompontent>
        </div>
        <div className="base-conent">
            <div className="lable">
               容器组件
            </div>
            <DivComponent></DivComponent>
        </div>
        <div className="base-conent">
            <div className="lable">
               配套组件
            </div>
            <WheelCompontent></WheelCompontent>
        </div>

    </div>
}


export default Tool;