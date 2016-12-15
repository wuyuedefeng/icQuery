var tools = require('./_tools');
var http = {
    get: function (config, onSuccess, onError) {
        config.method = 'GET';
        http.request(config, onSuccess, onError);
    },
    request: function (config, onSuccess, onError) {
        // 统一初始化config参数
        tools.handleConfig(config, onSuccess, onError);

        // 创建xmlHttpRequest对象
        var xhr = null;
        if (window.XMLHttpRequest) {
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        } else {
            if (!xhr){
                alert('浏览器不支持xmlHttpRequest');
                return ;
            }else {
                config.xhr = xhr;
            }
        }

        // 进度条监听
        xhr.onprogress = config.onProgress;


    },
    _tools: tools
};
