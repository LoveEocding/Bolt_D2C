import { createSlice } from '@reduxjs/toolkit'


//css 字符串解析成JSON格式
const cssTojson = (val) => {
    if (typeof val === 'object') {
        return val;
    }
    const reg = /([\w-]+)\: ([\w-]+)\;/g;
    const obj = {};
    while (1) {
        let res = reg.exec(val);
        if (!res) {
            break;
        }
        let indexfen = res[1].indexOf('-');
        let key = res[1];
        if (indexfen > 0) {//-转成首字母大写
            key = res[1].substring(0, indexfen) + res[1][indexfen + 1].toUpperCase() + res[1].substring(indexfen + 2);
        }

        obj[key] = res[2];

    }
    return obj;
}

/**
 * 广度遍历一棵树 执行操作
 * @param {*} tree  树结构
 * @param {*} id    查询ID
 * @param {*} fn    执行方法
 * @param {*} data  执行数据
 */
const breadthTravel = (tree, id, fn, data) => {
    if (tree.id === id) {
        tree = fn(tree, data);
        console.log("🚀 ~ file: threeData.js ~ line 37 ~ breadthTravel ~ tree", tree)
        return tree;
    }
    const loop = (dom, id, fn, data) => {

        if (!dom) return tree;
        for (let i = 0; i < dom.length; i++) {
            if (dom[i].id === id) {
                console.log("🚀 ~ file: threeData.js ~ line 46 ~ loop ~ dom", dom)
                dom[i] = fn(dom[i], data);
                return tree;
            }
            loop(dom[i].children, id, fn, data);
        }
    }
    loop(tree.children, id, fn, data);
    return tree;
}

//改变样式操作
const insertStyle = (dom, style) => {
    console.log("🚀 ~ file: threeData.js ~ line 59 ~ insertStyle ~ dom", dom);
    dom.props.style = style;
    return dom;
}


