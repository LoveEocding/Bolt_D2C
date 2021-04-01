/**
 * 属性编辑面板
 */
import React from 'react';
import ClassStyle from './index.module.scss';
export default function ({ currentStyle }) {
    return <div className={ClassStyle.attribute_panel}>
        <div className="panel_attributes">
            <div className="panel_head" >样式属性</div>
            {currentStyle.map(item =>
                <>

                    {item.type === 'color' ? <div className="describe">
                        <div className="lable">{item.lable}：</div>
                        <div className="value" onClick={() => colorPickerHand(true, item.mean)}>{item.value}</div>
                        <div onClick={() => colorPickerHand(true, item.mean)} style={{ width: 30, height: 30, backgroundColor: item.value }}></div>
                        {item.pickerIsShow ? <div style={{ position: 'absolute', top: 50, zIndex: 2 }}>
                            <div style={{
                                position: 'fixed',
                                top: 0,
                                right: 0,
                                bottom: 0,
                                left: 0,
                            }} onClick={() => colorPickerHand(false, item.mean)} />
                            <SketchPicker color={item.value} onChangeComplete={(event) => onCompleteColor(event, item.mean)} />
                        </div> : null}
                    </div> :
                        <div className="describe">
                            <div className="lable">{item.lable}：</div>
                            {item.type === 'select' ? <Dropdown className="value" overlay={() => styleMenu(item.mean, item.select)} placement="bottomLeft">
                                <div onClick={e => e.preventDefault()}>
                                    {item.value}
                                </div>
                            </Dropdown> : ''}
                            {item.type === 'text' ? <div className="value" ><input value={item.value} mean={item.mean} onChange={(event) => styleChange(event, item.mean)} /></div> : ''}

                        </div>}
                </>
            )}




        </div>
    </div>
}