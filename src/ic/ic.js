module.exports = function $ic(some) {
    var icArray = require('./_createIcArray').createIcArray();
    if(typeof some == 'function'){
        function afterPageLoaded() {
            some($ic)
        }
        if (window.addEventListener) window.addEventListener("load", afterPageLoaded, false);
        else if (window.attachEvent) window.attachEvent("onload", afterPageLoaded);
        else window.onload = afterPageLoaded;
    } else if(some instanceof HTMLElement){
        icArray.push(some);
        return icArray;
    }
    else {
        return icArray._query(some);
    }
};