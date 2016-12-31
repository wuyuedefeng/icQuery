(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

function createXmlHttpRequestObj() {
    var xmlHttp = null;
    try {
        //Firefox, Opera 8.0+, Safari, chrome
        xmlHttp = new XMLHttpRequest();
    } catch (e) {
        try {
            //Internet Explorer
            xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (e) {
            try {
                xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (e) {
                console.error('您的浏览器不支持ajax！');
            }
        }
    }
    return xmlHttp;
}

function handleConfig(config, onSuccess, onError) {
    config = config || {};
    // 设置headers信息
    config.headers = config.headers || {};
    // get 请求参数
    config.params = config.params || {};
    // post 请求参数
    config.data = config.data || {};
    // 请求发送成功回调
    config.onSuccess = config.onSuccess || onSuccess;
    // 请求发送失败回调
    config.onError = config.onError || onError;
    // 是否发送异步请求
    if (config.async !== false) {
        config.async = true;
    }

    // 设置超市时间 integer ms
    // config.timeout
    if (config.timeout) {
        config.onTimeout = config["onTimeout"] || function (event) {
            console.error(config.url + 'request timeout :' + config.timeout + 'ms');
        };
    }

    /**
     * 发送进度
     * @type {progress}
     * event
     * event.total是需要传输的总字节, seted by the header
     * event.loaded是已经传输的字节
     * 如果event.lengthComputable不为真，则event.total等于0。
     */
    // 与progress事件相关的，还有其他五个事件，可以分别指定回调函数：
    // * load事件：传输成功完成。
    // * abort事件：传输被用户取消。
    // * error事件：传输中出现错误。
    // * loadstart事件：传输开始。
    // * loadEnd事件：传输结束，但是不知道成功还是失败。
    config._onprogress = config._onprogress || function progress(event) {
        if (event["lengthComputable"]) {
            var percentComplete = event["loaded"] / event["total"] * 100;
            // 回调用户绑定的onProgress
            config["onProgress"] && config["onProgress"](percentComplete, event);
        }
    };
    config["onProgress"] = config["onProgress"] || function (percentComplete, event) {
        console.log('progress:', percentComplete);
    };
    /**
     * 请求状态改变
     * @type {Function}
     */
    config._onreadystatechange = config._onreadystatechange || function () {
        // readyState: 该属性表示请求/响应过程的当前活动阶段
        // 0:未初始化。尚未调用open()方法。
        // 1:启动。已经调用open()方法，但尚未调用send()方法。
        // 2:发送。已经调用send()方法，但尚未接受到响应。
        // 3:接收。已经接受到部分响应数据。
        // 4:完成。已经接收到全部的响应数据。
        var readyState = config.xhr.readyState;
        if (readyState == 4) {
            // 4 = "loaded"
            // xhr.response为从服务器获取下来的数据。
            var data = config.xhr.response;
            if (config.xhr.status == 200) {
                // 200 = OK
                // .getResponseHeader('name'): 获取相应的响应头部信息。
                // 参数：name为头部字段名称。返回一个对应的值的字符串。
                // .getAllResponseHeaders():返回一个包含所有头部信息（key-value）的长字符串。
                // xhr.getAllResponseHeaders();    //'Content-Type: text/html'
                var contentType = config.xhr.getResponseHeader('Content-Type');
                if (/json/i.test(contentType)) {
                    data = JSON.parse(config.xhr.responseText);
                } else if (/xml/i.test(contentType)) {
                    data = JSON.parse(config.xhr.responseXML);
                } else {
                    data = config.xhr.responseText;
                }
                config.onSuccess && config.onSuccess(data);
                config["onEnd"] && config["onEnd"](false, data);
            } else {
                config.onError && config.onError(data);
                config["onEnd"] && config["onEnd"](true, data);
            }
        }
    };

    return config;
}

function handleObjToParams(obj) {
    return Object.keys(obj).map(function (key) {
        return key + '=' + obj[key];
    }).join('&');
}

module.exports = {
    createXmlHttpRequestObj: createXmlHttpRequestObj,
    handleConfig: handleConfig,
    handleObjToParams: handleObjToParams
};

},{}],2:[function(require,module,exports){
'use strict';

var tools = require('./_tools');
var http = {
    get: function get(config, onSuccess, onError) {
        if (typeof config == 'string') {
            config = {
                url: config
            };
        }
        config.method = 'GET';
        http.request(config, onSuccess, onError);
    },
    post: function post(config, onSuccess, onError) {
        if (typeof config == 'string') {
            config = {
                url: config
            };
        }
        config.method = "POST";
        http.request(config, onSuccess, onError);
    },
    put: function put(config, onSuccess, onError) {
        config.method = "PUT";
        http.request(config, onSuccess, onError);
    },
    delete: function _delete(config, onSuccess, onError) {
        config.method = "DELETE";
        http.request(config, onSuccess, onError);
    },
    upload: function upload(config, onSuccess, onError) {
        config.method = "UPLOAD";
        http.request(config, onSuccess, onError);
    },
    request: function request(config, onSuccess, onError) {
        // 统一初始化config参数
        tools.handleConfig(config, onSuccess, onError);

        // 创建xmlHttpRequest对象
        var xhr = tools.createXmlHttpRequestObj();
        config.xhr = xhr;

        if (/get|post|put|delete/i.test(config.method)) {
            // get post put delete
            // 进度条监听
            xhr.onprogress = config._onprogress;
        } else if (/upload/i.test(config.method)) {
            // upload
            //【上传进度调用方法实现】
            xhr.upload.onprogress = config._onprogress;
        }
        // 状态改变监听
        xhr.onreadystatechange = config._onreadystatechange;

        // xhr.onload = function () {
        //   console.log('onload: ', this.responseText);
        // };

        // 超时
        if (config.async && config.timeout) {
            xhr.timeout = config.timeout;
            xhr.ontimeout = config["onTimeout"];
        }

        /* .open("method","url",boolean):
         参数：method为请求的类型（get，post等），
         url为路径，
         boolean为是否异步发送请求。
         调用该方法并不会真正发送请求，而只是启动一个请求以备发送。
         */
        var urlParams = tools.handleObjToParams(config.params);
        if (/\?/i.test(config.url)) {
            // url已经存在部分参数
            urlParams = '&' + urlParams;
        } else {
            // url 上没有任何参数
            urlParams = '?' + urlParams;
        }
        // 获取请求方式
        var method = config.method;
        if (/upload/i.test(method)) {
            method = 'POST';
        }
        xhr.open(method, config.url + urlParams, config.async);

        /* .setRequestHeader("name","value"):设置自定义的请求头部信息。
         参数:name为自定义的头部字段的名称
         （不要使用浏览器正常发送的字段名称，并不是所有的浏览器都允许重写默认的头部信息），
         value为自定义的头部字段的值。
         该方法的调用必须在调用open()方法之后且在调用send()方法之前。
         */
        if (/post|put|delete/i.test(config.method)) {
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        for (var key in config.headers) {
            xhr.setRequestHeader(key, config.headers[key]);
        }

        if (/get|post|put|delete/i.test(config.method)) {
            // get post put delete
            // .send(data):将请求发送到服务器。参数data是作为请求主体发送的数据，若不需要传数据，即data为null。服务器在收到响应后，响应的数据会自动填充XHR对象的属性。相关属性有responseText、responseXML、status、statusText、readyStatus
            xhr.send(tools.handleObjToParams(config.data) || null);
        } else if (/upload/i.test(config.method)) {
            // upload
            var form = new FormData(); // FormData 对象
            for (var key in config.data) {
                form.append(key, config.data[key]);
            }
            xhr.send(form);
        }

        //.abort():在接收到响应之前取消异步请求。
        // xhr.abort()

    },
    _tools: tools
};

module.exports = http;

},{"./_tools":1}],3:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * 用来实例IcArray
 * @constructor
 */
function IcArray() {}
var icPrototype = [];
icPrototype.__identify__ = 'IcArray';
IcArray.prototype = icPrototype;
/**
 * 创建icArray数组
 * @param
 * @returns {*|icArray}
 */
function createIcArray() {
    return new IcArray();
}

/**
 * 查找元素节点 $ic(expr)
 * $ic('#myId')  $ic('.myClass') $ic('div')
 * @param expr :string
 * @param rootElement dom default document
 * @param isFindOne 是否只查询找到的第一个，默认查询所有
 */
icPrototype._query = function (expr, rootElement, isFindOne) {
    rootElement = rootElement || document;
    if (typeof expr == 'string') {
        // expr是dom对象
        // if (/^(\.|\*|#|[a-z]).+/i.test(expr)) { // 首字母以 . * 或者 # 开头
        //
        // }

        var doms = [];
        if (isFindOne) {
            doms = [rootElement.querySelector(expr)];
        } else {
            doms = rootElement.querySelectorAll(expr);
        }
        if (doms && doms.length) {
            Array.prototype.push.apply(this, doms);
        }
    }
    return this;
};
/**
 * 查询所有子节点
 * @param expr: string
 * @returns icArray
 */
icPrototype.find = function (expr) {
    expr = expr || '*';
    var icArray = createIcArray();
    this.forEach(function (element) {
        icArray._query(expr, element);
    });
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.find.icDesc = '查询所有子孙节点,默认查询所有';
/* #endif */

icPrototype.findOne = function (expr) {
    var icArray = createIcArray();
    this.forEach(function (element) {
        icArray._query(expr, element, true);
    });
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.findOne.icDesc = '查询所有子孙节点中的第一个';
/* #endif */

icPrototype.children = function () {
    var icArray = createIcArray();
    this.forEach(function (element) {
        element.childNodes.forEach(function (childNode) {
            if (childNode.nodeType == 1) {
                icArray.push(childNode);
            }
        });
    });
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.children.icDesc = '查询所有儿子节点(不包括孙子)';
/* #endif */

icPrototype.parent = function (expr) {
    var icArray = createIcArray();
    this.forEach(function (element) {
        var parent = element.parentNode;
        // nodeType: http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
        if (parent && parent.nodeType == 1) {
            if (!expr) {
                icArray.push(parent);
            } else {
                var exprElements = createIcArray()._query(expr);
                if (exprElements.indexOf(parent) != -1) {
                    icArray.push(parent);
                }
            }
        }
    });
    return icArray.$icUniq();
};
/* #if icNote === 'exist' */
icPrototype.parent.icDesc = '获取直接父亲节点(亲生父亲)，传递expr表示查找某种类型的直接父亲节点';
/* #endif */

icPrototype.parents = function (expr) {
    var parentsElements = this.parent();
    if (parentsElements.length) {
        Array.prototype.push.apply(parentsElements, parentsElements.parents());
    }
    if (expr) {
        var exprElements = createIcArray()._query(expr);
        var icArray = createIcArray();
        exprElements.forEach(function (item) {
            if (parentsElements.indexOf(item) != -1) {
                icArray.push(item);
            }
        });
        parentsElements = icArray;
    }
    return parentsElements.$icUniq();
};
/* #if icNote === 'exist' */
icPrototype.parents.icDesc = '获取所有祖先(父亲，爷爷..)，传递expr表示查找某种类型的祖先节点';
/* #endif */

function getElementSiblings(element, expr) {
    var siblings = [];
    var _element = element;
    while (_element = _element.previousSibling) {
        if (_element.nodeType == 1) {
            siblings.push(_element);
        }
    }
    _element = element;
    while (_element = _element.nextSibling) {
        if (_element.nodeType == 1) {
            siblings.push(_element);
        }
    }
    if (expr) {
        var exprElements = createIcArray()._query(expr);
        siblings = siblings.filter(function (element) {
            return exprElements.indexOf(element) != -1;
        });
    }
    return siblings;
}
icPrototype.siblings = function (expr) {
    var icArray = createIcArray();
    this.forEach(function (element) {
        Array.prototype.push.apply(icArray, getElementSiblings(element, expr));
    });
    return icArray.$icUniq();
};
/* #if icNote === 'exist' */
icPrototype.siblings.icDesc = '查找兄弟节点，不分前后';
/* #endif */

////////////////////////////////////////////////////////////////////
//    类操作相关
////////////////////////////////////////////////////////////////////
function operateClass(op, icArray, className, cb) {
    var classNames = className instanceof Array ? className : className.split(' ');
    icArray.forEach(function (element) {
        classNames.forEach(function (classItem) {
            var value = element.classList[op](classItem);
            cb && cb(value);
        });
    });
}
/**
 * 添加类
 * @param className :string or array 被追加的类名
 */
icPrototype.addClass = function (className) {
    operateClass('add', this, className);
};
/* #if icNote === 'exist' */
icPrototype.addClass.icDesc = '追加一个或多个新的类(参数：string or array)';
/* #endif */

icPrototype.removeClass = function (className) {
    operateClass('remove', this, className);
};
/* #if icNote === 'exist' */
icPrototype.removeClass.icDesc = '删除一个或多个已有类(参数：string or array)';
/* #endif */

icPrototype.replaceClass = function (removeClass, addClass) {
    this.removeClass(removeClass);
    this.addClass(addClass);
};
/* #if icNote === 'exist' */
icPrototype.replaceClass.icDesc = '先删除参数1的类，再添加参数2的类，参数1、2：string or array';
/* #endif */

icPrototype.toggleClass = function (className) {
    operateClass('toggle', this, className);
};
/* #if icNote === 'exist' */
icPrototype.toggleClass.icDesc = '存在class移除，不存在添加， 参数：string or array';
/* #endif */

icPrototype.containsClass = function (className) {
    var allContain = true;
    operateClass('contains', this, className, function (isContainItem) {
        if (!isContainItem) {
            allContain = isContainItem;
        }
    });
    return allContain;
};
/* #if icNote === 'exist' */
icPrototype.containsClass.icDesc = '判断icArray中每个元素是否都存在传递的所有类， 参数：string or array';
/* #endif */

icPrototype.clientWidth = function () {
    return this.length && this[0].clientWidth || 0;
};
/* #if icNote === 'exist' */
icPrototype.clientWidth.icDesc = '是对象可见的宽度，不包滚动条等边线，会随窗口的显示大小改变,返回整型';
/* #endif */

icPrototype.offsetWidth = function () {
    return this.length && this[0].offsetWidth || 0;
};
/* #if icNote === 'exist' */
icPrototype.offsetWidth.icDesc = '是对象的可见宽度，包滚动条等边线，会随窗口的显示大小改变,返回整型';
/* #endif */

icPrototype.scrollWidth = function () {
    return this.length && this[0].scrollWidth || 0;
};
/* #if icNote === 'exist' */
icPrototype.scrollWidth.icDesc = '对象实际内容的宽度,返回整型';
/* #endif */

icPrototype.offsetParent = function () {
    // 原生offsetParent如果自身有fixed定位，返回null，FirFox返回body标签。
    var e = this.length && this[0].offsetParent;
    var icArray = createIcArray();
    if (e) {
        icArray.push(e);
    } else {
        icArray = icArray._query('body');
    }
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.offsetParent.icDesc = '与当前元素最近的经过定位(position不等于static)的父级元素, 主要分为' + '\n【1】元素自身有fixed定位，offsetParent的结果为body' + '\n【2】元素自身无fixed定位，且父级元素都未经过定位，offsetParent的结果为body' + '\n【3】元素自身无fixed定位，且父级元素存在经过定位的元素，offsetParent的结果为离自身元素最近的经过定位的父级px';
/* #endif */

icPrototype.offset = function () {
    var elem = this.length && this[0];
    var sumOffsetLeft = 0;
    var sumOffsetTop = 0;
    while (elem) {
        sumOffsetLeft += elem.offsetLeft;
        sumOffsetTop += elem.offsetTop;
        if (/body/i.test(elem.tagName)) {
            break;
        } else {
            elem = elem.offsetParent;
        }
    }
    return {
        left: sumOffsetLeft,
        top: sumOffsetTop
    };
};
/* #if icNote === 'exist' */
icPrototype.offset.icDesc = '只读, 计算元素offsetLeft, offsetTop偏移到body元素的距离和，返回{left: num, top: num}，单位px';
/* #endif */

icPrototype.position = function () {
    return {
        left: this.length && this[0].offsetLeft || 0,
        top: this.length && this[0].offsetTop || 0
    };
};
/* #if icNote === 'exist' */
icPrototype.position.icDesc = '只读,相对于版面或由 offsetParent 属性指定的父坐标的计算上侧和左侧位置，返回{left: num, top: num}，单位px';
/* #endif */

icPrototype.scrollTop = function (val) {
    if (/number|string/i.test(typeof val === 'undefined' ? 'undefined' : _typeof(val)) && this.length) {
        this[0].scrollTop = val;
    }
    return this.length && this[0].scrollTop || 0;
};
/* #if icNote === 'exist' */
icPrototype.scrollTop.icDesc = '读写，获取或设置元素滚动距离,返回整数，赋值整数， 单位px';
/* #endif */

////////////////////////////////////////////////////////////////////
//    事件相关
////////////////////////////////////////////////////////////////////
function bindEvents(icArray, events, cb) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    icArray.forEach(function (element) {
        events.forEach(function (type) {
            bindEvent(element, type, cb, useCapture);
        });
    });
}
function unbindEvents(icArray, events, cb) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    icArray.forEach(function (element) {
        events.forEach(function (type) {
            unbindEvent(element, type, cb, useCapture);
        });
    });
}
function bindEvent(element, type, cb) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (element.addEventListener) {
        element.addEventListener(type, cb, useCapture);
    } else if (element.attachEvent) {
        element.attachEvent("on" + type, cb);
    } else {
        element["on" + type] = cb;
    }
}
function unbindEvent(element, type, cb) {
    var useCapture = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    if (element.removeEventListener) {
        element.removeEventListener(type, cb, useCapture);
    } else if (element.detachEvent) {
        element.detachEvent("on" + type, cb);
    } else {
        element["on" + type] = null;
    }
}
icPrototype.on = function (event, cb) {
    var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var events = event instanceof Array ? event : event.split(' ');
    bindEvents(this, events, cb, useCapture);
};
/* #if icNote === 'exist' */
icPrototype.on.icDesc = '绑定事件如：click hover ..., 参数：event: string or array, ' + '\nuseCapture: ' + '\n[1]true 的触发顺序总是在 false 之前' + '\n[2]如果多个均为 true，则外层的触发先于内层' + '\n[3]如果多个均为 false，则内层的触发先于外层' + '\n 解除绑定 off ';
/* #endif */

icPrototype.one = function (event, cb) {
    var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var events = event instanceof Array ? event : event.split(' ');
    function oneCb(event) {
        cb && cb(event);
        unbindEvent(event.target, event.type, oneCb, useCapture);
    }
    bindEvents(this, events, oneCb, useCapture);
};
/* #if icNote === 'exist' */
icPrototype.one.icDesc = '绑定事件如：click hover ..., 执行一次后，将解除事件绑定 参数：event: string or array, ' + '\nuseCapture: ' + '\n[1]true 的触发顺序总是在 false 之前' + '\n[2]如果多个均为 true，则外层的触发先于内层' + '\n[3]如果多个均为 false，则内层的触发先于外层';
/* #endif */

icPrototype.off = function (event, cb) {
    var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var events = event instanceof Array ? event : event.split(' ');
    unbindEvents(this, events, cb, useCapture);
};
/* #if icNote === 'exist' */
icPrototype.off.icDesc = '解除绑定事件如：click hover ..., 参数：event: string or array, ' + '\nuseCapture: ' + '\n[1]true 的触发顺序总是在 false 之前' + '\n[2]如果多个均为 true，则外层的触发先于内层' + '\n[3]如果多个均为 false，则内层的触发先于外层';

/* #endif */

module.exports = {
    IcArray: IcArray,
    createIcArray: createIcArray
};

},{}],4:[function(require,module,exports){
'use strict';

function $ic(expr) {
    var icArray = require('./_createIcArray').createIcArray();
    if (typeof expr == 'function') {
        // 函数
        var afterPageLoaded = function afterPageLoaded() {
            expr($ic);
        };

        if (window.addEventListener) window.addEventListener("load", afterPageLoaded, false);else if (window.attachEvent) window.attachEvent("onload", afterPageLoaded);else window.onload = afterPageLoaded;
    } else if (expr instanceof Element) {
        // dom对象
        icArray.push(expr);
    } else if (typeof expr == 'string') {
        icArray._query(expr); // 字符串
    }
    return icArray;
}

////////////////////////////////////////////////////////////////////
//    数组拓展
////////////////////////////////////////////////////////////////////
Array.prototype.$icUniq = function () {
    var handle = this.filter(function (value, index, self) {
        return self.indexOf(value) === index;
    });
    // handle = [...new Set(data)];  // if support es6
    var icArray = handle;
    if (this.__identify__ == 'IcArray') {
        icArray = $ic();
        Array.prototype.push.apply(icArray, handle);
    }
    return icArray;
};

module.exports = $ic;

},{"./_createIcArray":3}],5:[function(require,module,exports){
'use strict';

(function () {
    // 获取ic
    var $ic = require('./ic/ic');

    // 对ic添加静态方法
    $ic.http = require('./http/http');

    if (!window['$ic']) {
        window['$ic'] = $ic;
    }
    window['$icQuery'] = $ic;
})();

},{"./http/http":2,"./ic/ic":4}]},{},[5]);
