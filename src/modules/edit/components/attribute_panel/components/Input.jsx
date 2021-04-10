import { Input } from 'antd';
import React from 'react';
import { useState } from 'react';

export default function (props) {
    return <Input addonBefore="文本" value={props.value} defaultValue="" />
}