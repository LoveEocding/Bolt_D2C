import React, { useState, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import { Drawer, message, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux'
import './index.scss';
import { importData } from '@src/store/threeData.js';
import { threeRender } from '@src/map/react.jsx';

function Content() {
    const treeData = useSelector((state) => state.three.value)
    const dispatch = useDispatch()
    const [astShow, setAstShow] = useState(false); //导入AST面板显示与否
    const [analysisShow, setAnalysisShow] = useState(false); //解析蒙层
    const astInputRef = useRef(null);
    let loading = null;
    let AstText = '';//本地AST数据
    //声明一个变量用于保存键盘值
    let keysStr = '';
    const [{ isOver }, drop] = useDrop({
        accept: ['UseTool.Div', 'UseComponent.Div', 'UseTool.Float', 'UseComponent.Float'],
        drop: (item, monitor) => dragEnd(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })
    //拖拽函数 两种状态 已经在内容模块的、不在内容模块的
    const dragEnd = (item, monitor) => {
        let phoneNode = document.getElementById('phone_canvas');
        let { x, y } = monitor.getSourceClientOffset();
    }
    //声明周期监听键盘事件
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        //清除监听事件
        return function cleanListener() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);
    //键盘事件
    const handleKeyDown = (e) => {
        console.log(e);
        clearTimeout(cutClear);
        var cutClear = setTimeout(() => {
            keysStr = '';
        }, 1000);
        keysStr += e.key;
        //触发复制操作
        if (keysStr === 'Controlv') {
            astInputRef.current.focus();
        }

    }
    //Ast文本变化
    const astTextHandleChange = (event) => {
        console.log(event);
        AstText = event.target.value;
        console.log(AstText);
        try {
            let loading = message.loading('拼命解析中..', 0);
            setTimeout(loading, 2000);
            setAstShow(false);
            dispatch(importData({ data: JSON.parse(AstText) }));//发布store
        }
        catch (e) {
            setTimeout(loading, 50);
            message.error('格式错误非标准的JSON,请检查');
            setAnalysisShow(false);
        }
    }

    //渲染主体
    return <div className="content" id="content">
        <div className="console">
            <div className="i_info">375</div>
             x &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="i_info">1167</div>
            <div className="btn btn_active">编辑模式</div>
            <div className="btn">预览模式</div>
            <div className="btn" onClick={() => { setAstShow(true); }}>导入AST</div>
            <div className="btn">导出代码</div>

        </div>
        <div className="content_panel">
            <div className="phone_canvas" onKeyDown={(e) => handleKeyDown(e)} id="phone_canvas" onContextMenu={(e) => e.preventDefault()} ref={drop} style={{ border: isOver ? '1px solid #e80a0a' : '1px solid #f7f7f7' }}>
                {threeRender(treeData)}
            </div>
        </div>
        <Drawer
            placement="top"
            closable={false}
            onClose={() => { setAstShow(false) }}
            visible={astShow}
            maskClosable={!analysisShow}
            key='ast_drawer'
        >
            <h1 style={{ textAlign: 'center', color: '#928686' }}>Crtl+V 导入AST数据</h1>
            {/* 隐藏属性用于复制剪切板的 */}
            <textarea onChange={(e) => astTextHandleChange(e)} ref={astInputRef} style={{ width: '100%', border: 'none', position: 'absolute', top: -1000 }} name="ast" id="" cols="30" rows="10"></textarea>
        </Drawer>
    </div>

}



export default Content;