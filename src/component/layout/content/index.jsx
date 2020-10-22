import React, { useState, useEffect } from 'react';
import './index.scss';
import { useDrop } from 'react-dnd';
import PhoneList from '../../../phone.config.js'; //机型数据配置文件
import { Menu, Dropdown } from 'antd';
import UseTool from '../../tools-use/index.js'; //引入真实使用的组件
import { SketchPicker } from 'react-color';

function Content() {
    //瀑布流已经有的高度
    const [treeHeight, setTreeHeight] = useState(0);
    //历史路由状态树
    const [routerData, setRouteData] = useState([]);
    //生成状态树
    const [treeData, setTreeData] = useState([]);
    // 声明一个叫 "count" 的 state 变量
    const [phoneIndex, setPhoneIndex] = useState(0);
    //设置样式属性 数组
    const [currentStyle, setCurrentStyle] = useState([]);
    //声明一个当前正在编辑的ID
    const [localDomId, setLocalDomId] = useState('');
    //声明功能属性
    const [extralAttr, setExtralAttr] = useState({});
    const [{ isOver }, drop] = useDrop({
        accept: ['UseTool.Div', 'UseComponent.Div', 'UseTool.Float', 'UseComponent.Float'],
        drop: (item, monitor) => dragEnd(item, monitor),
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    })

    //声明周期监听键盘事件
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        //清除监听事件
        return function cleanListener() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, []);
    useEffect(() => {
        let styleSheet = {};
        for (let i in currentStyle) {
            styleSheet[currentStyle[i].mean] = currentStyle[i].value;
        }
        window.styleSheet = styleSheet;
        window.localDomId = localDomId;
        window.treeData = treeData;
    }, [currentStyle], localDomId, treeData)
    //鼠标监听函数
    const handleKeyDown = (e) => {
        let styleSheet = window.styleSheet;
        let id = window.localDomId;
        switch (e.code) {
            case 'ArrowRight':
                arrowDir('ArrowRight', id, styleSheet);
                break;
            case 'ArrowLeft':
                arrowDir('ArrowLeft', id, styleSheet);
                break;
            case 'ArrowUp':
                arrowDir('ArrowUp', id, styleSheet);
                break;
            case 'ArrowDown':
                arrowDir('ArrowDown', id, styleSheet);
                break;
            case 'Delete':
                deleteNode(id, window.treeData);
                break;
        }
    };
    //上下左右调节间距
    const arrowDir = (dir, id, styleSheet) => {
        switch (dir) {
            case 'ArrowLeft':
                styleSheet.left--;
                styleSheet.marginLeft--;
                break;
            case 'ArrowRight':
                styleSheet.left++;
                styleSheet.marginLeft++;
                break;
            case 'ArrowUp':
                styleSheet.top--;
                styleSheet.marginTop--;
                break;
            case 'ArrowDown':
                styleSheet.top++;
                styleSheet.marginTop++;
                break;
        }
        setTreeData([].concat(insertNodeStyle(id, window.treeData, styleSheet)));
    }
    //拖拽函数 两种状态 已经在内容模块的、不在内容模块的
    const dragEnd = (item, monitor) => {
        let phoneNode = document.getElementById('phone_canvas');
        let { x, y } = monitor.getSourceClientOffset();
        let [originY, originX] = [phoneNode.offsetTop, phoneNode.offsetLeft]
        if (item.type === 'UseTool.Float' || item.type === 'UseComponent.Float') {
            floatCeilCeilAddOrInsert(item, x, y, originX, originY);
        } else {
            containerCeilAddOrInsert(item, x, y, originX, originY);
        }

    }
    //一级组件添加一个子结点
    const childDragBack = (parentId, item, y, x) => {

        if (item.tag === 'float') {
            if (item.isHave) {
                let resultSheet = findNode(item.id, treeData).styleSheet;
                resultSheet.top = y;
                resultSheet.left = x;
                console.log(resultSheet);
                insertNodeStyle(item.id, treeData, resultSheet);
            } else {
                treeAdd(parentId, item, y, x);
            }
        } else {
            if (item.isHave) {
                let resultSheet = findNode(item.id, treeData).styleSheet;
                let resultxy = getLastCeilXy(parentId, treeData, item.id, item.isHave);
                resultSheet.marginTop = y;
                resultSheet.marginLeft = x - resultxy.x - resultxy.width;
                insertNodeStyle(item.id, treeData, resultSheet);
            } else {
                //查询已经存在的X Y 偏量
                let resultxy = getLastCeilXy(parentId, treeData, item.id, item.isHave);
                console.log(resultxy);
                treeAdd(parentId, item, y, x - resultxy.x - resultxy.width);
            }
        }


    }
    //物理元素添加或者插入
    const containerCeilAddOrInsert = (item, x, y, originX, originY) => {
        if (item.isHave) {
            //计算已经有的物理高度
            let resxy = getLastCeilXy(null, treeData, item.id, item.isHave);
            let resultSheet = findNode(item.id, treeData).styleSheet;
            resultSheet.marginTop = y - originY - resxy.height - resxy.y;
            resultSheet.marginLeft = x - originX;
            insertNodeStyle(item.id, treeData, resultSheet);
        } else {
            treeAdd(null, item, y - originY - treeHeight, x - originX);
        }
        //计算已经有的物理高度
        let resxy = getLastCeilXy(null, treeData, item.id, item.isHave);
        setTreeHeight(resxy.height + resxy.y);
    }
    //浮动元素添加或者插入
    const floatCeilCeilAddOrInsert = (item, x, y, originX, originY) => {
        if (item.isHave) {
            let resultSheet = findNode(item.id, treeData).styleSheet;
            resultSheet.top = y - originY;
            resultSheet.left = x - originX;
            insertNodeStyle(item.id, treeData, resultSheet);
        } else {
            treeAdd(null, item, y - originY, x - originX);
        }
    }
    //获取末尾元素的offsetX offsetY
    const getLastCeilXy = (parentId, tree, chooseId, isHave) => {
        let resultNode = null;
        let id = null;
        if (parentId) {
            let parentNode = findNode(parentId, tree);
            id = findConceilById(parentNode.childNode, chooseId, isHave);
        } else {
            resultNode = tree;
            id = findConceilById(tree, chooseId, isHave);
        }

        if (!id) {
            return { x: 0, y: 0, height: 0, width: 0 };
        }
        let findDocumentNode = document.getElementById(id);
        let [x, y, height, width] = [findDocumentNode.offsetLeft, findDocumentNode.offsetTop, findDocumentNode.offsetHeight, findDocumentNode.offsetWidth];
        console.log(x, y, height, width);
        return { x, y, height, width };
    }
    //获取选中元素前面的第一个物理元素
    const findConceilById = (tree, id, isHave) => {
        //如果是新增
        if (isHave) {
            for (let i = tree.length - 1; i >= 0; i--) {
                if (tree[i].id === id) {
                    for (let j = i - 1; j >= 0; j--) {
                        if (tree[j].tag === 'div') {
                            return tree[j].id;
                        }
                    }
                }
            }
        } else {
            for (let i = tree.length - 1; i >= 0; i--) {
                if (tree[i].tag === 'div') {
                    return tree[i].id;
                }
            }
        }
        return null;
    }
    //往状态树插入一个div 接受一个上级节点
    const treeAdd = (parentId, localItem, top, left) => {
        let node = undefined;
        let styleSheet = {};
        console.log(localItem);
        switch (localItem.type) {
            case 'UseTool.Div':
                node = UseTool.Div;
                styleSheet.marginTop = top;
                styleSheet.height = localItem.styleAttr.height.value;
                styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
                styleSheet.flexDirection = 'row';
                break;
            case 'UseTool.DivTwo':
                node = UseTool.DivTwo;
                styleSheet.width = localItem.styleAttr.width.value;
                styleSheet.height = localItem.styleAttr.height.value;
                styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
                styleSheet.marginTop = top;
                styleSheet.marginLeft = left;
                break;
            case 'UseTool.Float':
                styleSheet.width = localItem.styleAttr.width.value;
                styleSheet.height = localItem.styleAttr.height.value;
                styleSheet.position = 'absolute';
                styleSheet.top = top;
                styleSheet.left = left;
                styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
                node = UseTool.Float;
                break;
            case 'UseTool.FloatTwo':
                styleSheet.width = localItem.styleAttr.width.value;
                styleSheet.height = localItem.styleAttr.height.value;
                styleSheet.position = 'absolute';
                styleSheet.top = top;
                styleSheet.left = left;
                styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
                node = UseTool.FloatTwo;
                break;
            default:
        }
        let item = { name: node, tag: localItem.tag, dataAttr: localItem.dataAttr, id: makeOnlyId(), styleAttr: localItem.styleAttr, styleSheet: styleSheet,childNode: [] };
        //如果父亲节点id 执行插入子树操作
        if (parentId) {
            insertChildNode(parentId, treeData, item);
        } else {
            treeData.push(item);
        }
        setTreeData([].concat(treeData));

    }
    //复制模板属性给与正在添加的tree
    const copyAttr = (item, top, left) => {
        let styleSheet = {};
        for (let i in item.styleAttr) {
            styleSheet[i] = item.styleAttr[i].value;
        }
        console.log(styleSheet);
    }
    //快速给某个节点添加一个子节点
    const insertChildNode = (id, tree, childNode) => {
        if (tree.length === 0) {
            return tree;
        }
        all: for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                tree[i].childNode.push(childNode);
                break all;
            } else {
                tree[i].childNode = insertNodeStyle(id, tree[i].childNode, childNode);
            }
        }
        return tree;
    }
    //生成唯一ID
    const makeOnlyId = () => {
        return new Date().getTime() - 1000;
    }
    //快速给某个节点插入样式
    const insertNodeStyle = (id, tree, styleSheet) => {
        console.log(id, tree, styleSheet);
        if (tree.length === 0) {
            return tree;
        }
        all: for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                tree[i].styleSheet = styleSheet;
                break all;
            } else {
                tree[i].childNode = insertNodeStyle(id, tree[i].childNode, styleSheet);
            }
        }
        return tree;
    }
    //快速给某节点插入额外属性
    const insertNodeExtralData = (id, tree, extralData) => {
        console.log(id, tree, extralData);
        if (tree.length === 0) {
            return tree;
        }
        all: for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                tree[i].dataAttr = extralData;
                break all;
            } else {
                tree[i].childNode = insertNodeExtralData(id, tree[i].childNode, extralData);
            }
        }
        return tree;
    }
    //快速查找某个节点并返回
    const findNode = (id, tree) => {
        console.log(id, tree);
        if (tree.length === 0) {
            return false;
        }
        //依次遍历兄弟结点
        for (let i = 0; i < tree.length; i++) {
            if (tree[i].id === id) {
                return tree[i];
            }
        }
        //接着遍历子结点
        for (let i = 0; i < tree.length; i++) {
            let result = findNode(id, tree[i].childNode);
            if (result) {
                return result;
            }
        }
        return false;
    }
    //快速删除某个节点
    const deleteNode = (id, tree) => {
        const lunFind = (id, tree) => {
            //依次遍历兄弟结点
            for (let i = 0; i < tree.length; i++) {
                if (tree[i].id === id) {
                    tree.splice(i, 1);
                    return tree;
                }
            }
            //接着遍历子结点
            for (let i = 0; i < tree.length; i++) {
                tree[i].childNode = lunFind(id, tree[i].childNode);
            }
            return tree;
        };
        let result = lunFind(id, tree);
        setTreeData([].concat(result));
    }
    //调节节点顺序
    const changeSort=(tree,id,action)=>{
        for(let i in tree){
            if(tree[i].id===id){
                let temp=tree[i];
                tree.splice(i,1);
                if(action==='up'){
                    tree.splice(i-1>=0?i-1:0,0,temp);
                }else{
                    tree.splice(i+1<=tree.length?i+1:tree.length,0,temp);
                }
                break;
            }
        }
        console.log(tree);
        setTreeData([].concat(tree));
    }
    //状态树渲染
    const treeRender = (tree) => {
        if (tree.length === 0) {
            return '';
        }
        let result = tree.map(item => <item.name dragCallBack={childDragBack} childClick={localEditComponent} callback={localEditComponent} dataAttr={item.dataAttr} styleAttr={item.styleAttr} styleSheet={item.styleSheet} key={item.id} localDomId={localDomId} id={item.id} childNodeList={item.childNode}></item.name>);
        return result;
    }
    //点击编辑当前 
    const localEditComponent = (item) => {
        setLocalDomId(item.id);
        let styleSheet = findNode(item.id, treeData).styleSheet;
        console.log(styleSheet);
        let tempSheet = [];
        //本地样式赋值
        for (let i in item.styleAttr) {
            tempSheet.push({
                mean: i,
                lable: item.styleAttr[i].lable,
                value: styleSheet[i],
                type: item.styleAttr[i].type,
                select: item.styleAttr[i].select
            })
        }
        //其他属性赋值
        let tempExtralData={};
        for(let i in item.dataAttr){
            tempExtralData[i]={...item.dataAttr[i]};
        }
        setExtralAttr(tempExtralData);
        console.log(extralAttr);
        setCurrentStyle([].concat(tempSheet));
    }
    //颜色改变 
    const onCompleteColor = (e, mean) => {
        selectChange(mean, e.hex);
    }

    //显示与否颜色选择器
    const colorPickerHand = (boolen, mean) => {
        for (let i in currentStyle) {
            if (currentStyle[i].mean === mean) {
                currentStyle[i].pickerIsShow = boolen;
            }
        }
        setCurrentStyle([].concat(currentStyle));
    }

    //设置机型选择菜单
    const menu = (
        <Menu onClick={({ key }) => setPhoneIndex(key)}>
            {PhoneList.map((item, index) => <Menu.Item key={index}>{item.name}</Menu.Item>)}
        </Menu>
    );
    //设置选择框菜单
    const styleMenu = (attr, item) => {
        return <Menu onClick={({ key }) => selectChange(attr, key)}>
            {item.map(itemx => <Menu.Item key={itemx}>{itemx}</Menu.Item>)}
        </Menu>

    }
    //获取当前渲染页面的html
    const getLocalEditHtml = () => {
        console.log(document.getElementById('phone_canvas').innerHTML);
    }
    //编辑当前样式输入框
    const styleChange = (event, mean) => {
        let styleSheet = {};
        let isNumber=/^[0-9]+$/i;
        for (let i in currentStyle) {
            if (currentStyle[i].mean === mean) {
                currentStyle[i].value =  isNumber.test(event.target.value)?Number(event.target.value):event.target.value;
            }
            styleSheet[currentStyle[i].mean] = currentStyle[i].value;
        }
        console.log(styleSheet);
        setTreeData([].concat(insertNodeStyle(localDomId, treeData, styleSheet)));
    }
    //额外属下输入框
    const extralChange= (event, mean) => {

        for (let i in extralAttr) {
            if (i === mean) {
                extralAttr[i].value = event.target.value
            }
        }
        setTreeData([].concat(insertNodeExtralData(localDomId, treeData, extralAttr)));
    }
    //编辑当前样式选择框
    const selectChange = (mean, value) => {

        let styleSheet = {};
        for (let i in currentStyle) {
            if (currentStyle[i].mean === mean) {
                currentStyle[i].value = value;
            }
            styleSheet[currentStyle[i].mean] = currentStyle[i].value;
        }
        setCurrentStyle([].concat(currentStyle));
        setTreeData([].concat(insertNodeStyle(localDomId, treeData, styleSheet)));

    }
    //返回额外属性的样式表
    return <div className="content" id="content">
        <div className="console">
            <div className="btn">上一页</div>
            <Dropdown className="i_lable" overlay={menu} placement="bottomLeft">
                <div onClick={e => e.preventDefault()}>
                    {PhoneList[phoneIndex].name}
                </div>
            </Dropdown>
            <div className="i_info">{PhoneList[phoneIndex].width}</div>
             x &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="i_info">{PhoneList[phoneIndex].height}</div>
            <div className="btn" onClick={getLocalEditHtml} >获取HTML代码</div>
            <div className="btn">预览</div>
        </div>
        <div className="content_panel">
            {/* 功能属性*/}
            <div className="panel_attributes" style={{ marginLeft: 'inherit' }}>
                <div className="panel_head" >功能属性</div>
                { Object.keys(extralAttr).map( key => 
                       <>
                        <div className="text-describe">
                           <div className="lable">{extralAttr[key].lable}：</div>
                            <div className="value"><textarea value={extralAttr[key].value} mean={key} onChange={(event) => extralChange(event, key)} /></div>
                       </div>
                       </>
                )}
            </div>
            {/* 操作 */}
            <div className="panel_action">
                <div className='up item' onClick={()=>changeSort(treeData,localDomId,'up')}><svg t="1603327711985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3084" width="64" height="64"><path d="M512 995.552l398.224-568.88H739.544V312.888H284.44v113.784H113.776L512 995.552zM739.544 142.216H284.44V256h455.104V142.216z m0-113.768H284.44v56.88h455.104v-56.88z" p-id="3085" fill="#e6e6e6"></path></svg></div>
                <div className='down item' onClick={()=>changeSort(treeData,localDomId,'down')}><svg t="1603327711985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3084" width="64" height="64"><path d="M512 995.552l398.224-568.88H739.544V312.888H284.44v113.784H113.776L512 995.552zM739.544 142.216H284.44V256h455.104V142.216z m0-113.768H284.44v56.88h455.104v-56.88z" p-id="3085" fill="#e6e6e6"></path></svg></div>
            </div>
            <div className='panel_phone'>
            <div className="phone_canvas" onKeyDown={(e) => handleKeyDown(e)} id="phone_canvas" onContextMenu={(e) => e.preventDefault()} ref={drop} style={{ width: PhoneList[phoneIndex].width, height: PhoneList[phoneIndex].height, border: isOver ? '1px solid #e80a0a' : '1px solid #f7f7f7' }}>
                {treeRender(treeData)}
            </div>
            </div>

            {/* 属性面板 */}
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

    </div>
}



export default Content;