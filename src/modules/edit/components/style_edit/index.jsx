import React, { useEffect, useRef } from 'react';
import ClassStyle from './index.module.scss';
import MonacoEditor from 'react-monaco-editor';
import { useSelector, useDispatch } from 'react-redux';
import { editDomStyle } from '@src/store/threeData.js';
import { message } from 'antd';
export default function (props) {
    const extralData = useSelector((state) => state.three.extral);
    const dispatch = useDispatch();
    const editRef = useRef(null);
    let saveVal = '';
    useEffect(() => {
        editRef.current.editor.getAction(['editor.action.formatDocument'])._run();//自动格式化
    }, [extralData.currentStyle]);
    const editorDidMount = (editor, monaco) => {
        //监听保存操作
        var myBinding = editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, function () {
            try {
                console.log("🚀 ~ file: index.jsx ~ line 21 ~ myBinding ~ saveVal", editor.getValue())
                dispatch(editDomStyle({ value: JSON.parse(editor.getValue()) }));
            } catch (e) {
                console.log("🚀 ~ file: index.jsx ~ line 21 ~ myBinding ~ e", e)
                message.error('保存失败!格式错误非标准的JSON');
            }

        });
    }
    return <div className={ClassStyle.style_edit}>
        <MonacoEditor
            height="800"
            language="json"
            ref={editRef}
            value={JSON.stringify(extralData.currentStyle)}
            editorDidMount={(editor, monaco) => editorDidMount(editor, monaco)}
        />
        <div className={ClassStyle.save}>ctrl+s保存</div>
    </div>
}