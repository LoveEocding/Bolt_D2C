import React, { useEffect } from 'react'
import './index.scss'
import ToolDiv from '../../tools-mode/div';
import ToolFloat from '../../tools-mode/float';
import WheelCompontent from '../../tools-mode/wheel';
//二级组件 存放于一级组件中
import ToolDivTwo from '../../tools-mode/div_two';
import ToolFloatTwo from '../../tools-mode/float_two';
//三级组件 存放二级组件中
import ToolDivThree from '../../tools-mode/div_three';
import ToolFloatThree from '../../tools-mode/float_three';
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
        <div className="base-conent">
            <div className="lable">
               三级组件
            </div>
            <ToolDivThree></ToolDivThree>
            <ToolFloatThree></ToolFloatThree>
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