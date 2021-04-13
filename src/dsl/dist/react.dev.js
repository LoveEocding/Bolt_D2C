"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _default(schema) {
  // imports
  var imports = []; // inline style

  var style = ""; // Global Public Functions

  var utils = []; // Classes 

  var classes = [];

  var isExpression = function isExpression(value) {
    return /^\{\{.*\}\}$/.test(value);
  }; // no unit style


  var noUnitStyles = ['opacity', 'fontWeight']; // box relative style

  var boxStyleList = ['fontSize', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'height', 'top', 'bottom', 'width', 'maxWidth', 'left', 'right', 'paddingRight', 'paddingLeft', 'marginLeft', 'marginRight', 'lineHeight', 'borderBottomRightRadius', 'borderBottomLeftRadius', 'borderTopRightRadius', 'borderTopLeftRadius', 'borderRadius'];

  var toString = function toString(value) {
    if ({}.toString.call(value) === '[object Function]') {
      return value.toString();
    }

    if (typeof value === 'string') {
      return value;
    }

    if (_typeof(value) === 'object') {
      return JSON.stringify(value, function (key, value) {
        if (typeof value === 'function') {
          return value.toString();
        } else {
          return value;
        }
      });
    }

    return String(value);
  }; // convert to responsive unit, such as vw


  var parseStyle = function parseStyle(style) {
    var option = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (!style || style.length === 0) {
      return '';
    }

    var toVW = option.toVW,
        toREM = option.toREM;
    var styleData = [];

    for (var key in style) {
      var value = style[key];

      if (boxStyleList.indexOf(key) != -1) {
        value = parseInt(value).toFixed(2);
        value = value == 0 ? value : value + 'px';
        styleData.push("".concat(_lodash["default"].kebabCase(key), ": ").concat(value));
      } else if (noUnitStyles.indexOf(key) != -1) {
        styleData.push("".concat(_lodash["default"].kebabCase(key), ": ").concat(parseFloat(value)));
      } else {
        styleData.push("".concat(_lodash["default"].kebabCase(key), ": ").concat(value));
      }
    }

    return styleData.join(';') + ';';
  }; // parse function, return params and content


  var parseFunction = function parseFunction(func) {
    var funcString = func.toString();
    var params = funcString.match(/\([^\(\)]*\)/)[0].slice(1, -1);
    var content = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));
    return {
      params: params,
      content: content
    };
  }; // parse layer props(static values or expression)


  var parseProps = function parseProps(value, isReactNode) {
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
        return "'".concat(value, "'");
      }
    } else if (typeof value === 'function') {
      var _parseFunction = parseFunction(value),
          params = _parseFunction.params,
          content = _parseFunction.content;

      return "(".concat(params, ") => {").concat(content, "}");
    }
  }; // parse async dataSource


  var parseDataSource = function parseDataSource(data) {
    var name = data.id;
    var _data$options = data.options,
        uri = _data$options.uri,
        method = _data$options.method,
        params = _data$options.params;
    var action = data.type;
    var payload = {};

    switch (action) {
      case 'fetch':
        if (imports.indexOf("import {fetch} from whatwg-fetch") === -1) {
          imports.push("import {fetch} from 'whatwg-fetch'");
        }

        payload = {
          method: method
        };
        break;

      case 'jsonp':
        if (imports.indexOf("import {fetchJsonp} from fetch-jsonp") === -1) {
          imports.push("import jsonp from 'fetch-jsonp'");
        }

        break;
    }

    Object.keys(data.options).forEach(function (key) {
      if (['uri', 'method', 'params'].indexOf(key) === -1) {
        payload[key] = toString(data.options[key]);
      }
    }); // params parse should in string template

    if (params) {
      payload = "".concat(toString(payload).slice(0, -1), " ,body: ").concat(isExpression(params) ? parseProps(params) : toString(params), "}");
    } else {
      payload = toString(payload);
    }

    var result = "{\n        ".concat(action, "(").concat(parseProps(uri), ", ").concat(toString(payload), ")\n          .then((response) => response.json())\n      ");

    if (data.dataHandler) {
      var _parseFunction2 = parseFunction(data.dataHandler),
          _params = _parseFunction2.params,
          content = _parseFunction2.content;

      result += ".then((".concat(_params, ") => {").concat(content, "})\n          .catch((e) => {\n            console.log('error', e);\n          })\n        ");
    }

    result += '}';
    return "".concat(name, "() ").concat(result);
  }; // parse condition: whether render the layer


  var parseCondition = function parseCondition(condition, render) {
    if (typeof condition === 'boolean') {
      return "".concat(condition, " && ").concat(render);
    } else if (typeof condition === 'string') {
      return "".concat(condition.slice(2, -2), " && ").concat(render);
    }
  }; // parse loop render


  var parseLoop = function parseLoop(loop, loopArg, render) {
    var data;
    var loopArgItem = loopArg && loopArg[0] || 'item';
    var loopArgIndex = loopArg && loopArg[1] || 'index';

    if (Array.isArray(loop)) {
      data = toString(loop);
    } else if (isExpression(loop)) {
      data = loop.slice(2, -2);
    } // add loop key


    var tagEnd = render.match(/^<.+?\s/)[0].length;
    render = "".concat(render.slice(0, tagEnd), " key={").concat(loopArgIndex, "}").concat(render.slice(tagEnd)); // remove `this` 

    var re = new RegExp("this.".concat(loopArgItem), 'g');
    render = render.replace(re, loopArgItem);
    return "".concat(data, ".map((").concat(loopArgItem, ", ").concat(loopArgIndex, ") => {\n        return (").concat(render, ");\n      })");
  }; // generate render xml


  var generateRender = function generateRender(schema) {
    var type = schema.componentName.toLowerCase();
    var className = schema.props && schema.props.className;
    var classString = className ? " className={style.".concat(className, "}") : '';
    var xml;
    var props = '';
    Object.keys(schema.props).forEach(function (key) {
      if (['className', 'style', 'text', 'src'].indexOf(key) === -1) {
        props += " ".concat(key, "={").concat(parseProps(schema.props[key]), "}");
      }
    });

    switch (type) {
      case 'text':
        var innerText = parseProps(schema.props.text, true);
        xml = "<span".concat(classString).concat(props, ">").concat(innerText, "</span>");
        style = ".".concat(className, "{").concat(parseStyle(schema.props.style), "}");
        break;

      case 'image':
        var source = parseProps(schema.props.src);
        xml = "<img".concat(classString).concat(props, " src={").concat(source, "} />");
        style = ".".concat(className, "{").concat(parseStyle(schema.props.style), "}");
        break;

      case 'div':
      case 'page':
      case 'block':
      default:
        if (schema.children && schema.children.length) {
          xml = "<div".concat(classString).concat(props, ">").concat(transform(schema.children), "</div>");
          style = ".".concat(className, "{").concat(parseStyle(schema.props.style), "\n").concat(transfromScss(schema.children), "}");
        } else {
          xml = "<div".concat(classString).concat(props, " />");
        }

        break;
    }

    if (schema.loop) {
      xml = parseLoop(schema.loop, schema.loopArgs, xml);
    }

    if (schema.condition) {
      xml = parseCondition(schema.condition, xml);
    }

    if (schema.loop || schema.condition) {
      xml = "{".concat(xml, "}");
    }

    return xml;
  }; // scss parse 


  var transfromScss = function transfromScss(node) {
    if (!node) {
      return '';
    }

    var res = '';

    for (var i = 0; i < node.length; i++) {
      var className = node[i].props && node[i].props.className || 'content';
      res += ".".concat(className, "{").concat(parseStyle(node[i].props.style), "\n").concat(transfromScss(node[i].children), "}\n");
    }

    return res;
  }; // parse schema


  var transform = function transform(schema) {
    var result = '';

    if (Array.isArray(schema)) {
      schema.forEach(function (layer) {
        result += transform(layer);
      });
    } else {
      var type = schema.componentName.toLowerCase();

      if (['page', 'block'].indexOf(type) !== -1) {
        // 容器组件处理: state/method/dataSource/lifeCycle/render
        var states = [];
        var lifeCycles = [];
        var methods = [];
        var init = [];
        var render = ["render(){ return ("];
        var classData = ["class ".concat(schema.componentName, "_").concat(classes.length, " extends Component {")];

        if (schema.state) {
          states.push("state = ".concat(toString(schema.state)));
        }

        if (schema.methods) {
          Object.keys(schema.methods).forEach(function (name) {
            var _parseFunction3 = parseFunction(schema.methods[name]),
                params = _parseFunction3.params,
                content = _parseFunction3.content;

            methods.push("".concat(name, "(").concat(params, ") {").concat(content, "}"));
          });
        }

        if (schema.dataSource && Array.isArray(schema.dataSource.list)) {
          schema.dataSource.list.forEach(function (item) {
            if (typeof item.isInit === 'boolean' && item.isInit) {
              init.push("this.".concat(item.id, "();"));
            } else if (typeof item.isInit === 'string') {
              init.push("if (".concat(parseProps(item.isInit), ") { this.").concat(item.id, "(); }"));
            }

            methods.push(parseDataSource(item));
          });

          if (schema.dataSource.dataHandler) {
            var _parseFunction4 = parseFunction(schema.dataSource.dataHandler),
                params = _parseFunction4.params,
                content = _parseFunction4.content;

            methods.push("dataHandler(".concat(params, ") {").concat(content, "}"));
            init.push("this.dataHandler()");
          }
        }

        if (schema.lifeCycles) {
          if (!schema.lifeCycles['_constructor']) {
            lifeCycles.push("constructor(props, context) { super(); ".concat(init.join('\n'), "}"));
          }

          Object.keys(schema.lifeCycles).forEach(function (name) {
            var _parseFunction5 = parseFunction(schema.lifeCycles[name]),
                params = _parseFunction5.params,
                content = _parseFunction5.content;

            if (name === '_constructor') {
              lifeCycles.push("constructor(".concat(params, ") { super(); ").concat(content, " ").concat(init.join('\n'), "}"));
            } else {
              lifeCycles.push("".concat(name, "(").concat(params, ") {").concat(content, "}"));
            }
          });
        }

        render.push(generateRender(schema));
        render.push(");}");
        classData = classData.concat(states).concat(lifeCycles).concat(methods).concat(render);
        classData.push('}');
        classes.push(classData.join('\n'));
      } else {
        result += generateRender(schema);
      }
    }

    return result;
  }; // start parse schema


  transform(schema);
  var prettierOpt = {
    parser: 'babel',
    printWidth: 120,
    singleQuote: true
  };
  return {
    panelDisplay: [{
      panelName: "index.jsx",
      panelValue: "\n            'use strict';\n  \n            import React, { Component } from 'react';\n            ".concat(imports.join('\n'), "\n            import style from './index.scss';\n            ").concat(utils.join('\n'), "\n            ").concat(classes.join('\n'), "\n            export default ").concat(schema.componentName, "_0;\n          "),
      prettierOpt: prettierOpt,
      panelType: 'jsx'
    }, {
      panelName: "index.scss",
      panelValue: "".concat(style),
      panelType: 'scss'
    }]
  };
}