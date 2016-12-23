module.exports = function $ic(query) {
    var icArray = require('./_createIcArray').createIcArray();
    return icArray._query(query);
};