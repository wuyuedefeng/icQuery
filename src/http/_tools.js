function handleConfig(config, onSuccess, onError) {
    config = config || {};
    // 设置headers信息
    config.headers = config.headers || {};
    // get 请求参数
    config.params = config.params || {};
    // post 请求参数
    config.data = config.data || {};
    // 请求发送成功回调
    config.onSuccess = config.onSuccess || onSuccess;
    // 请求发送失败回调
    config.onError = config.onError || onError;
    // 是否发送异步请求
    if (config.async !== false) {
        config.async = true;
    }

    // 设置超市时间 integer ms
    // config.timeout
    if(config.timeout){
        config.onTimeout = config["onTimeout"] || function(event){
                console.error(config.url +  'request timeout :' + config.timeout + 'ms');
            };
    }

    /**
     * 发送进度
     * @type {progress}
     * event
     * event.total是需要传输的总字节, seted by the header
     * event.loaded是已经传输的字节
     * 如果event.lengthComputable不为真，则event.total等于0。
     */
    // 与progress事件相关的，还有其他五个事件，可以分别指定回调函数：
    // * load事件：传输成功完成。
    // * abort事件：传输被用户取消。
    // * error事件：传输中出现错误。
    // * loadstart事件：传输开始。
    // * loadEnd事件：传输结束，但是不知道成功还是失败。
    config._onprogress = config._onprogress || function progress(event) {
            if (event["lengthComputable"]) {
                var percentComplete = (event["loaded"] / event["total"]) * 100;
                // 回调用户绑定的onProgress
                config["onProgress"] && config["onProgress"](percentComplete, event);
            }
        };
    config["onProgress"] = config["onProgress"] || function (percentComplete) {
            console.log('progress:', percentComplete);
        };
    /**
     * 请求状态改变
     * @type {Function}
     */
    config._onreadystatechange = config._onreadystatechange || function () {
            // readyState: 该属性表示请求/响应过程的当前活动阶段
            // 0:未初始化。尚未调用open()方法。
            // 1:启动。已经调用open()方法，但尚未调用send()方法。
            // 2:发送。已经调用send()方法，但尚未接受到响应。
            // 3:接收。已经接受到部分响应数据。
            // 4:完成。已经接收到全部的响应数据。
            var readyState = config.xhr.readyState;
            if (readyState == 4) {   // 4 = "loaded"
                // xhr.response为从服务器获取下来的数据。
                var data = config.xhr.response;
                if (config.xhr.status == 200) { // 200 = OK
                    // .getResponseHeader('name'): 获取相应的响应头部信息。
                    // 参数：name为头部字段名称。返回一个对应的值的字符串。
                    // .getAllResponseHeaders():返回一个包含所有头部信息（key-value）的长字符串。
                    // xhr.getAllResponseHeaders();    //'Content-Type: text/html'
                    var contentType = config.xhr.getResponseHeader('Content-Type');
                    if (/json/i.test(contentType)) {
                        data = JSON.parse(data);
                    }
                    config.onSuccess && config.onSuccess(data);
                    config["onEnd"] && config["onEnd"](false, data);
                } else {
                    config.onError && config.onError(data);
                    config["onEnd"] && config["onEnd"](true, data);
                }
            }
    };



    return config;
}


function handleObjToParams(obj) {
    return Object.keys(obj).map(function(key) {
        return key + '=' + obj[key];
    }).join('&');
}

module.exports = {
    handleConfig: handleConfig,
    handleObjToParams: handleObjToParams
}