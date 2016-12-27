/**
 * 用来实例IcArray
 * @constructor
 */
function IcArray() {

}
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
        // query是dom对象
        if (/^(\.|#).+/i.test(query)) { // 首字母以 . 或者 # 开头
            var doms = rootElement.querySelectorAll(query);
            if (doms && doms.length) {
                Array.prototype.push.apply(this, doms);
            }
        } else if(/^[a-z]+$/i.test(query)){ // 假如是 a-z的字符串，查询dom标签
            var doms = rootElement.querySelectorAll(query);
            if (doms && doms.length) {
                Array.prototype.push.apply(this, doms);
            }
        }
    }else if (query instanceof(HTMLElement)){
        this.push(query);
    }
    return this;
};
/**
 * 查询所有子节点
 * @param query: string
 * @returns icArray
 */
icPrototype.find = function(query) {
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

icPrototype.containsClass = function (className) {
    var allContain = true;
    operateClass('contains',this, className, function (isContainItem) {
        if(!isContainItem){
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
    '\n【3】元素自身无fixed定位，且父级元素存在经过定位的元素，offsetParent的结果为离自身元素最近的经过定位的父级元素';
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



module.exports = {
    IcArray: IcArray,
    createIcArray: createIcArray
};