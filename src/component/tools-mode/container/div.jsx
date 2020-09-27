import React from 'react';
import { useDrag } from 'react-dnd'



function DivComponent() {
    const [{ isDragging }, drag] = useDrag({
        item: { type: 'div', id: 'div-origin' },
        collect: monitor => ({
            isDragging: !!monitor.isDragging(),
        }),
    })
    return <div id="div-origin" ref={drag}
        style={{
            opacity: isDragging ? 0.5 : 1,
            cursor: 'move',
            marginRight: 20,
            height: 64,
            width: 64
        }}>
        <svg t="1601172831914" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3193" width="64" height="64"><path d="M928 928h64v64h-64zM864 992h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64zM32 928h64v64H32zM96 864H32v-64h64v64z m0-128H32v-64h64v64z m0-128H32v-64h64v64z m0-128H32v-64h64v64z m0-128H32v-64h64v64z m0-128H32v-64h64v64zM32 32h64v64H32zM864 96h-64V32h64v64z m-128 0h-64V32h64v64z m-128 0h-64V32h64v64z m-128 0h-64V32h64v64z m-128 0h-64V32h64v64z m-128 0h-64V32h64v64zM928 32h64v64h-64zM992 864h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64zM928 544h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0h-64v-64h64v64z m-128 0H96v-64h64v64z" fill="#727272" p-id="3194"></path><path d="M544 928h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64v-64h64v64z m0-128h-64V96h64v64z" fill="#727272" p-id="3195"></path></svg>    
        基础容器
        </div>

}


export default DivComponent;

