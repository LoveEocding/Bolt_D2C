import React, { useState, useEffect } from 'react';
import './index.scss';
import { useDrop } from 'react-dnd';
import PhoneList from '../../../phone.config.js'; //机型数据配置文件
import { Menu, Dropdown } from 'antd';
import UseTool from '../../tools-use/index.js'; //引入真实使用的组件
import { SketchPicker } from 'react-color';
/**
 * 画布的函数
 */
const drawLine = (width, height) => {
    var canvas = document.getElementById('content_canvas');
    //获得 2d 上下文对象
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#efefef";
    //绘制矩形
    ctx.fillRect(0, 0, width, 20);
    ctx.fillRect(0, 0, 20, height);
    ctx.fillRect(width - 20, 0, 30, height);
    ctx.fillRect(0, height - 20, width, 20);
    let number = 1;
    var imageData = ctx.getImageData(0, 0, width, height);
    for (var i = 0; i < imageData.data.length; i += 4) {
        // 当该像素是透明的,则设置成白色
        if (imageData.data[i + 3] == 0) {
            imageData.data[i] = 255;
            imageData.data[i + 1] = 255;
            imageData.data[i + 2] = 255;
            imageData.data[i + 3] = 255;
        }
    }
    ctx.putImageData(imageData, 0, 0);
    while (true) {
        if (number * 12 >= height) {
            break;
        }
        ctx.beginPath(); //新建一条path
        ctx.moveTo(0, number * 12); //把画笔移动到指定的坐标
        ctx.lineTo(width, number * 12);  //绘制一条从当前位置到指定坐标(200, 50)的直线.
        //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
        ctx.closePath();
        ctx.strokeStyle = "#efefef";
        ctx.stroke(); //绘制路径。
        number++;
    }
    number = 1;
    while (true) {
        if (number * 12 >= width) {
            break;
        }
        ctx.beginPath(); //新建一条path
        ctx.moveTo(number * 12, 0); //把画笔移动到指定的坐标
        ctx.lineTo(number * 12, height);  //绘制一条从当前位置到指定坐标(200, 50)的直线.
        //闭合路径。会拉一条从当前点到path起始点的直线。如果当前点与起始点重合，则什么都不做
        ctx.closePath();
        ctx.strokeStyle = "#efefef";
        ctx.stroke(); //绘制路径。
        number++;
    }
}


function Content() {
    //瀑布流已经有的高度
    var treeHeight = 0;
    //生成状态树
    const [treeData, setTreeData] = useState([]);
    // 声明一个叫 "count" 的 state 变量
    const [phoneIndex, setPhoneIndex] = useState(0);
    //设置当前编辑样式数据
    const [currentStyle, setCurrentStyle] = useState({
        name: '',
        type: '基础元素',
        width: '',
        height: '',
        left: '',
        top: '',
        background: '#333333'
    })
    //颜色选择题是否显示
    const [displayColorPicker, setDisplayColorPicker] = useState(false);
    const [{ isOver }, drop] = useDrop({
        accept: ['UseTool.Img', 'text', 'wheel'],
        drop: (item, monitor) => dragEnd(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    useEffect(() => {
        //drawLine(PhoneList[phoneIndex].width, PhoneList[phoneIndex].height);
    });
    //拖拽函数
    const dragEnd = (item, monitor) => {
        let phoneNode = document.getElementById('phone_canvas');
        let { x, y } = monitor.getSourceClientOffset();
        let [originY, originX] = [phoneNode.offsetTop, phoneNode.offsetLeft]
        let styleSheet = {
            top: y - originY - treeHeight,
            left: x - originX,
            position: 'absolute'
        }
        treeAdd(item.type, styleSheet);
        treeHeight += (y - originY - treeHeight + 64);
        console.log(treeHeight);
    }
    //往状态树添加一个div
    const treeAdd = (type, styleSheet) => {
        let node = undefined;
        switch (type) {
            case 'UseTool.Img':
                node = UseTool.Img;
            default:
        }
        treeData.push({ name: node, styleSheet: styleSheet, childNode: [] });
        setTreeData(treeData);
    }
    //状态树渲染
    const treeRender = (tree) => {
        if (tree.length === 0) {
            return '';
        }
        return tree.map(item => <item.name styleSheet={item.styleSheet} key={Math.random() + 100} >{treeRender(item.childNode)}</item.name>);

    }
    //颜色改变
    const onCompleteColor = (e) => {
        console.log(e);
        currentStyle.background = e.hex;
        setCurrentStyle({ ...currentStyle });
        console.log(currentStyle);
    }
    
    //显示与否颜色选择器
    const colorPickerHand=(boolen)=>{
        setDisplayColorPicker(boolen);
    }  

    //设置机型选择菜单
    const menu = (
        <Menu onClick={({ key }) => setPhoneIndex(key)}>
            {PhoneList.map((item, index) => <Menu.Item key={index}>{item.name}</Menu.Item>)}
        </Menu>
    );
    return <div className="content" id="content">
        <div className="console">
            <Dropdown className="i_lable" overlay={menu} placement="bottomLeft">
                <div onClick={e => e.preventDefault()}>
                    {PhoneList[phoneIndex].name}
                </div>
            </Dropdown>
            <div className="i_info">{PhoneList[phoneIndex].width}</div>
             x &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="i_info">{PhoneList[phoneIndex].height}</div>
        </div>
        <div className="content_panel">
            <div className="phone_canvas" id="phone_canvas" ref={drop} style={{ width: PhoneList[phoneIndex].width, height: PhoneList[phoneIndex].height, border: isOver ? '1px solid #e80a0a' : '1px solid #f7f7f7' }}>
                {/* <canvas style={{ position:'absolute',top:0,left:0  }} width={PhoneList[phoneIndex].width} height={PhoneList[phoneIndex].height} id="content_canvas">
                </canvas> */}
                {treeRender(treeData)}
            </div>
            {/* 属性面板 */}
            <div className="panel_attributes">
                <div className="panel_head" >组件属性</div>
                <div className="describe">
                    <div className="lable">名称：</div>
            <div className="value">选中元素</div>
                </div>
                <div className="describe">
                    <div className="lable">类型：</div>
                    <div className="value">基础组件</div>
                </div>
                <div className="describe">
                    <div className="lable">位置(父元素定位)：</div>
                    <div className="value"><input /></div>
                    <div className="value"><input /></div>
                </div>
                <div className="describe">
                    <div className="lable">大小：</div>
                    <div className="value"><input /></div>
                    <div className="value"><input /></div>
                </div>
                <div className="describe">
                    <div className="lable">背景颜色：</div>
                    <div className="value" onClick={()=>colorPickerHand(true)}>{currentStyle.background}</div>
                    <div onClick={()=>colorPickerHand(true)} style={{ width:30,height:30,backgroundColor:currentStyle.background }}></div>
                    {displayColorPicker ? <div style={{ position: 'absolute',top:50, zIndex: 2 }}>
                        <div style={{
                            position: 'fixed',
                            top:0,
                            right:0,
                            bottom:0,
                            left:0,
                        }} onClick={()=>colorPickerHand(false) } />
                        <SketchPicker color={currentStyle.background} onChangeComplete={onCompleteColor} />
                    </div> : null} 
                </div>
            </div>
        </div>

    </div>
}




export default Content;