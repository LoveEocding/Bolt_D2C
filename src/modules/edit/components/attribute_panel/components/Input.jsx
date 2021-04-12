import React from 'react';
import { useState } from 'react';
import { Input } from 'antd';

export default function ({ value, callback }) {
    const [localVal, setLocalVal] = useState(value);
    //值变化
    const valChange = (e) => {
        let val = e.target.value;
        callback(val, 'text');
        setLocalVal(val);
    }
    return <Input addonBefore="文本" onChange={valChange} value={localVal} defaultValue="" />
}