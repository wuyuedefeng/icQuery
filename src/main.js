(function () {
    var $ic = function () {

    };

    $ic.http = require('./http/http');


    if(window['$']){
        window['$'].ic = $ic;
    }else {
        window['$ic'] = $ic;
    }
})();

