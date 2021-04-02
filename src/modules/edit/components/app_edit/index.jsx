import React, { useState, useEffect } from 'react';
import { useDrop } from 'react-dnd';
import PhoneList from '@src/phone.config.js'; //机型数据配置文件
import UseTool from '@src/component/tools-use/index.js'; //引入真实使用的组件
import './index.scss';
import { useSelector, useDispatch } from 'react-redux'
import { s_dragEnd } from '@src/store/threeData.js';

function Content() {

    const THREE = useSelector((state) => state.three.value)
    const dispatch = useDispatch()

    //生成状态树
    const [treeData, setTreeData] = useState([]);

    //声明功能属性
    const [extralAttr, setExtralAttr] = useState({});
    const [{ isOver }, drop] = useDrop({
        accept: ['UseTool.Div', 'UseComponent.Div', 'UseTool.Float', 'UseComponent.Float'],
        drop: (item, monitor) => dragEnd(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    const dragEnd = (item, monitor) => {
        let phoneNode = document.getElementById('phone_canvas');
        let { x, y } = monitor.getSourceClientOffset();
        let [originY, originX] = [phoneNode.offsetTop, phoneNode.offsetLeft]
    }

    //状态树渲染
    const treeRender = (tree) => {
        if (tree.length === 0) {
            return '';
        }
        let result = tree.map(item => <item.name></item.name>);
        return result;
    }

    //渲染函数
    return <div className="content" id="content">
        <div className="console">
            <div className="i_info">375</div>
             x &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="i_info">1167</div>
            <div className="btn btn_active">edit</div>
            <div className="btn">preview</div>
            <div className="btn">导入PSD</div>
        </div>
        <div className="content_panel">
            <div className="phone_canvas" id="phone_canvas" onContextMenu={(e) => e.preventDefault()} ref={drop} style={{ width: 375, height: 667, border: isOver ? '1px solid #e80a0a' : '1px solid #f7f7f7' }}>
                {treeRender(treeData)}
            </div>
        </div>
    </div>
}



export default Content;