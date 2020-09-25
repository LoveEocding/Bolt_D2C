import React, { useState, useEffect } from 'react';
import './index.scss';
import { useDrop } from 'react-dnd';
import PhoneList from '../../../phone.config.js';
import { Menu, Dropdown } from 'antd';

/**
 * 画布的函数
 */
const drawLine = (width,height) => {
    var canvas = document.getElementById('content_canvas');
    //获得 2d 上下文对象
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#efefef";
    //绘制矩形
    ctx.fillRect(0, 0, width, 20);
    ctx.fillRect(0, 0, 20, height);
    ctx.fillRect(width-20, 0, 30, height);
    ctx.fillRect(0, height-20, width, 20);
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
        if (number * 12 >=width) {
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

/**
 * 拖拽放置函数
 */
const dragEnd = (item, monitor) => {
    let { x, y } = monitor.getDifferenceFromInitialOffset();
    let tempNode = document.createElement('div');
    let originNode = document.getElementById(item.type);
    console.log(originNode.offsetLeft, originNode.offsetTop);
    console.log(x, y);
    tempNode.style.position = 'absolute';
    tempNode.style.left = (x + originNode.offsetLeft) + 'px';
    tempNode.style.top = (y + originNode.offsetTop) + 'px';
    tempNode.innerHTML = item.value;
    tempNode.style.width = '100px';
    tempNode.style.height = '50px';
    tempNode.style.background = "#e24c4c";
    document.getElementById('content').appendChild(tempNode);
}


function Content() {
    // 声明一个叫 "count" 的 state 变量
    const [phoneIndex, setPhoneIndex] = useState(0);
    const [{ isOver }, drop] = useDrop({
        accept: 'btn',
        drop: (item, monitor) => dragEnd(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    useEffect(() => {
        drawLine(PhoneList[phoneIndex].width,PhoneList[phoneIndex].height);
    });
    //设置机型选择菜单
    const menu = (
        <Menu onClick={({key}) => setPhoneIndex(key)}>
            {PhoneList.map((item, index) => <Menu.Item key={index}>{item.name}</Menu.Item>)}
        </Menu>
    );
    return <div className="content" id="content">
        <div className="console">
            <Dropdown  className="i_lable" overlay={menu} placement="bottomLeft">
                <div onClick={e => e.preventDefault()}>
                    { PhoneList[phoneIndex].name }
                </div>
            </Dropdown>
            <div className="i_info">{PhoneList[phoneIndex].width}</div>
             x &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="i_info">{PhoneList[phoneIndex].height}</div>
        </div>
        <div className="phone_canvas" ref={drop} style={ { width:PhoneList[phoneIndex].width,height:PhoneList[phoneIndex].height } }>
            <canvas width={PhoneList[phoneIndex].width} height={PhoneList[phoneIndex].height} id="content_canvas">
            </canvas>
        </div>

    </div>
}




export default Content;