import React from 'react';
import { useDragLayer } from 'react-dnd';
const layerStyles = {
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 100,
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
};
function getItemStyles(initialOffset, currentOffset, isSnapToGrid) {
  if (!initialOffset || !currentOffset) {
      return {
          display: 'none',
      };
  }
  let { x, y } = currentOffset;
  const transform = `translate(${x}px, ${y}px)`;
  return {
      transform,
      WebkitTransform: transform,
  };
}
function DragLayerComponent(props) {
  const { itemType, isDragging, item, initialOffset, currentOffset, } = useDragLayer((monitor) => ({  
    item: monitor.getItem(),
    itemType: monitor.getItemType(),
    initialOffset: monitor.getInitialSourceClientOffset(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));
  console.log(item);
  let width=item&&item.width?item.width:375;
  let height=item&&item.height?item.height:60;
  return (<div style={layerStyles}>
    <div style={{ width:width,height:height,border:'1px solid red',...getItemStyles(initialOffset, currentOffset,true)}}>
        
    </div>
  </div>);
}

export default DragLayerComponent;