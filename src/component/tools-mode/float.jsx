import React,{ useEffect } from 'react';
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';


function FloatComponent() {
    const [{ isDragging }, drag,preview] = useDrag({
        item: {
            type: 'UseTool.Float',
            id: 'float-origin',
            tag:'float', //针对真实标签
            isHave:false,
            width:38,
            height:38,
            dataAttr: {text:{
                lable: '文本',
                type: 'text',
                value: ''
            }},
            styleAttr: {
                width: {
                    lable: '宽',
                    type: 'text',
                    value: 38
                }, height: {
                    lable: '高',
                    type: 'text',
                    value:38
                }, display: {
                    lable: '盒类型',
                    type: 'select',
                    value: '',
                    select: ['flex', 'block', 'inline-block']
                },
                position: {
                    lable: '定位',
                    type: 'select',
                    value: '',
                    select: ['fixed', 'relative', 'absolute']
                },
                top: {
                    lable: '上定位',
                    type: 'text',
                    value: '',
                },
                left: {
                    lable: '左定位',
                    type: 'text',
                    value: ''
                },
                alignItems: {
                    lable: '主轴方向对齐方式',
                    type: 'select',
                    value: '',
                    select: ['center', 'flex-end', 'flex-start']
                }, justifyContent: {
                    lable: '副轴对齐方式',
                    type: 'select',
                    value: '',
                    select: ['center', 'flex-end', 'flex-start']
                }, marginLeft: {
                    lable: '左间距',
                    type: 'text',
                    value: '0px'
                }, marginTop: {
                    lable: '上间距',
                    type: 'text',
                    value: '0px'
                },
                backgroundColor:{
                    lable:'背景颜色',
                    type:'color',
                    value:'#73aee0',
                    pickerIsShow:false
                },
                color:{
                    lable:'字体颜色',
                    type:'color',
                    value:'#73aee0',
                    pickerIsShow:false,
                },
                zIndex:{
                    lable:'图层层级',
                    type:'text',
                    value:2, 
                },
                backgroundImage:{
                    lable:'背景图片',
                    type:'text',
                    value:''
                }
            },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
        }
    })
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    },[]);
    return <div id="img-origin" ref={drag}
        style={{
            // opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            marginRight: 20,
            height: 64,
            width: 64
        }}>
        <svg t="1602636046429" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1895" width="64" height="64"><path d="M565.248 844.8H191.488a25.6 25.6 0 0 1-25.6-25.6V195.328a25.6 25.6 0 0 1 25.6-25.6H814.08a25.6 25.6 0 0 1 25.6 25.6v370.944a25.6 25.6 0 1 0 51.2 0V195.328a76.8 76.8 0 0 0-76.8-76.8H191.488a76.8 76.8 0 0 0-76.8 76.8V819.2a76.8 76.8 0 0 0 76.8 76.8h373.76a25.6 25.6 0 0 0 0-51.2z" p-id="1896"></path><path d="M640 640m51.2 0l153.6 0q51.2 0 51.2 51.2l0 153.6q0 51.2-51.2 51.2l-153.6 0q-51.2 0-51.2-51.2l0-153.6q0-51.2 51.2-51.2Z" p-id="1897"></path></svg>
        悬浮组件
        </div>

}


export default FloatComponent;

