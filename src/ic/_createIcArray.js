/**
 * 将普通数组转换成icArray数组
 * @param _icArray
 * @returns {*|Array}
 */
function createIcArray(arr) {
    _icArray = arr || [];
    /**
     * 查找元素节点 $ic(query)
     * $ic('#myId')  $ic('.myClass') $ic('div')
     * @param query :string
     * @param rootElement dom default document
     */
    _icArray._query = function (query, rootElement) {
        rootElement = rootElement || document;
        if (typeof query == 'string') {
            if (/^(\.|#).+/i.test(query)) { // 首字母以 . 或者 # 开头
                var doms = rootElement.querySelectorAll(query);
                if (doms && doms.length) {
                    Array.prototype.push.apply(this, doms);
                }
            } else if(/^[a-z]+$/i.test(query)){
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
    _icArray.find = function(query) {
        var icArray = createIcArray();
        this.forEach(function (element) {
            icArray._query(query, element);
        });
        return icArray;
    };
    /* #if icNote === 'exist' */
    _icArray.find.icDesc = '查询所有子孙节点';
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
   _icArray.addClass = function (className) {
       operateClass('add', this, className);
   };
    /* #if icNote === 'exist' */
    _icArray.addClass.icDesc = '追加一个或多个新的类(参数：string or array)';
    /* #endif */

    _icArray.removeClass = function (className) {
        operateClass('remove', this, className);
    };
    /* #if icNote === 'exist' */
    _icArray.removeClass.icDesc = '删除一个或多个已有类(参数：string or array)';
    /* #endif */

    _icArray.replaceClass = function (removeClass, addClass) {
        this.removeClass(removeClass);
        this.addClass(addClass);
    };
    /* #if icNote === 'exist' */
    _icArray.replaceClass.icDesc = '先删除参数1的类，再添加参数2的类，参数1、2：string or array';
    /* #endif */

    _icArray.toggleClass = function (className) {
        operateClass('toggle',this, className);
    };
    /* #if icNote === 'exist' */
    _icArray.toggleClass.icDesc = '存在class移除，不存在添加， 参数：string or array';
    /* #endif */

    _icArray.containsClass = function (className) {
        var allContain = true;
        operateClass('contains',this, className, function (isContainItem) {
            if(!isContainItem){
                allContain = isContainItem;
            }
        });
        return allContain;
    };
    /* #if icNote === 'exist' */
    _icArray.containsClass.icDesc = '判断icArray中每个元素是否都存在传递的所有类， 参数：string or array';
    /* #endif */









    // 初始化方法完毕返回
    return _icArray;
};

module.exports = createIcArray;