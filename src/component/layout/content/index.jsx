import React, { useState, useEffect } from 'react';
import './index.scss';
import { useDrop } from 'react-dnd';
import PhoneList from '../../../phone.config.js'; //机型数据配置文件
import { Menu, Dropdown, InputNumber, Modal, Input } from 'antd';
import UseTool from '../../tools-use/index.js'; //引入真实使用的组件
import { SketchPicker } from 'react-color';
//根节点初始值
const DomRoot={
    name: 'APP', tag: 'div', dataAttr: {}, id: 'canvas_app', 
    styleAttr: {
         height: {
             lable: '高',
             type: 'number',
             value:25
         },
         backgroundColor:{
            lable:'背景颜色',
            type:'color',
            value:'#f5c1c1',
            pickerIsShow:false
        },
        backgroundImage:{
            lable:'背景图片',
            type:'text',
            value:''
        }
    }, styleSheet:{
        width:'100%',
        height:667
    }, childNode: []
}

function Content() {
    //瀑布流已经有的高度
    const [treeHeight, setTreeHeight] = useState(0);
    //历史路由状态树
    const [routerData, setRouteData] = useState({});
    //生成状态树 初始根元素
    const [treeData, setTreeData] = useState({...DomRoot});
    // 声明一个叫 "count" 的 state 变量
    const [phoneIndex, setPhoneIndex] = useState(0);
    //设置样式属性 数组
    const [currentStyle, setCurrentStyle] = useState([]);
    //声明一个当前正在编辑的ID
    const [localDomId, setLocalDomId] = useState('');
    //声明功能属性
    const [extralAttr, setExtralAttr] = useState({});
    //声明一个新增路由的弹窗
    const [addRouterPop, setAddRouterPop] = useState(false);
    //新增一个当前新增的路由信息
    const [addRouterData, setAddRouterData] = useState('');
    //当前路由信息
    const [localRouterName, setLocalRouterName] = useState('index');
    //当前路由操作行为
    const [routerAction, setRouterAction] = useState('add');
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
    //当前路由信息更改时，更改整个dom树
    useEffect(() => {
        setTreeData(routerData[localRouterName] ? routerData[localRouterName] : {...DomRoot});
    }, [localRouterName])
    //鼠标监听函数
    const handleKeyDown = (e) => {
        let styleSheet = window.styleSheet;
        let id = window.localDomId;
        console.log(e);
        switch (e.code) {
            case 'KeyD':
                arrowDir('KeyD', id, styleSheet);
                break;
            case 'KeyW':
                arrowDir('KeyW', id, styleSheet);
                break;
            case 'KeyA':
                arrowDir('KeyA', id, styleSheet);
                break;
            case 'KeyS':
                arrowDir('KeyS', id, styleSheet);
                break;
            case 'Delete':
                deleteNode(id, window.treeData.childNode);
                break;
        }
    };
    //上下左右调节间距
    const arrowDir = (dir, id, styleSheet) => {
        switch (dir) {
            case 'KeyA':
                styleSheet.left--;
                styleSheet.marginLeft--;
                break;
            case 'KeyD':
                styleSheet.left++;
                styleSheet.marginLeft++;
                break;
            case 'KeyW':
                styleSheet.top--;
                styleSheet.marginTop--;
                break;
            case 'KeyS':
                styleSheet.top++;
                styleSheet.marginTop++;
                break;
        }
        setTreeData(Object.assign({},insertNodeStyle(id, window.treeData, styleSheet)));
    }
    //拖拽函数 两种状态 已经在内容模块的、不在内容模块的
    const dragEnd = (item, monitor) => {
        let phoneNode = document.getElementById('phone_canvas');
        let { x, y } = monitor.getSourceClientOffset();
        let [originY, originX] = [phoneNode.offsetTop, phoneNode.offsetLeft];
        //滚动轴偏移量
        let scrollY=phoneNode.scrollTop||phoneNode.pageYOffset||0;
        if (item.type === 'UseTool.Float' || item.type === 'UseComponent.Float') {
            floatCeilCeilAddOrInsert(item, x, y+scrollY, originX, originY);
        } else {
            containerCeilAddOrInsert(item, x, y+scrollY, originX, originY);
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
            let resxy = getLastCeilXy(null, treeData, item.id, item.isHave);
            treeAdd(null, item, y - originY - resxy.height - resxy.y, x - originX);
        }
    }
    //浮动元素添加或者插入
    const floatCeilCeilAddOrInsert = (item, x, y, originX, originY) => {
        if (item.isHave) {
            let resultSheet = findNode(item.id, treeData).styleSheet;
            resultSheet.top = y - originY;
            resultSheet.left = x - originX;
            let tree=insertNodeStyle(item.id, treeData, resultSheet);
            setTreeData(Object.assign({},tree));
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
            id = findConceilById(tree.childNode, chooseId, isHave);
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
                styleSheet=copyDivStyleAttr(styleSheet,localItem,top,left);
                node = UseTool.DivTwo;
                break;
            case 'UseTool.DivThree':
                styleSheet=copyDivStyleAttr(styleSheet,localItem,top,left);
                node = UseTool.DivThree;
                break;
            case 'UseTool.Float':
                styleSheet=copyFloatStyleAttr(styleSheet,localItem,top,left);
                node = UseTool.Float;
                break;
            case 'UseTool.FloatTwo':
                styleSheet=copyFloatStyleAttr(styleSheet,localItem,top,left);
                node = UseTool.FloatTwo;
                break;
            case 'UseTool.FloatThree':
                styleSheet=copyFloatStyleAttr(styleSheet,localItem,top,left);
                node = UseTool.FloatThree;
                break;
            default:
        }
        let item = { name: node, tag: localItem.tag, dataAttr: localItem.dataAttr, id: makeOnlyId(), styleAttr: localItem.styleAttr, styleSheet: styleSheet, childNode: [] };
        //如果父亲节点id 执行插入子树操作
        if (parentId) {
            treeData.childNode=insertChildNode(parentId, treeData.childNode, item);
        } else {
            treeData.childNode.push(item);
        }
        debugger
        setTreeData(Object.assign({},treeData));

    }

    //物理元素样式赋值
    const copyDivStyleAttr=(styleSheet,localItem,top,left)=>{
        styleSheet.width = localItem.styleAttr.width.value;
        styleSheet.height = localItem.styleAttr.height.value;
        styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
        styleSheet.marginTop = top;
        styleSheet.marginLeft = left;
        return styleSheet;
    }
    //浮动元素初始样式赋值
    const copyFloatStyleAttr=(styleSheet,localItem,top,left)=>{
        styleSheet.width = localItem.styleAttr.width.value;
        styleSheet.height = localItem.styleAttr.height.value;
        styleSheet.position = 'absolute';
        styleSheet.top = top;
        styleSheet.left = left;
        styleSheet.backgroundColor = localItem.styleAttr.backgroundColor.value;
        return styleSheet;
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
                tree[i].childNode = insertChildNode(id, tree[i].childNode, childNode);
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
        if(id===tree.id){
            tree.styleSheet = styleSheet;
            return tree;
        }
        if (tree.childNode.length === 0) {
            return tree;
        }
        all: for (let i = 0; i < tree.childNode.length; i++) {
            if (tree.childNode[i].id === id) {
                tree.childNode[i].styleSheet = styleSheet;
                break all;
            } else {
                tree.childNode[i]=insertNodeStyle(id, tree.childNode[i], styleSheet);
            }
        }
        return tree;
    }
    //快速给某节点插入额外属性
    const insertNodeExtralData = (id, tree, extralData) => {
    
        if(tree.id===id){
            tree.dataAttr=extralData;
            return tree;
        }
        if (tree.childNode.length === 0) {
            return tree;
        }
        all: for (let i = 0; i < tree.childNode.length; i++) {
            if (tree.childNode[i].id === id) {
                tree.childNode[i].dataAttr = extralData;
                break all;
            } else {
                tree.childNode[i].childNode = insertNodeExtralData(id, tree.childNode[i], extralData);
            }
        }
        return tree;
    }
    //快速查找某个节点并返回
    const findNode = (id, tree) => {
        console.log(id, tree);
        if(tree.id===id){
            return tree;
        }
        if (tree.childNode.length === 0) {
            return false;
        }
        //接着遍历子结点
        for (let i = 0; i < tree.childNode.length; i++) {
            let result = findNode(id, tree.childNode[i]);
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
        treeData.childNode=result;
        setTreeData(Object.assign({},treeData));
    }
    //快速复制某个节点到对应的父亲节点
    const copyNode = (id, tree) => {
        const lunFind = (id, tree) => {
            //依次遍历兄弟结点
            for (let i = 0; i < tree.length; i++) {
                if (tree[i].id === id) {
                    let temp = { ...tree[i] };
                    temp.id = makeOnlyId();
                    tree.push(temp);
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
        treeData.childNode=result;
        setTreeData(Object.assign({},treeData));
    }
    //调节节点顺序
    const changeSort = (tree, id, action) => {
        for (let i in tree) {
            if (tree[i].id === id) {
                let temp = tree[i];
                tree.splice(i, 1);
                if (action === 'up') {
                    tree.splice(i - 1 >= 0 ? i - 1 : 0, 0, temp);
                } else {
                    tree.splice(i + 1 <= tree.length ? i + 1 : tree.length, 0, temp);
                }
                break;
            }
        }
        treeData.childNode=tree;
        setTreeData(Object.assign({},treeData));
    }
    //状态树渲染 以根结点 广度遍历
    const treeRender = (tree) => {
        console.log(tree);
        let result = tree.childNode.map(item => <item.name dragCallBack={childDragBack} childClick={localEditComponent} callback={localEditComponent} dataAttr={item.dataAttr} styleAttr={item.styleAttr} styleSheet={item.styleSheet} key={item.id} localDomId={localDomId} id={item.id} childNodeList={item.childNode}></item.name>); 
        return <>
        <div  onClick={()=>localEditComponent(tree)}   onKeyDown={(e) => handleKeyDown(e)} id={localRouterName} onContextMenu={(e) => e.preventDefault()} ref={drop} style={{ border: isOver ? '1px solid #e80a0a' : '1px solid #f7f7f7',...tree.styleSheet,background:`url(${tree.styleSheet.backgroundImage}) 0% 0% /100% 100%` }}>
            {result}
        </div>
        </>;
    }
    //路由新增或者修改
    const addRouter = () => {
        routerData[localRouterName] = treeData;
        setRouteData(routerData);
        setLocalRouterName(addRouterData);
        setAddRouterPop(false);
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
        let tempExtralData = {};
        for (let i in item.dataAttr) {
            tempExtralData[i] = { ...item.dataAttr[i] };
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
    //设置路由选择菜单
    const routeMenu = (
        <Menu onClick={({ key }) => { setLocalRouterName(key); routerData[localRouterName] = treeData; }}>
            {Object.keys(routerData).map(key => <Menu.Item key={key}>{key}</Menu.Item>)}
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
    const styleChange = (value, mean) => {
        console.log(value, mean);
        let styleSheet = {};
        let isNumber = /^[0-9]+$/i;
        for (let i in currentStyle) {
            if (currentStyle[i].mean === mean) {
                currentStyle[i].value = isNumber.test(value) ? Number(value) : value;
            }
            styleSheet[currentStyle[i].mean] = currentStyle[i].value;
        }
        console.log(styleSheet);
        debugger
        setTreeData(Object.assign({},insertNodeStyle(localDomId, treeData, styleSheet)) );
    }
    //额外属下输入框
    const extralChange = (event, mean) => {

        for (let i in extralAttr) {
            if (i === mean) {
                extralAttr[i].value = event.target.value
            }
        }
        setTreeData(Object.assign({},insertNodeExtralData(localDomId, treeData, extralAttr)));
    }
    //新增路由编辑信息
    const editAddRouterData = (e) => {
        console.log(e.target.value);
        if (routerAction === 'add') {
            setAddRouterData(e.target.value);
        } else {
            setLocalRouterName(e.target.value);
        }

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
        setTreeData(Object.assign({},insertNodeStyle(localDomId, treeData, styleSheet)));

    }
    //返回额外属性的样式表
    return <div className="content" id="content">
        <Modal
            title="新增路由"
            visible={addRouterPop}
            onOk={addRouter}
            onCancel={() => { setAddRouterPop(false) }}
        >
            <Input placeholder="请输入新增路由" value={routerAction === 'add' ? addRouterData : localRouterName} onChange={editAddRouterData} />
        </Modal>
        <div className="console">
            <Dropdown className="i_lable" overlay={menu} placement="bottomLeft">
                <div onClick={e => e.preventDefault()}>
                    {PhoneList[phoneIndex].name}
                </div>
            </Dropdown>
            <div className="i_info">{PhoneList[phoneIndex].width}</div>
             x &nbsp;&nbsp;&nbsp;&nbsp;
            <div className="i_info">{PhoneList[phoneIndex].height}</div>
            <Dropdown className="i_lable" overlay={routeMenu} placement="bottomLeft">
                <div onClick={e => e.preventDefault()}>
                    当前路由: {localRouterName}
                </div>
            </Dropdown>
            <div className="btn" onClick={getLocalEditHtml} >获取HTML代码</div>
            <div className="btn">预览</div>
        </div>
        <div className="content_panel">
            {/* 功能属性*/}
            <div className="panel_attributes" style={{ marginLeft: 'inherit' }}>
                <div className="panel_head" >功能属性</div>
                {Object.keys(extralAttr).map(key =>
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
                <div className='item' onClick={() => changeSort(treeData.childNode, localDomId, 'up')}><svg style={{ transform: 'rotate(180deg)' }} t="1603327711985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3084" width="64" height="64"><path d="M512 995.552l398.224-568.88H739.544V312.888H284.44v113.784H113.776L512 995.552zM739.544 142.216H284.44V256h455.104V142.216z m0-113.768H284.44v56.88h455.104v-56.88z" p-id="3085" fill="#e6e6e6"></path></svg><div className="action-lable">上移</div></div>
                <div className='item' onClick={() => changeSort(treeData.childNode, localDomId, 'down')}><svg t="1603327711985" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3084" width="64" height="64"><path d="M512 995.552l398.224-568.88H739.544V312.888H284.44v113.784H113.776L512 995.552zM739.544 142.216H284.44V256h455.104V142.216z m0-113.768H284.44v56.88h455.104v-56.88z" p-id="3085" fill="#e6e6e6"></path></svg><div className="action-lable">下移</div></div>
                <div className='item' onClick={() => copyNode(localDomId, treeData.childNode)}><svg t="1603348645892" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4275" width="64" height="64"><path d="M832 448H444.8c-19.2 0-32-12.8-32-32s12.8-32 32-32H832c19.2 0 32 12.8 32 32s-12.8 32-32 32z" p-id="4276" fill="#e6e6e6"></path><path d="M640 643.2c-19.2 0-32-12.8-32-32V220.8c0-19.2 12.8-32 32-32s32 12.8 32 32v393.6c0 16-12.8 28.8-32 28.8zM704 1024H64c-35.2 0-64-28.8-64-64V320c0-35.2 28.8-64 64-64h96c19.2 0 32 12.8 32 32s-12.8 32-32 32H64v640h640v-96c0-19.2 12.8-32 32-32s32 12.8 32 32v96c0 35.2-28.8 64-64 64z" p-id="4277" fill="#e6e6e6"></path><path d="M960 768H320c-35.2 0-64-28.8-64-64V64c0-35.2 28.8-64 64-64h640c35.2 0 64 28.8 64 64v640c0 35.2-28.8 64-64 64zM320 64v640h640V64H320z" p-id="4278" fill="#e6e6e6"></path></svg><div className="action-lable">复制</div></div>
                <div className='item' onClick={() => { setAddRouterPop(true); setRouterAction('add'); }}><svg t="1603413048850" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3101" width="64" height="64"><path d="M960.186 639.965H768.149V448.209h-64.012v191.756H512.099v63.919h192.037v191.773l64.012-0.017V703.883h192.037v-63.918z m0 0M832.162 127.99H64.012V63.946l768.15-0.078zM768.149 127.99h64.012v255.964h-64.012zM128.025 831.721l-64.013 0.164V127.99h63.978z" p-id="3102" fill="#ffffff"></path><path d="M64.212 831.721h319.862v63.919H64.212zM192.08 319.891h384.075v-63.919H192.08v63.919z m0 127.768l320.062 0.069v-63.919H192.08v63.85z m0 128.317h192.037v-63.891l-192.037-0.028v63.919z m0 0" p-id="3103" fill="#ffffff"></path></svg><div className="action-lable">新增页面</div></div>
            </div>
            <div className='panel_phone' id="panel_phone">
                   <div className="phone_canvas" id="phone_canvas">
                    {treeRender(treeData)}
                  </div> 
            </div>

            {/* 样式面板 */}
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
                                {item.type === 'number' ? <div className="value" >  <InputNumber min={0} mean={item.mean} value={item.value} onChange={(value) => styleChange(value, item.mean)} /></div> : ''}
                                {item.type === 'text' ? <div className="value" >  <Input  mean={item.mean} value={item.value} onChange={(e) => styleChange(e.target.value, item.mean)} /></div> : ''}

                            </div>}
                    </>
                )}




            </div>

        </div>

    </div>
}



export default Content;