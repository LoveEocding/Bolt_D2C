"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = _default;

var _lodash = _interopRequireDefault(require("lodash"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _default(schema) {
  // template
  var template = []; // imports

  var imports = []; // Global Public Functions

  var utils = []; // data

  var datas = [];
  var constants = {}; // methods

  var methods = [];
  var expressionName = []; // lifeCycles

  var lifeCycles = []; // styles

  var styles = ""; // box relative style

  var boxStyleList = ['fontSize', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'height', 'top', 'bottom', 'width', 'maxWidth', 'left', 'right', 'paddingRight', 'paddingLeft', 'marginLeft', 'marginRight', 'lineHeight', 'borderBottomRightRadius', 'borderBottomLeftRadius', 'borderTopRightRadius', 'borderTopLeftRadius', 'borderRadius']; // no unit style

  var noUnitStyles = ['opacity', 'fontWeight'];
  var lifeCycleMap = {
    _constructor: 'created',
    getDerivedStateFromProps: 'beforeUpdate',
    render: '',
    componentDidMount: 'mounted',
    componentDidUpdate: 'updated',
    componentWillUnmount: 'beforeDestroy'
  };
  var width = 750;
  var viewportWidth = 375;
  var htmlFontsize = viewportWidth ? viewportWidth / 10 : null; // 1vw = width / 100

  var _w = width / 100;

  var _ratio = width / viewportWidth;

  var isExpression = function isExpression(value) {
    return /^\{\{.*\}\}$/.test(value);
  };

  var transformEventName = function transformEventName(name) {
    return name.replace('on', '').toLowerCase();
  };

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
    var toVW = option.toVW,
        toREM = option.toREM;
    var styleData = [];

    for (var key in style) {
      var value = style[key];

      if (boxStyleList.indexOf(key) != -1) {
        if (toVW) {
          value = (parseInt(value) / _w).toFixed(2);
          value = value == 0 ? value : value + 'vw';
        } else if (toREM && htmlFontsize) {
          var valueNum = typeof value == 'string' ? value.replace(/(px)|(rem)/, '') : value;
          var fontSize = (valueNum * (viewportWidth / width)).toFixed(2);
          value = parseFloat((fontSize / htmlFontsize).toFixed(2));
          value = value ? "".concat(value, "rem") : value;
        } else {
          value = parseInt(value).toFixed(2);
          value = value == 0 ? value : value + 'px';
        }

        styleData.push("".concat(_lodash["default"].kebabCase(key), ": ").concat(value));
      } else if (noUnitStyles.indexOf(key) != -1) {
        styleData.push("".concat(_lodash["default"].kebabCase(key), ": ").concat(parseFloat(value)));
      } else {
        styleData.push("".concat(_lodash["default"].kebabCase(key), ": ").concat(value));
      }
    }

    return styleData.join(';\n');
  }; // parse function, return params and content


  var parseFunction = function parseFunction(func) {
    var funcString = func.toString();
    var name = funcString.slice(funcString.indexOf('function'), funcString.indexOf('(')).replace('function ', '');
    var params = funcString.match(/\([^\(\)]*\)/)[0].slice(1, -1);
    var content = funcString.slice(funcString.indexOf('{') + 1, funcString.lastIndexOf('}'));
    return {
      params: params,
      content: content,
      name: name
    };
  }; // parse layer props(static values or expression)


  var parseProps = function parseProps(value, isReactNode, constantName) {
    if (typeof value === 'string') {
      if (isExpression(value)) {
        if (isReactNode) {
          return "{{".concat(value.slice(7, -2), "}}");
        } else {
          return value.slice(2, -2);
        }
      }

      if (isReactNode) {
        return value;
      } else if (constantName) {
        // save to constant
        expressionName[constantName] = expressionName[constantName] ? expressionName[constantName] + 1 : 1;
        var name = "".concat(constantName).concat(expressionName[constantName]);
        constants[name] = value;
        return "\"constants.".concat(name, "\"");
      } else {
        return "\"".concat(value, "\"");
      }
    } else if (typeof value === 'function') {
      var _parseFunction = parseFunction(value),
          params = _parseFunction.params,
          content = _parseFunction.content,
          _name = _parseFunction.name;

      expressionName[_name] = expressionName[_name] ? expressionName[_name] + 1 : 1;
      methods.push("".concat(_name, "_").concat(expressionName[_name], "(").concat(params, ") {").concat(content, "}"));
      return "".concat(_name, "_").concat(expressionName[_name]);
    } else {
      return "\"".concat(value, "\"");
    }
  };

  var parsePropsKey = function parsePropsKey(key, value) {
    if (typeof value === 'function') {
      return "@".concat(transformEventName(key));
    } else {
      return ":".concat(key);
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
    var _condition = isExpression(condition) ? condition.slice(2, -2) : condition;

    if (typeof _condition === 'string') {
      _condition = _condition.replace('this.', '');
    }

    render = render.replace(/^<\w+\s/, "".concat(render.match(/^<\w+\s/)[0], " v-if=\"").concat(_condition, "\" "));
    return render;
  }; // parse loop render


  var parseLoop = function parseLoop(loop, loopArg, render) {
    var data;
    var loopArgItem = loopArg && loopArg[0] || 'item';
    var loopArgIndex = loopArg && loopArg[1] || 'index';

    if (Array.isArray(loop)) {
      data = 'loopData';
      datas.push("".concat(data, ": ").concat(toString(loop)));
    } else if (isExpression(loop)) {
      data = loop.slice(2, -2).replace('this.state.', '');
    } // add loop key


    var tagEnd = render.indexOf('>');
    var keyProp = render.slice(0, tagEnd).indexOf('key=') == -1 ? ":key=\"index\"" : '';
    render = "\n        ".concat(render.slice(0, tagEnd), "\n        v-for=\"(").concat(loopArgItem, ", ").concat(loopArgIndex, ") in ").concat(data, "\"  \n        ").concat(keyProp, "\n        ").concat(render.slice(tagEnd)); // remove `this`

    var re = new RegExp("this.".concat(loopArgItem), 'g');
    render = render.replace(re, loopArgItem);
    return render;
  }; // generate render xml


  var generateRender = function generateRender(schema) {
    var type = schema.componentName.toLowerCase();
    var className = schema.props && schema.props.className;
    var classString = className ? " class=\"".concat(className, "\"") : ''; // if (className) {
    //   styles.push(`
    //     .${className} {
    //       ${parseStyle(schema.props.style)}
    //     }
    //   `);
    //   styles4vw.push(`
    //     .${className} {
    //       ${parseStyle(schema.props.style, { toVW: true })}
    //     }
    //   `);
    //   styles4rem.push(`
    //     .${className} {
    //       ${parseStyle(schema.props.style, { toREM: true })}
    //     }
    //   `);
    // }

    var xml;
    var props = '';
    Object.keys(schema.props).forEach(function (key) {
      if (['className', 'style', 'text', 'src', 'lines'].indexOf(key) === -1) {
        props += " ".concat(parsePropsKey(key, schema.props[key]), "=").concat(parseProps(schema.props[key]));
      }
    });

    switch (type) {
      case 'text':
        var innerText = parseProps(schema.props.text, true);
        xml = "<span".concat(classString).concat(props, ">").concat(innerText, "</span> \n");
        styles = ".".concat(className, "{").concat(parseStyle(schema.props.style), "}");
        break;

      case 'image':
        var source = parseProps(schema.props.src, false);

        if (!source.match('"')) {
          source = "\"".concat(source, "\"");
          xml = "<img".concat(classString).concat(props, " :src=").concat(source, " />\n ");
        } else {
          xml = "<img".concat(classString).concat(props, " src=").concat(source, " /> \n");
        }

        styles = ".".concat(className, "{").concat(parseStyle(schema.props.style), "}");
        break;

      case 'div':
      case 'page':
      case 'block':
      case 'component':
      default:
        if (schema.children && schema.children.length) {
          xml = "<div".concat(classString).concat(props, ">").concat(transform(schema.children), "</div>\n");
          styles = ".".concat(className, "{\n").concat(parseStyle(schema.props.style), ";\n").concat(transfromScss(schema.children), "}\n");
        } else {
          xml = "<div".concat(classString).concat(props, " />");
        }

    }

    if (schema.loop) {
      xml = parseLoop(schema.loop, schema.loopArgs, xml);
    }

    if (schema.condition) {
      xml = parseCondition(schema.condition, xml); // console.log(xml);
    }

    return xml || '';
  }; // scss parse 


  var transfromScss = function transfromScss(node) {
    if (!node) {
      return '';
    }

    var res = '';

    for (var i = 0; i < node.length; i++) {
      var className = node[i].props && node[i].props.className || 'content';
      res += ".".concat(className, "{\n").concat(parseStyle(node[i].props.style), ";\n").concat(transfromScss(node[i].children), "}\n");
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

      if (['page', 'block', 'component'].indexOf(type) !== -1) {
        // 容器组件处理: state/method/dataSource/lifeCycle/render
        var init = [];

        if (schema.state) {
          datas.push("".concat(toString(schema.state).slice(1, -1)));
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
            lifeCycles.push("".concat(lifeCycleMap['_constructor'], "() { ").concat(init.join('\n'), "}"));
          }

          Object.keys(schema.lifeCycles).forEach(function (name) {
            var vueLifeCircleName = lifeCycleMap[name] || name;

            var _parseFunction5 = parseFunction(schema.lifeCycles[name]),
                params = _parseFunction5.params,
                content = _parseFunction5.content;

            if (name === '_constructor') {
              lifeCycles.push("".concat(vueLifeCircleName, "() {").concat(content, " ").concat(init.join('\n'), "}"));
            } else {
              lifeCycles.push("".concat(vueLifeCircleName, "() {").concat(content, "}"));
            }
          });
        }

        template.push(generateRender(schema));
      } else {
        result += generateRender(schema);
      }
    }

    return result;
  }; // start parse schema


  transform(schema);
  datas.push("constants: ".concat(toString(constants)));
  var prettierOpt = {
    parser: 'vue',
    printWidth: 80,
    singleQuote: true
  };
  return {
    panelDisplay: [{
      panelName: "index.vue",
      panelValue: "\n            <template>\n                ".concat(template, "\n            </template>\n            <script>\n              ").concat(imports.join('\n'), "\n              export default {\n                data() {\n                  return {\n                    ").concat(datas.join(',\n'), "\n                  } \n                },\n                methods: {\n                  ").concat(methods.join(',\n'), "\n                },\n                ").concat(lifeCycles.join(',\n'), "\n              }\n            </script>s\n            <style src=\"./index.response.scss\" />\n          "),
      panelType: 'vue'
    }, {
      panelName: 'index.scss',
      panelValue: "".concat(styles),
      panelType: 'scss'
    }]
  };
}

;