import React, { useEffect, useRef } from 'react';
import ClassStyle from './index.module.scss';
import MonacoEditor from 'react-monaco-editor';
import { useSelector, useDispatch } from 'react-redux';
import { changeCurrentStyle } from '@src/store/threeData.js';
export default function (props) {
    const extralData = useSelector((state) => state.three.extral);
    const dispatch = useDispatch();
    const editRef = useRef(null);
    useEffect(() => {
        editRef.current.editor.getAction(['editor.action.formatDocument'])._run();//自动格式化
    }, [extralData.currentStyle]);
    const editorDidMount = (editor, monaco) => {
        console.log(editor);
        console.log(monaco);
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