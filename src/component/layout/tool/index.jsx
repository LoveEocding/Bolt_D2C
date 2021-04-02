import React, { useEffect } from 'react'
import './index.scss'
import ToolDiv from '../../tools-mode/div';
import ToolFloat from '../../tools-mode/float';
import WheelCompontent from '../../tools-mode/wheel';
//二级组件 存放于一级组件中
import ToolDivTwo from '../../tools-mode/div_two';
import ToolFloatTwo from '../../tools-mode/float_two';
function Tool() {
    return <div className="tool">
        <div className="base-conent">
            <div className="lable">
                一级组件
            </div>
            <ToolDiv></ToolDiv>
            <ToolFloat></ToolFloat>
        </div>
        <div className="base-conent">
            <div className="lable">
                二级组件
            </div>
            <ToolDivTwo></ToolDivTwo>
            <ToolFloatTwo></ToolFloatTwo>
        </div>

    </div>
}


export default Tool;