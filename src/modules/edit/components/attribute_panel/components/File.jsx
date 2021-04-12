import { Upload } from 'antd';
import React from 'react';
import { useState, message } from 'react';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

/**
 * 
 * @param {*} props 
 * 图片上传组件
 */
export default function (props) {
    const [loading, setLoading] = useState(false);
    const [imageUrl, setImgUrl] = useState('');
    //上传显示
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );
    //图片值的改变
    const picChange = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            //info.event 响应事件

        }
    }
    //图片上传前
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG/gif file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 1;
        if (!isLt2M) {
            message.error('Image must smaller than 1MB!');
        }
        return isJpgOrPng && isLt2M;
    }
    return <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        beforeUpload={beforeUpload}
        onChange={picChange}
    >
        {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
    </Upload>
}