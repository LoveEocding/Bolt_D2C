import React from 'react';
import Head from '../../component/layout/head/index.jsx';
import Container from '../../component/layout/container';
import Style from './index.module.scss';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
//替代游览器拖拽默认样式
import UseDragLayer from '../../component/drag-layer';
export default function App() {
    return (
        <DndProvider backend={HTML5Backend}>
            <UseDragLayer></UseDragLayer>
            <div className={Style.app}>
                <Head />
                <Container />
            </div>
        </DndProvider>
    );
}

