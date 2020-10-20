import React,{useEffect} from 'react';
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';

function DivTwoComponent() {
    const [{ isDragging }, drag,preview] = useDrag({
        item: {
            type: 'UseTool.DivTwo',
            id: 'div-origin',
            tag:'div',
            isHave:false,
            dataAttr: [{
                lable: '图片链接',
                type: 'text',
                value: ''
            }],
            width:25,
            height:25,
            styleAttr: {
                width:{
                   lable:'宽',
                   type:'text',
                   value:25
                },
                height: {
                    lable: '高',
                    type: 'text',
                    value:25
                },
                flexDirection:{
                    lable: '设置主轴方向',
                    type: 'select',
                    value: 'row',
                    select: ['column', 'row']
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
                },marginTop: {
                    lable: '上间距',
                    type: 'text',
                    value:0
                },
                marginLeft: {
                    lable: '左间距',
                    type: 'text',
                    value:0
                },
                paddingTop:{
                    lable:'内边距-上',
                    type:'text',
                    value:5,
                },
                paddingBottom:{
                    lable:'内边距-下',
                    type:'text',
                    value:5,
                },
                paddingLeft:{
                    lable:'内边距-左',
                    type:'text',
                    value:5,
                },
                paddingRight:{
                    lable:'内边距-右',
                    type:'text',
                    value:5,
                },
                backgroundColor:{
                    lable:'背景颜色',
                    type:'color',
                    value:'#f5c1c1',
                    pickerIsShow:false
                },
                color:{
                    lable:'字体颜色',
                    type:'color',
                    value:'#FFFFFF',
                    pickerIsShow:false,
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
        <svg t="1602641269835" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2866" width="64" height="64"><path d="M740.867 908.41H283.132L54.265 512l228.867-396.41h457.735L969.735 512 740.867 908.41z m-400-100h342.266L854.265 512 683.133 215.59H340.867L169.735 512l171.132 296.41z" p-id="2867" fill="#8a8a8a"></path></svg>
        单元组件
        </div>

}


export default DivTwoComponent;

