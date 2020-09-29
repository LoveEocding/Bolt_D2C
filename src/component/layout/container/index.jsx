import React from 'react';
import './index.scss';
import Tool from '../tool/index';
import Content from  '../content/index';
class Container extends React.Component {

     render(){
         return <div className="container">
            <Tool />
            <Content />
         </div>
     }
}

export default Container;