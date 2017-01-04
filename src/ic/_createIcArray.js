/**
 * 用来实例IcArray
 * @constructor
 */
function IcArray() {

}
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
        if(isFindOne){
            doms = [rootElement.querySelector(expr)];
        }else {
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
icPrototype.find = function(expr) {
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

icPrototype.findOne = function(expr) {
    var icArray = createIcArray();
    this.forEach(function (element) {
        icArray._query(expr, element, true);
    });
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.findOne.icDesc = '查询所有子孙节点中的第一个';
/* #endif */

icPrototype.children = function() {
    var icArray = createIcArray();
    this.forEach(function (element) {
        element.childNodes.forEach(function (childNode) {
            if(childNode.nodeType==1){
                icArray.push(childNode);
            }
        });

    });
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.children.icDesc = '查询所有儿子节点(不包括孙子)';
/* #endif */

icPrototype.parent = function(expr) {
    var icArray = createIcArray();
    this.forEach(function (element) {
        var parent = element.parentNode;
        // nodeType: http://www.w3school.com.cn/jsref/prop_node_nodetype.asp
        if(parent && parent.nodeType == 1){
            if(!expr){
                icArray.push(parent);
            }else {
                var exprElements = createIcArray()._query(expr);
                if(exprElements.indexOf(parent) != -1){
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


icPrototype.parents = function(expr) {
    var parentsElements = this.parent();
    if (parentsElements.length){
        Array.prototype.push.apply(parentsElements, parentsElements.parents());
    }
    if(expr){
        var exprElements = createIcArray()._query(expr);
        var icArray = createIcArray();
        exprElements.forEach(function (item) {
           if(parentsElements.indexOf(item) != -1){
               icArray.push(item)
           }
        });
        parentsElements = icArray;
    }
    return parentsElements.$icUniq();
};
/* #if icNote === 'exist' */
icPrototype.parents.icDesc = '获取所有祖先(父亲，爷爷..)，传递expr表示查找某种类型的祖先节点';
/* #endif */


function getSiblingElements(queryIcArray, expr, method){
    var icArray = createIcArray();
    var getDirection = '';
    if(/prev/.test(method)){
        getDirection = 'previousSibling';
    }else if(/next/.test(method)){
        getDirection = 'nextSibling';
    }

    var exprElements = createIcArray()._query(expr);
    queryIcArray.forEach(function (element) {
        while ((element = element[getDirection])){
            if(element.nodeType == 1){
                if(!expr){
                    icArray.push(element);
                }
                if(['prev', 'next'].indexOf(method) != -1){
                    if(expr && exprElements.indexOf(element) != -1){
                        icArray.push(element);
                    }
                    break;
                } else if(['prevUtil', 'nextUtil'].indexOf(method) != -1){
                    if(expr){
                        icArray.push(element);
                        if(exprElements.indexOf(element) != -1){
                            break;
                        }
                    }
                }else if(['prevAll', 'nextAll'].indexOf(method) != -1){
                    if(expr && exprElements.indexOf(element) != -1){
                        icArray.push(element);
                    }
                }
            }
        }
    });
    return icArray;
}

icPrototype.prev = function(expr){
    return getSiblingElements(this, expr, 'prev');
};
icPrototype.prevUtil = function(expr){
    return getSiblingElements(this, expr, 'prevUtil');
};
icPrototype.prevAll = function(expr){
    return getSiblingElements(this, expr, 'prevAll');
};
icPrototype.next = function(expr){
    return getSiblingElements(this, expr, 'next');
};
icPrototype.nextUtil = function(expr){
    return getSiblingElements(this, expr, 'nextUtil');
};
icPrototype.nextAll = function(expr){
    return getSiblingElements(this, expr, 'nextAll');
};

icPrototype.siblings = function (expr) {
    var icArray = createIcArray();
    Array.prototype.push.apply(icArray, this.prevAll(expr));
    Array.prototype.push.apply(icArray, this.nextAll(expr));
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.siblings.icDesc = '查找节点的所有兄弟节点，不分前后';
/* #endif */



////////////////////////////////////////////////////////////////////
//    类操作相关
////////////////////////////////////////////////////////////////////
function operateClass(op, icArray, className, cb) {
    var classNames = className instanceof(Array) ? className : className.split(' ');
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
    operateClass('toggle',this, className);
};
/* #if icNote === 'exist' */
icPrototype.toggleClass.icDesc = '存在class移除，不存在添加， 参数：string or array';
/* #endif */

icPrototype.hasClass = icPrototype.containsClass = function (className) {
    var allContain = true;
    operateClass('contains',this, className, function (isContainItem) {
        if(!isContainItem){
            allContain = isContainItem;
        }
    });
    return allContain;
};
/* #if icNote === 'exist' */
icPrototype.hasClass.icDesc = icPrototype.containsClass.icDesc = '判断icArray中每个元素是否都存在传递的所有类， 参数：string or array';
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
    if(e){
        icArray.push(e);
    }else {
        icArray = icArray._query('body');
    }
    return icArray;
};
/* #if icNote === 'exist' */
icPrototype.offsetParent.icDesc = '与当前元素最近的经过定位(position不等于static)的父级元素, 主要分为' +
    '\n【1】元素自身有fixed定位，offsetParent的结果为body' +
    '\n【2】元素自身无fixed定位，且父级元素都未经过定位，offsetParent的结果为body' +
    '\n【3】元素自身无fixed定位，且父级元素存在经过定位的元素，offsetParent的结果为离自身元素最近的经过定位的父级px';
/* #endif */

icPrototype.offset = function () {
    var elem = this.length && this[0];
    var sumOffsetLeft = 0;
    var sumOffsetTop = 0;
    while (elem){
        sumOffsetLeft += elem.offsetLeft;
        sumOffsetTop += elem.offsetTop;
        if(/body/i.test(elem.tagName)) {
            break;
        }else {
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
    if(/number|string/i.test(typeof val) && this.length){
        this[0].scrollTop = val;
    }
    return this.length && this[0].scrollTop || 0;
};
/* #if icNote === 'exist' */
icPrototype.scrollTop.icDesc = '读写，获取或设置元素滚动距离,返回整数，赋值整数， 单位px';
/* #endif */

icPrototype.css = function(propertyName, value){
    if(value && typeof propertyName == 'string'){
        this.forEach(function (el) {
            setStyle(el, propertyName, value);
        })
    }else if(typeof propertyName == 'string'){
        return this[0] ? getStyle(this[0], propertyName) : '';
    } else if(propertyName instanceof Object){
        this.forEach(function (el) {
            for(var key in propertyName){
                setStyle(el, key, propertyName[key]);
            }
        })
    }
    // 获得样式
    function getStyle( elem, name ) {
        //如果该属性存在于style[]中，则它最近被设置过(且就是当前的)
        //否则，尝试IE的方式
        //或者W3C的方法，如果存在的话 (document.defaultView返回当前文档关联的window对象)
        var computedStyle = elem.style || elem.currentStyle || document.defaultView && document.defaultView.getComputedStyle && document.defaultView.getComputedStyle(elem, null);
        if (name != "float") {
            return computedStyle[name];
        } else {
            return computedStyle["cssFloat"] || computedStyle["styleFloat"];
        }
    }
    // 设置样式
    //element:需要设置样式的目标元素;name:样式属性;value:设置值
    function setStyle(element, name, value) {
        if (name != "float") {
            element.style[name] = value;
        } else {
            element.style["cssFloat"] = value;
            element.style["styleFloat"] = value;
        }
    }
};
/* #if icNote === 'exist' */
icPrototype.css.icDesc = '设置或得到css样式';
/* #endif */



////////////////////////////////////////////////////////////////////
//    事件相关
////////////////////////////////////////////////////////////////////
function bindEvents(icArray, events, cb, useCapture=false) {
    icArray.forEach(function (element) {
        events.forEach(function (type) {
            bindEvent(element, type, cb, useCapture);
        });
    });
}
function unbindEvents(icArray, events, cb, useCapture=false) {
    icArray.forEach(function (element) {
        events.forEach(function (type) {
            unbindEvent(element, type, cb, useCapture);
        });
    });
}
function bindEvent(element, type, cb, useCapture=false) {
    if(element.addEventListener) {
        element.addEventListener(type, cb, useCapture);
    } else if(element.attachEvent){
        element.attachEvent("on" + type, cb);
    }else{
        element["on" + type] = cb;
    }
}
function unbindEvent(element, type, cb, useCapture=false) {
    if(element.removeEventListener){
        element.removeEventListener(type, cb, useCapture);
    } else if(element.detachEvent){
        element.detachEvent("on" + type, cb);
    }else {
        element["on" + type] = null;
    }
}
icPrototype.on = function (event, cb, useCapture = false) {
    var events = event instanceof(Array) ? event : event.split(' ');
    bindEvents(this, events, cb, useCapture);
};
/* #if icNote === 'exist' */
icPrototype.on.icDesc = '绑定事件如：click hover ..., 参数：event: string or array, ' +
    '\nuseCapture: ' +
    '\n[1]true 的触发顺序总是在 false 之前' +
    '\n[2]如果多个均为 true，则外层的触发先于内层' +
    '\n[3]如果多个均为 false，则内层的触发先于外层' +
    '\n 解除绑定 off ';
/* #endif */

icPrototype.one = function(event, cb, useCapture = false){
    var events = event instanceof(Array) ? event : event.split(' ');
    function oneCb(event) {
        cb && cb(event);
        unbindEvent(event.target, event.type, oneCb, useCapture);
    }
    bindEvents(this, events, oneCb, useCapture);
};
/* #if icNote === 'exist' */
icPrototype.one.icDesc = '绑定事件如：click hover ..., 执行一次后，将解除事件绑定 参数：event: string or array, ' +
    '\nuseCapture: ' +
    '\n[1]true 的触发顺序总是在 false 之前' +
    '\n[2]如果多个均为 true，则外层的触发先于内层' +
    '\n[3]如果多个均为 false，则内层的触发先于外层';
/* #endif */

icPrototype.off = function (event, cb, useCapture = false) {
    var events = event instanceof(Array) ? event : event.split(' ');
    unbindEvents(this, events, cb, useCapture);
};
/* #if icNote === 'exist' */
icPrototype.off.icDesc = '解除绑定事件如：click hover ..., 参数：event: string or array, ' +
    '\nuseCapture: ' +
    '\n[1]true 的触发顺序总是在 false 之前' +
    '\n[2]如果多个均为 true，则外层的触发先于内层' +
    '\n[3]如果多个均为 false，则内层的触发先于外层';
/* #endif */

icPrototype.trigger = function (type) {
    this.forEach(function (element) {
        element[type]();
    });
};
/* #if icNote === 'exist' */
icPrototype.trigger.icDesc = '触发事件';
/* #endif */


icPrototype.triggerHandler = function (type, opts) {
    this.forEach(function (element) {
        var eventType = 'Events';
        // if(/abort|blur|change|error|focus|load|reset|resize|scroll|select|submit|unload/ig.test(type)){
        //     eventType = 'HTMLEvents';
        // }else if(/DOMActivate|DOMFocusIn|DOMFocusOut|keydown|keypress|keyup/ig.test(type)){
        //     eventType = 'UIEvents';
        // }else if(/click|mousedown|mousemove|mouseout|mouseover|mouseup/ig.test(type)){
        //     eventType = 'MouseEvents';
        // }else if(/DOMAttrModified|DOMNodeInserted|DOMNodeRemoved|DOMCharacterDataModified|DOMNodeInsertedIntoDocument|DOMNodeRemovedFromDocument|DOMSubtreeModified/ig.test(type)){
        //     eventType = 'MutationEvents';
        // }

        var evt = document.createEvent(eventType);
        evt.initEvent(type,false,true);
        evt.$icOpts = opts;
        element.dispatchEvent(evt);
    });
};
/* #if icNote === 'exist' */
icPrototype.triggerHandler.icDesc = '触发事件 不会触发事件的默认行为';
/* #endif */





module.exports = {
    IcArray: IcArray,
    createIcArray: createIcArray
};