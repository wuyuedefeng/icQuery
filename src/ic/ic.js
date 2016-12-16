module.exports = function $ic(query) {
    var icArray = require('./createIcArray')();
    return icArray._query(query);
};