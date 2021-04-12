//根据不同属性选择不同的编辑组件
import React from 'react';
import Input from './components/Input';
import File from './components/File';
import { useSelector, useDispatch } from 'react-redux';
import { editDomAttr } from '@src/store/threeData.js'
//根据不同值选择不同的编辑组件
export default (type, value) => {

    const dispatch = useDispatch();
    //值改变
    const handerValueChange = (val, key) => {
        dispatch(editDomAttr({ value: { key: key, val: val } }));
    }

    switch (type) {
        case 'text':
            return <Input callback={handerValueChange} value={value} />
        case 'src':
            return <div style={{ display: 'flex', alignItems: 'center' }}> <span style={{ width: 60 }}>图片：</span> <File callback={handerValueChange} value={value} /></div>
    }
}