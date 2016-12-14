var element = {
    scroll: {
        /**
         * 获取当前元素所有父元素滚动高度之和（递归）
         * @param element  当前开始计算的元素
         * @returns {*} 滚动高度之和
         */
        getPageScrollTop: function (element) {
            var parentElement = element.parentNode;
            var pageScrollTop = element.scrollTop || 0;
            if (parentElement){
                return pageScrollTop + this.getPageScrollTop(parentElement);
            }else {
                return pageScrollTop;
            }
        }
    }
};
module.exports = element;