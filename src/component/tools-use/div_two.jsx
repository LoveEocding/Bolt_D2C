import React ,{useEffect} from 'react';
import { useDrag } from 'react-dnd'
import { getEmptyImage } from 'react-dnd-html5-backend';
import './div.scss';

function DivUseTwo({styleSheet,dataAttr,styleAttr,callback,id,localDomId}) {
    const [{ isDragging }, drag,preview] = useDrag({
        item: { type: 'UseComponent.DivTwo', id:id,isHave:true,width:styleSheet.width,height:styleSheet.height},
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    useEffect(() => {
        preview(getEmptyImage(), { captureDraggingState: true });
    },[]);

    return <div className="use-div2" id={id} key={id}  ref={drag} onClick={(e)=>callback(e,{styleSheet,dataAttr,styleAttr,id})}
        style={{
            opacity: isDragging ? 0 : 1,
            cursor: 'move',
            display:'flex',
            position:'relative',
            border:localDomId===id?'1px dotted red':'',
            ...styleSheet
        }}>
         {/* 上线差距 */}
         <div  className="line"  style={{  position:'absolute',left:'50%',top:-1*styleSheet.marginTop,height:styleSheet.marginTop,width:1,border:'1px solid red'}}>
            <div style={{ position:'absolute',top:'50%',left:3 }}>{ styleSheet.marginTop+'px' }</div> 
         </div>
         {/* 左线差距 */}
         <div className='line'  style={{  position:'absolute',top:'50%',left:-1*styleSheet.marginLeft,width:styleSheet.marginLeft,height:1,border:'1px solid red'}}>
            <div style={{ position:'absolute',left:'50%',top:3 }}>{ styleSheet.marginTop+'px' }</div> 
         </div>
        </div>

}


export default DivUseTwo;

