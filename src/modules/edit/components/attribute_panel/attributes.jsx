//根据不同属性选择不同的编辑组件
import React from 'react';
import Input from './components/Input';
import File from './components/File';


//根据不同值选择不同的编辑组件
export default (type, value) => {

    // const dispatch = useDispatch();
    //值改变
    const handerValueChange = (val, key) => {

    }

    switch (type) {
        case 'text':
            return <Input callback={handerValueChange} value={value} />
        case 'src':
            return <File callback={handerValueChange} value={value} />
    }
}