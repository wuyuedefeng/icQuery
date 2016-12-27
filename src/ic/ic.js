module.exports = function $ic(some) {
    if(typeof some == 'function'){
        function afterPageLoaded() {
            some($ic)
        }
        if (window.addEventListener) window.addEventListener("load", afterPageLoaded, false);
        else if (window.attachEvent) window.attachEvent("onload", afterPageLoaded);
        else window.onload = afterPageLoaded;
    }else {
        var icArray = require('./_createIcArray').createIcArray();
        return icArray._query(some);
    }
};