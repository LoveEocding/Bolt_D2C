import React from 'react';
import Head from './component/layout/head/index.jsx';
import Container from './component/layout/container/index.jsx';
import './App.css';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import zhCN from 'antd/es/locale/zh_CN';
import 'antd/dist/antd.css';

function App() {
  return (
    <div className="App">
        <Head />
        <Container />
    </div>
  );
}

export default App;
