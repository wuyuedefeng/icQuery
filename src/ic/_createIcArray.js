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
            if (query[0] == '#') {
                var dom = rootElement.querySelector(query);
                if (dom) {
                    this.push(dom);
                }
            } else if (query[0] == '.') {
                var doms = rootElement.querySelectorAll(query);
                if (doms && doms.length) {
                    Array.prototype.push.apply(this, doms);
                }
            } else {
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

    // 初始化方法完毕返回
    return _icArray;
};

module.exports = createIcArray;