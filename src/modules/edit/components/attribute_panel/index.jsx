/**
 * 属性面板包括文本图片链接等.
 */
import React from 'react';
import { Select, Menu, Input } from 'antd';
import ClassStyle from './index.module.scss';
import { DOM_TYPES } from '@src/domtypes/index.js';
import { useSelector, useDispatch } from 'react-redux';
import EditComponentByType from './attributes';
const { Option } = Select;
const { SubMenu } = Menu;
//组件分类菜单
const DomTypes = DOM_TYPES.map(item => <Option value="item">{item}</Option>);
export default function (props) {
    //当前编辑的属性
    const currentAttr = useSelector((state) => state.three.extral.currentAttributes);
    //分类改变选择
    function handleTypeChange(value) {
        console.log(`selected ${value}`);
    }
    //当前编辑属性组件
    const AttrEdit = Object.keys(currentAttr).map(item => EditComponentByType(item, currentAttr[item]));
    console.log("🚀 ~ file: index.jsx ~ line 24 ~ AttrEdit", AttrEdit)

    return <div className={ClassStyle.attribute_panel}>
        <div className={ClassStyle.lay_top}>
            <div className={ClassStyle.lable}>当前组件类型:</div>
            <div className={ClassStyle.form_item}>
                <span className={ClassStyle.form_lable}>类型转换</span>
                <Select defaultValue="" style={{ flex: 1 }} onChange={handleTypeChange}>
                    {DomTypes}
                </Select>
            </div>
        </div>
        {/* 属性 */}
        <Menu
            style={{ width: '100%', padding: 0 }}
            defaultSelectedKeys={['sub1']}
            defaultOpenKeys={['sub1']}
            mode="inline"
        >
            <SubMenu key="sub1" title="基础属性" style={{ background: '#c8dcfa' }}>
                <div style={{ padding: '10px 0px' }}>
                    {AttrEdit}
                </div>

            </SubMenu>
            <SubMenu key="sub2" title="高级属性" style={{ background: '#c8dcfa' }}>

            </SubMenu>
        </Menu>
    </div>
}