export const counterSlice = createSlice({
    name: 'edit_page',
    initialState: {
        //组件树的值
        value: {
            "componentName": "Page",
            "id": "Shape-0",
            "rect": {},
            "smart": {},
            "props": {
                "style": {
                    "display": "flex",
                    "alignItems": "flex-start",
                    "flexDirection": "column",
                    "borderRadius": "24px",
                    "backgroundColor": "#ffffff",
                    "width": "750px",
                    "height": "790px",
                    "overflow": "hidden"
                },
                "className": "box"
            },
            "children": [{
                "componentName": "Div",
                "id": "Block-258380",
                "rect": {},
                "smart": {},
                "props": {
                    "style": {
                        "boxSizing": "border-box",
                        "display": "flex",
                        "position": "relative",
                        "alignItems": "flex-start",
                        "marginBottom": "-18px",
                        "paddingBottom": "18px",
                        "width": "750px",
                        "height": "378px"
                    },
                    "className": "hd"
                },
                "children": [{
                    "componentName": "Image",
                    "id": "Image-17",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "position": "absolute",
                            "top": "0px",
                            "left": "0px",
                            "width": "750px",
                            "height": "360px"
                        },
                        "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/754e7d40111e11e9b4a5b7543eac6ab4.png",
                        "className": "banner"
                    }
                }, {
                    "componentName": "Div",
                    "id": "Block-810291",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "boxSizing": "border-box",
                            "display": "flex",
                            "position": "absolute",
                            "top": "0px",
                            "left": "0px",
                            "marginBottom": "-18px",
                            "paddingBottom": "18px",
                            "width": "750px",
                            "height": "378px"
                        },
                        "className": "group"
                    },
                    "children": [{
                        "componentName": "Div",
                        "id": "Shape-18",
                        "rect": {},
                        "smart": {},
                        "props": {
                            "style": {
                                "display": "flex",
                                "flexDirection": "column",
                                "alignItems": "flex-start",
                                "width": "750px",
                                "height": "360px",
                                "backgroundColor": "rgba(0,0,0,0.20)"
                            },
                            "className": "container"
                        },
                        "children": [{
                            "componentName": "Image",
                            "id": "Image-22",
                            "rect": {},
                            "smart": {},
                            "props": {
                                "style": {
                                    "width": "240px",
                                    "height": "56px"
                                },
                                "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/7621f9e0111e11e993a2bb7ec41cf8a9.png",
                                "className": "actionBg"
                            }
                        }, {
                            "componentName": "Text",
                            "id": "Text-23",
                            "rect": {},
                            "smart": {},
                            "props": {
                                "style": {
                                    "marginLeft": "235px",
                                    "lineHeight": "28px",
                                    "whiteSpace": "nowrap",
                                    "color": "#ffffff",
                                    "fontFamily": "PingFangSC",
                                    "fontSize": "28px",
                                    "fontWeight": 400
                                },
                                "text": "左右旋转手机查看全景",
                                "className": "title"
                            }
                        }, {
                            "componentName": "Div",
                            "id": "Block-755387",
                            "rect": {},
                            "smart": {},
                            "props": {
                                "style": {
                                    "display": "flex",
                                    "flexDirection": "row",
                                    "justifyContent": "center",
                                    "marginTop": "216px",
                                    "width": "750px",
                                    "height": "57px"
                                },
                                "className": "actionBgWrap"
                            },
                            "children": []
                        }, {
                            "componentName": "Div",
                            "id": "Block-151940",
                            "rect": {},
                            "smart": {},
                            "props": {
                                "style": {
                                    "display": "flex",
                                    "flexDirection": "row",
                                    "marginTop": "20px",
                                    "width": "750px",
                                    "height": "51px"
                                },
                                "className": "block"
                            },
                            "children": [{
                                "componentName": "Div",
                                "id": "Block-465814",
                                "rect": {},
                                "smart": {},
                                "props": {
                                    "style": {
                                        "display": "flex",
                                        "position": "relative",
                                        "alignItems": "flex-start",
                                        "flexDirection": "row",
                                        "marginTop": "20px",
                                        "marginLeft": "157px",
                                        "width": "60px",
                                        "height": "29px"
                                    },
                                    "className": "labelWrap"
                                },
                                "children": [{
                                    "componentName": "Image",
                                    "id": "Image-20",
                                    "rect": {},
                                    "smart": {},
                                    "props": {
                                        "style": {
                                            "position": "relative",
                                            "width": "60px",
                                            "height": "29px"
                                        },
                                        "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/75d9a640111e11e996988b9a3e990bd4.png",
                                        "className": "label"
                                    }
                                }, {
                                    "componentName": "Image",
                                    "id": "Image-21",
                                    "rect": {},
                                    "smart": {},
                                    "props": {
                                        "style": {
                                            "position": "absolute",
                                            "top": "5px",
                                            "right": "8px",
                                            "width": "9px",
                                            "height": "20px"
                                        },
                                        "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/75ff2fa0111e11e99d1ccba2b1608ad6.png",
                                        "className": "icon"
                                    }
                                }]
                            }]
                        }]
                    }, {
                        "componentName": "Image",
                        "id": "Image-19",
                        "rect": {},
                        "smart": {},
                        "props": {
                            "style": {
                                "position": "absolute",
                                "bottom": "0px",
                                "left": "26px",
                                "width": "95px",
                                "height": "36px"
                            },
                            "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/75b4e030111e11e99cd5294673220c7d.png",
                            "className": "mark"
                        }
                    }]
                }]
            }, {
                "componentName": "Text",
                "id": "Text-7",
                "rect": {},
                "smart": {},
                "props": {
                    "style": {
                        "marginTop": "32px",
                        "marginLeft": "24px",
                        "maxWidth": "690px",
                        "overflow": "hidden",
                        "textOverflow": "ellipsis",
                        "lineHeight": "36px",
                        "whiteSpace": "nowrap",
                        "color": "#333333",
                        "fontFamily": "PingFangSC",
                        "fontSize": "32px",
                        "fontWeight": 500
                    },
                    "text": "3室2厅 日系无印风小户型",
                    "className": "bd"
                }
            }, {
                "componentName": "Div",
                "id": "Block-981543",
                "rect": {},
                "smart": {},
                "props": {
                    "style": {
                        "display": "flex",
                        "flexDirection": "row",
                        "justifyContent": "center",
                        "marginTop": "18px",
                        "width": "750px",
                        "height": "85px"
                    },
                    "className": "main"
                },
                "children": [{
                    "componentName": "Text",
                    "id": "Text-15",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "width": "702px",
                            "height": "84px",
                            "overflow": "hidden",
                            "textOverflow": "ellipsis",
                            "lineHeight": "42px",
                            "color": "#888888",
                            "fontFamily": "PingFangSC",
                            "fontSize": "28px",
                            "fontWeight": 300
                        },
                        "text": "美味的萌物们，让人看了就流口水，松软饱满的吐美味美味的萌物们，让人看了就流口水，松软饱满的吐美味的…",
                        "className": "summary"
                    }
                }]
            }, {
                "componentName": "Div",
                "id": "Block-846290",
                "rect": {},
                "smart": {},
                "props": {
                    "style": {
                        "boxSizing": "border-box",
                        "display": "flex",
                        "flexDirection": "row",
                        "justifyContent": "space-between",
                        "marginTop": "12px",
                        "paddingRight": "23px",
                        "paddingLeft": "24px",
                        "width": "750px",
                        "height": "164px"
                    },
                    "className": "submain"
                },
                "children": [{
                    "componentName": "Image",
                    "id": "Image-6",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "width": "162px",
                            "height": "162px"
                        },
                        "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/70fc3a20111e11e99cd5294673220c7d.png",
                        "className": "item"
                    }
                }, {
                    "componentName": "Image",
                    "id": "Image-3",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "width": "162px",
                            "height": "162px"
                        },
                        "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/6fd08b60111e11e993a2bb7ec41cf8a9.png",
                        "className": "product"
                    }
                }, {
                    "componentName": "Image",
                    "id": "Image-5",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "width": "162px",
                            "height": "162px"
                        },
                        "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/70a6ee30111e11e9b4a5b7543eac6ab4.png",
                        "className": "item2"
                    }
                }, {
                    "componentName": "Image",
                    "id": "Image-4",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "width": "162px",
                            "height": "162px"
                        },
                        "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/7041c3c0111e11e9b9180f724fa031be.png",
                        "className": "product2"
                    }
                }]
            }, {
                "componentName": "Div",
                "id": "Block-376492",
                "rect": {},
                "smart": {},
                "props": {
                    "style": {
                        "boxSizing": "border-box",
                        "display": "flex",
                        "flexDirection": "row",
                        "justifyContent": "space-between",
                        "marginTop": "19px",
                        "paddingRight": "23px",
                        "paddingLeft": "24px",
                        "width": "750px",
                        "height": "38px"
                    },
                    "className": "ft"
                },
                "children": [{
                    "componentName": "Div",
                    "id": "Block-738730",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "display": "flex",
                            "flexDirection": "row",
                            "height": "37px"
                        },
                        "className": "block2"
                    },
                    "children": [{
                        "componentName": "Image",
                        "id": "Image-11",
                        "rect": {},
                        "smart": {},
                        "props": {
                            "style": {
                                "marginTop": "3px",
                                "width": "30px",
                                "height": "30px"
                            },
                            "src": "https://ai-sample.oss-cn-hangzhou.aliyuncs.com/test/71b41870111e11e9b9180f724fa031be.png",
                            "className": "avator"
                        }
                    }, {
                        "componentName": "Text",
                        "id": "Text-12",
                        "rect": {},
                        "smart": {},
                        "props": {
                            "style": {
                                "marginTop": "7px",
                                "marginLeft": "6px",
                                "lineHeight": "24px",
                                "whiteSpace": "nowrap",
                                "color": "#666666",
                                "fontFamily": "PingFangSC",
                                "fontSize": "24px",
                                "fontWeight": 300
                            },
                            "text": "大海装饰公司",
                            "className": "info"
                        }
                    }, {
                        "componentName": "Div",
                        "id": "Shape-13",
                        "rect": {},
                        "smart": {},
                        "props": {
                            "style": {
                                "boxSizing": "border-box",
                                "display": "flex",
                                "alignItems": "flex-start",
                                "flexDirection": "row",
                                "marginTop": "5px",
                                "marginLeft": "8px",
                                "borderRadius": "6px",
                                "backgroundColor": "rgba(253,234,238,0.90)",
                                "paddingRight": "8px",
                                "paddingLeft": "8px",
                                "height": "28px"
                            },
                            "className": "tagWrap"
                        },
                        "children": [{
                            "componentName": "Text",
                            "id": "Text-14",
                            "rect": {},
                            "smart": {},
                            "props": {
                                "style": {
                                    "marginTop": "2px",
                                    "lineHeight": "24px",
                                    "whiteSpace": "nowrap",
                                    "color": "#ff2c54",
                                    "fontFamily": "PingFangSC",
                                    "fontSize": "20px",
                                    "fontWeight": 400
                                },
                                "text": "装修专家",
                                "className": "tag"
                            }
                        }]
                    }]
                }, {
                    "componentName": "Div",
                    "id": "Shape-1",
                    "rect": {},
                    "smart": {},
                    "props": {
                        "style": {
                            "boxSizing": "border-box",
                            "display": "flex",
                            "alignItems": "flex-start",
                            "flexDirection": "row",
                            "borderRadius": "19px",
                            "backgroundColor": "#fff4c0",
                            "paddingRight": "18px",
                            "paddingLeft": "12px",
                            "height": "36px"
                        },
                        "className": "tagWrap2"
                    },
                    "children": [{
                        "componentName": "Text",
                        "id": "Text-2",
                        "rect": {},
                        "smart": {},
                        "props": {
                            "style": {
                                "marginTop": "6px",
                                "lineHeight": "24px",
                                "whiteSpace": "nowrap",
                                "color": "#ff9d00",
                                "fontFamily": "PingFangSC",
                                "fontSize": "24px",
                                "fontWeight": 400
                            },
                            "text": "＃西式厨房",
                            "className": "tag2"
                        }
                    }]
                }]
            }],
            "fileName": "index"
        },
        //额外的一些辅助数据
        extral: {
            currentEditId: '', //当前编辑的ID
            currentStyle: {}  //当前编辑的style
        }

    },
    reducers: {
        //保存导入的AST数据
        importData(state, action) {
            console.log(action.payload);
            state.value = action.payload.data;
        },
        //修改当前正在编辑的ID
        changeCurrentEditId(state, action) {
            state.extral.currentEditId = action.payload.value;
        },
        //修改当前正在编辑的style
        changeCurrentStyle(state, action) {
            console.log("🚀 ~ file: threeData.js ~ line 524 ~ changeCurrentStyle ~ action", action)
            state.extral.currentStyle = cssTojson(action.payload.value);
        },
        //保存当前编辑的style到对应的dom
        editDomStyle(state, action) {
            console.log("🚀 ~ file: threeData.js ~ line 585 ~ editDomStyle ~ action", action)
            //广布遍历
            breadthTravel(state.value, state.extral.currentEditId, insertStyle, action.payload.value);
        }
    },
})

// Action creators are generated for each case reducer function
export const { importData, changeCurrentEditId, changeCurrentStyle, editDomStyle } = counterSlice.actions

export default counterSlice.reducer