import React from 'react';
import { useDrag } from 'react-dnd'



function DivComponent() {
    const [{ isDragging }, drag] = useDrag({
        item: {
            type: 'UseTool.Div',
            id: 'img-origin',
            isHave:false,
            dataAttr: [{
                lable: '图片链接',
                type: 'text',
                value: ''
            }],
            styleAttr: {
                width: {
                    lable: '宽',
                    type: 'text',
                    value: '20px'
                }, height: {
                    lable: '高',
                    type: 'text',
                    value: '20px'
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
                    value:'#FFFFFF'
                },
                color:{
                    lable:'字体颜色',
                    type:'color',
                    value:'#FFFFFF'
                }
            },
            collect: monitor => ({
                isDragging: !!monitor.isDragging(),
            }),
        }
    })
    return <div id="img-origin" ref={drag}
        style={{
            // opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            marginRight: 20,
            height: 64,
            width: 64
        }}>
        <svg t="1602574533973" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3033" width="64" height="64"><path d="M512 549.76a34.56 34.56 0 0 1-16-3.84L295.04 429.44a30.72 30.72 0 0 1-16-27.52V169.6a30.72 30.72 0 0 1 16-27.52L496 26.24a32 32 0 0 1 32 0l200.96 115.84a30.72 30.72 0 0 1 16 27.52v232.32a30.72 30.72 0 0 1-16 27.52L528 545.92a34.56 34.56 0 0 1-16 3.84zM343.04 384L512 481.28 680.96 384V188.16L512 90.24 343.04 188.16zM256 992a27.52 27.52 0 0 1-16-4.48l-204.8-115.84a33.28 33.28 0 0 1-16-28.16V611.84a33.28 33.28 0 0 1 16-28.16L236.8 467.84a32 32 0 0 1 32 0l200.96 115.84a33.28 33.28 0 0 1 16 28.16v231.68a33.28 33.28 0 0 1-16 28.16L268.8 987.52a30.08 30.08 0 0 1-12.8 4.48z m-172.8-166.4L256 922.88l165.76-97.28V630.4L256 532.48 83.2 630.4zM771.2 992a30.08 30.08 0 0 1-16-4.48l-200.96-115.84a33.28 33.28 0 0 1-16-28.16V611.84a33.28 33.28 0 0 1 16-28.16l200.96-115.84a32 32 0 0 1 32 0l201.6 115.84a33.28 33.28 0 0 1 16 28.16v231.68a33.28 33.28 0 0 1-16 28.16l-201.6 115.84a27.52 27.52 0 0 1-16 4.48z m-168.96-166.4l168.96 97.28 169.6-97.28V630.4l-169.6-97.92-168.96 97.92z" fill="#707070" p-id="3034"></path></svg>
        基础单元
        </div>

}


export default DivComponent;

