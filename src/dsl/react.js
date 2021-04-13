import _ from 'lodash';
export default function (schema) {

    // imports
    const imports = [];

    // inline style
    let style = ``;

    // Global Public Functions
    const utils = [];

    // Classes 
    const classes = [];

    const isExpression = (value) => {
        return /^\{\{.*\}\}$/.test(value);
    }
    // no unit style
    const noUnitStyles = ['opacity', 'fontWeight'];
    // box relative style
    const boxStyleList = [
        'fontSize',
        'marginTop',
        'marginBottom',
        'paddingTop',
        'paddingBottom',
        'height',
        'top',
        'bottom',
        'width',
        'maxWidth',
        'left',
        'right',
        'paddingRight',
        'paddingLeft',
        'marginLeft',
        'marginRight',
        'lineHeight',
        'borderBottomRightRadius',
        'borderBottomLeftRadius',
        'borderTopRightRadius',
        'borderTopLeftRadius',
        'borderRadius'
    ];
    const toString = (value) => {
        if ({}.toString.call(value) === '[object Function]') {
            return value.toString();
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object') {
            return JSON.stringify(value, (key, value) => {
                if (typeof value === 'function') {
                    return value.toString();
                } else {
                    return value;
                }
            })
        }

        return String(value);
    };

    // convert to responsive unit, such as vw
    const parseStyle = (style, option = {}) => {
        if (!style || style.length === 0) {
            return '';
        }
        const { toVW, toREM } = option;
        const styleData = [];
        for (let key in style) {
            let value = style[key];
            if (boxStyleList.indexOf(key) != -1) {
                value = parseInt(value).toFixed(2);
                value = value == 0 ? value : value + 'px';
                styleData.push(`${_.kebabCase(key)}: ${value}`);
            } else if (noUnitStyles.indexOf(key) != -1) {
                styleData.push(`${_.kebabCase(key)}: ${parseFloat(value)}`);
            } else {
                styleData.push(`${_.kebabCase(key)}: ${value}`);
            }
        }
        return styleData.join(';') + ';';
    };

    // parse function, return params and content
    const parseFunction = (func) => {
        const funcString = func.toString();
        const params = funcString.match(/\([^\(\)]*\)/)[0].slice(1, -1);
        const content = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));
        return {
            params,
            content
        };
    }

    // parse layer props(static values or expression)
    const parseProps = (value, isReactNode) => {
        if (typeof value === 'string') {
            if (isExpression(value)) {
                if (isReactNode) {
                    return value.slice(1, -1);
                } else {
                    return value.slice(2, -2);
                }
            }

            if (isReactNode) {
                return value;
            } else {
                return `'${value}'`;
            }
        } else if (typeof value === 'function') {
            const { params, content } = parseFunction(value);
            return `(${params}) => {${content}}`;
        }
    }

    // parse async dataSource
    const parseDataSource = (data) => {
        const name = data.id;
        const { uri, method, params } = data.options;
        const action = data.type;
        let payload = {};

        switch (action) {
            case 'fetch':
                if (imports.indexOf(`import {fetch} from whatwg-fetch`) === -1) {
                    imports.push(`import {fetch} from 'whatwg-fetch'`);
                }
                payload = {
                    method: method
                };

                break;
            case 'jsonp':
                if (imports.indexOf(`import {fetchJsonp} from fetch-jsonp`) === -1) {
                    imports.push(`import jsonp from 'fetch-jsonp'`);
                }
                break;
        }

        Object.keys(data.options).forEach((key) => {
            if (['uri', 'method', 'params'].indexOf(key) === -1) {
                payload[key] = toString(data.options[key]);
            }
        });

        // params parse should in string template
        if (params) {
            payload = `${toString(payload).slice(0, -1)} ,body: ${isExpression(params) ? parseProps(params) : toString(params)}}`;
        } else {
            payload = toString(payload);
        }

        let result = `{
        ${action}(${parseProps(uri)}, ${toString(payload)})
          .then((response) => response.json())
      `;

        if (data.dataHandler) {
            const { params, content } = parseFunction(data.dataHandler);
            result += `.then((${params}) => {${content}})
          .catch((e) => {
            console.log('error', e);
          })
        `
        }

        result += '}';

        return `${name}() ${result}`;
    }

    // parse condition: whether render the layer
    const parseCondition = (condition, render) => {
        if (typeof condition === 'boolean') {
            return `${condition} && ${render}`
        } else if (typeof condition === 'string') {
            return `${condition.slice(2, -2)} && ${render}`
        }
    }

    // parse loop render
    const parseLoop = (loop, loopArg, render) => {
        let data;
        let loopArgItem = (loopArg && loopArg[0]) || 'item';
        let loopArgIndex = (loopArg && loopArg[1]) || 'index';

        if (Array.isArray(loop)) {
            data = toString(loop);
        } else if (isExpression(loop)) {
            data = loop.slice(2, -2);
        }

        // add loop key
        const tagEnd = render.match(/^<.+?\s/)[0].length;
        render = `${render.slice(0, tagEnd)} key={${loopArgIndex}}${render.slice(tagEnd)}`;

        // remove `this` 
        const re = new RegExp(`this.${loopArgItem}`, 'g')
        render = render.replace(re, loopArgItem);

        return `${data}.map((${loopArgItem}, ${loopArgIndex}) => {
        return (${render});
      })`;
    }

    // generate render xml
    const generateRender = (schema) => {
        const type = schema.componentName.toLowerCase();
        const className = schema.props && schema.props.className;
        const classString = className ? ` className={style.${className}}` : '';
        let xml;
        let props = '';

        Object.keys(schema.props).forEach((key) => {
            if (['className', 'style', 'text', 'src'].indexOf(key) === -1) {
                props += ` ${key}={${parseProps(schema.props[key])}}`;
            }
        })

        switch (type) {
            case 'text':
                const innerText = parseProps(schema.props.text, true);
                xml = `<span${classString}${props}>${innerText}</span>`;
                style = `.${className}{${parseStyle(schema.props.style)}}`;
                break;
            case 'image':
                const source = parseProps(schema.props.src);
                xml = `<img${classString}${props} src={${source}} />`;
                style = `.${className}{${parseStyle(schema.props.style)}}`;
                break;
            case 'div':
            case 'page':
            case 'block':
            default:
                if (schema.children && schema.children.length) {
                    xml = `<div${classString}${props}>${transform(schema.children)}</div>`;
                    style = `.${className}{${parseStyle(schema.props.style)}\n${transfromScss(schema.children)}}`;
                } else {
                    xml = `<div${classString}${props} />`;
                }
                break;
        }

        if (schema.loop) {
            xml = parseLoop(schema.loop, schema.loopArgs, xml)
        }
        if (schema.condition) {
            xml = parseCondition(schema.condition, xml);
        }
        if (schema.loop || schema.condition) {
            xml = `{${xml}}`;
        }

        return xml;
    }
    // scss parse 
    const transfromScss = (node) => {

        if (!node) {
            return '';
        }
        let res = '';
        for (let i = 0; i < node.length; i++) {
            let className = (node[i].props && node[i].props.className) || 'content';
            res += `.${className}{${parseStyle(node[i].props.style)}\n${transfromScss(node[i].children)}}\n`;
        }
        return res;
    }
    // parse schema
    const transform = (schema) => {
        let result = '';

        if (Array.isArray(schema)) {
            schema.forEach((layer) => {
                result += transform(layer);
            });
        } else {
            const type = schema.componentName.toLowerCase();

            if (['page', 'block'].indexOf(type) !== -1) {
                // 容器组件处理: state/method/dataSource/lifeCycle/render
                const states = [];
                const lifeCycles = [];
                const methods = [];
                const init = [];
                const render = [`render(){ return (`];
                let classData = [`class ${schema.componentName}_${classes.length} extends Component {`];

                if (schema.state) {
                    states.push(`state = ${toString(schema.state)}`);
                }

                if (schema.methods) {
                    Object.keys(schema.methods).forEach((name) => {
                        const { params, content } = parseFunction(schema.methods[name]);
                        methods.push(`${name}(${params}) {${content}}`);
                    });
                }

                if (schema.dataSource && Array.isArray(schema.dataSource.list)) {
                    schema.dataSource.list.forEach((item) => {
                        if (typeof item.isInit === 'boolean' && item.isInit) {
                            init.push(`this.${item.id}();`)
                        } else if (typeof item.isInit === 'string') {
                            init.push(`if (${parseProps(item.isInit)}) { this.${item.id}(); }`)
                        }
                        methods.push(parseDataSource(item));
                    });

                    if (schema.dataSource.dataHandler) {
                        const { params, content } = parseFunction(schema.dataSource.dataHandler);
                        methods.push(`dataHandler(${params}) {${content}}`);
                        init.push(`this.dataHandler()`);
                    }
                }

                if (schema.lifeCycles) {
                    if (!schema.lifeCycles['_constructor']) {
                        lifeCycles.push(`constructor(props, context) { super(); ${init.join('\n')}}`);
                    }

                    Object.keys(schema.lifeCycles).forEach((name) => {
                        const { params, content } = parseFunction(schema.lifeCycles[name]);

                        if (name === '_constructor') {
                            lifeCycles.push(`constructor(${params}) { super(); ${content} ${init.join('\n')}}`);
                        } else {
                            lifeCycles.push(`${name}(${params}) {${content}}`);
                        }
                    });
                }

                render.push(generateRender(schema))
                render.push(`);}`);

                classData = classData.concat(states).concat(lifeCycles).concat(methods).concat(render);
                classData.push('}');

                classes.push(classData.join('\n'));
            } else {
                result += generateRender(schema);
            }
        }

        return result;
    };



    // start parse schema
    transform(schema);

    const prettierOpt = {
        parser: 'babel',
        printWidth: 120,
        singleQuote: true
    };

    return {
        panelDisplay: [
            {
                panelName: `index.jsx`,
                panelValue: `
            'use strict';
  
            import React, { Component } from 'react';
            ${imports.join('\n')}
            import style from './index.scss';
            ${utils.join('\n')}
            ${classes.join('\n')}
            export default ${schema.componentName}_0;
          `, prettierOpt,
                panelType: 'jsx',
            },
            {
                panelName: `index.scss`,
                panelValue: `${style}`,
                panelType: 'scss'
            }
        ]
    };
}
