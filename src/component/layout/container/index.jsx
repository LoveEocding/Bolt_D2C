import React from 'react';
import './index.scss';
import Tool from '../tool/index';
import Content from  '../content/index';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
class Container extends React.Component {

     render(){
         return <div className="container">
            <DndProvider backend={HTML5Backend}>
            <Tool />
            <Content />
            </DndProvider>
         </div>
     }
}

export default Container;