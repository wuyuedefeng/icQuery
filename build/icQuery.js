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
    request: function request(config, onSuccess, onError) {
        // 统一初始化config参数
        tools.handleConfig(config, onSuccess, onError);

        // 创建xmlHttpRequest对象
        var xhr = tools.createXmlHttpRequestObj();
        config.xhr = xhr;

        // 进度条监听
        xhr.onprogress = config._onprogress;
        // 状态改变监听
        xhr.onreadystatechange = config._onreadystatechange;

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
        xhr.open(config.method, config.url + urlParams, config.async);

        /* .setRequestHeader("name","value"):设置自定义的请求头部信息。
         参数:name为自定义的头部字段的名称
         （不要使用浏览器正常发送的字段名称，并不是所有的浏览器都允许重写默认的头部信息），
         value为自定义的头部字段的值。
         该方法的调用必须在调用open()方法之后且在调用send()方法之前。
         */
        if (!/get/i.test('get')) {
            xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        }
        for (var key in config.headers) {
            xhr.setRequestHeader(key, config.headers[key]);
        }

        // .send(data):将请求发送到服务器。参数data是作为请求主体发送的数据，若不需要传数据，即data为null。服务器在收到响应后，响应的数据会自动填充XHR对象的属性。相关属性有responseText、responseXML、status、statusText、readyStatus
        xhr.send(tools.handleObjToParams(config.data) || null);

        //.abort():在接收到响应之前取消异步请求。
        // xhr.abort()

    },
    _tools: tools
};

module.exports = http;

},{"./_tools":1}],3:[function(require,module,exports){
'use strict';

function IcArray() {}
var icPrototype = [];
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
 * 查找元素节点 $ic(query)
 * $ic('#myId')  $ic('.myClass') $ic('div')
 * @param query :string
 * @param rootElement dom default document
 */
icPrototype._query = function (query, rootElement) {
    rootElement = rootElement || document;
    if (typeof query == 'string') {
        if (/^(\.|#).+/i.test(query)) {
            // 首字母以 . 或者 # 开头
            var doms = rootElement.querySelectorAll(query);
            if (doms && doms.length) {
                Array.prototype.push.apply(this, doms);
            }
        } else if (/^[a-z]+$/i.test(query)) {
            var doms = rootElement.querySelectorAll(query);
            if (doms && doms.length) {
                Array.prototype.push.apply(this, doms);
            }
        }
    }
    return this;
};
/**
 * 查询所有子节点
 * @param query: string
 * @returns icArray
 */
icPrototype.find = function (query) {
    var icArray = createIcArray();
    this.forEach(function (element) {
        icArray._query(query, element);
    });
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.find.icDesc = '查询所有子孙节点';
/* #endif */

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
icPrototype.offsetParent.icDesc = '与当前元素最近的经过定位(position不等于static)的父级元素, 主要分为' + '\n【1】元素自身有fixed定位，offsetParent的结果为body' + '\n【2】元素自身无fixed定位，且父级元素都未经过定位，offsetParent的结果为body' + '\n【3】元素自身无fixed定位，且父级元素存在经过定位的元素，offsetParent的结果为离自身元素最近的经过定位的父级元素';
/* #endif */

icPrototype.offsetTop = function () {
    return this.length && this[0].offsetTop || 0;
};
/* #if icNote === 'exist' */
icPrototype.offsetTop.icDesc = '只读,相对于版面或由 offsetParent 属性指定的父坐标的计算上侧位置，返回整型，单位像素';
/* #endif */

icPrototype.offsetLeft = function () {
    return this.length && this[0].offsetLeft || 0;
};
/* #if icNote === 'exist' */
icPrototype.offsetLeft.icDesc = '只读,相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置，返回整型，单位像素';
/* #endif */

icPrototype.on = function (event, cb) {
    var useCapture = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    var events = event instanceof Array ? event : event.split(' ');
    this.forEach(function (element) {
        events.forEach(function (eventItem) {
            if (element.addEventListener) {
                element.addEventListener(eventItem, cb, useCapture);
            } else if (element.attachEvent) {
                element.attachEvent("on" + eventItem, cb);
            } else {
                element["on" + eventItem] = cb;
            }
        });
    });
};
/* #if icNote === 'exist' */
icPrototype.on.icDesc = '绑定事件如：click hover ..., 参数：string or array, ' + '\nuseCapture: ' + '\n[1]true 的触发顺序总是在 false 之前' + '\n[2]如果多个均为 true，则外层的触发先于内层' + '\n[3]如果多个均为 false，则内层的触发先于外层';

/* #endif */

module.exports = {
    IcArray: IcArray,
    createIcArray: createIcArray
};

},{}],4:[function(require,module,exports){
'use strict';

module.exports = function $ic(query) {
    var icArray = require('./_createIcArray').createIcArray();
    return icArray._query(query);
};

},{"./_createIcArray":3}],5:[function(require,module,exports){
'use strict';

(function () {
    // 获取ic
    var $ic = require('./ic/ic');

    // 对ic添加静态方法
    $ic.http = require('./http/http');

    if (window['$']) {
        window['$'].ic = $ic;
    } else {
        window['$ic'] = $ic;
    }
})();

},{"./http/http":2,"./ic/ic":4}]},{},[5]);
