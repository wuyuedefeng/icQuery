(function () {
    var $ic = function () {

    };


    if(window['$']){
        window['$'].ic = $ic;
    }else {
        window['$ic'] = $ic;
    }
})();

