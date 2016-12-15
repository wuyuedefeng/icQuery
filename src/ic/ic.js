module.exports = function $ic(query) {
    var icArray = [];
    if(typeof query == 'string'){
        if (query[0] == '#'){
            var dom = document.getElementById(query.substr(1));
            if(dom){
                icArray.push(dom);
            }
        }else if(query[0] == '.'){
            var doms = document.getElementsByClassName(query.substr(1));
            if (doms && doms.length){
                Array.prototype.push.apply(icArray, doms);
            }
        }else {
            var doms = document.getElementsByTagName(query);
            if (doms && doms.length){
                Array.prototype.push.apply(icArray, doms);
            }
        }
        return icArray;
    }
};