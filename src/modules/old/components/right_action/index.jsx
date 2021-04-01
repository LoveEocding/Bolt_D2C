/**
 * 右边操作台
 */
import React from 'react';
import ClassStyle from './index.module.scss';
import { useState } from 'react'
export default function (props) {

    //收缩
    const [expend, setExpend] = useState(true);

    //额外宽度
    const [dragWidth, setDragWidth] = useState(0);

    //鼠标按住
    const handerMouseDown = (e) => {

        let startX = e.clientX
        let move = moveEvent => {
            moveEvent.preventDefault()
            moveEvent.stopPropagation()
            const offset = startX - moveEvent.clientX
            setDragWidth(dragWidth + offset);
        }

        let up = moveEvent => {
            document.removeEventListener('mousemove', move, true)
            document.removeEventListener('mouseup', up, true)
        }
        document.addEventListener('mousemove', move, true)
        document.addEventListener('mouseup', up, true)
    }


    return <div style={{ width: `calc(20vw + ${dragWidth}px)` }} className={ClassStyle.right_action} >
        <div className={ClassStyle.line}>
            <div className={ClassStyle.expend} onMouseDown={handerMouseDown} >
                <div className={ClassStyle.t}></div>
            </div>
        </div>
        <div className={ClassStyle.main}></div>
    </div>
}