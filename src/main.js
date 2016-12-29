(function () {
    // 获取ic
    var $ic = require('./ic/ic');

    // 对ic添加静态方法
    $ic.http = require('./http/http');


    if(!window['$ic']){
        window['$ic'] = $ic;
    }
    window['$icQuery'] = $ic;
})();

