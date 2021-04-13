import React from 'react'
import './index.scss'
import { Button } from 'antd';
class Head extends React.Component {
    render() {
        return <div className="head">
            <div className="l">Bolt-D2C</div>
            <div className="r">
                <Button type="primary">预览</Button>
                <Button type="primary">保存</Button>
            </div>
        </div>
    }
}

export default Head;