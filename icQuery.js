!function n(o,r,e){function t(a,u){if(!r[a]){if(!o[a]){var i="function"==typeof require&&require;if(!u&&i)return i(a,!0);if(s)return s(a,!0);var c=new Error("Cannot find module '"+a+"'");throw c.code="MODULE_NOT_FOUND",c}var f=r[a]={exports:{}};o[a][0].call(f.exports,function(n){var r=o[a][1][n];return t(r?r:n)},f,f.exports,n,o,r,e)}return r[a].exports}for(var s="function"==typeof require&&require,a=0;a<e.length;a++)t(e[a]);return t}({1:[function(n,o,r){function e(n,o,r){return n=n||{},n.headers=n.headers||{},n.params=n.params||{},n.data=n.data||{},n.onSuccess=n.onSuccess||o,n.onError=n.onError||r,n.async!==!1&&(n.async=!0),n.timeout&&(n.onTimeout=n.onTimeout||function(o){console.error(n.url+"request timeout :"+n.timeout+"ms")}),n._onprogress=n._onprogress||function(o){if(o.lengthComputable){var r=o.loaded/o.total*100;n.onProgress&&n.onProgress(r,o)}},n.onProgress=n.onProgress||function(n){console.log("progress:",n)},n._onreadystatechange=n._onreadystatechange||function(){var o=n.xhr.readyState;if(4==o){var r=n.xhr.response;if(200==n.xhr.status){var e=n.xhr.getResponseHeader("Content-Type");/json/i.test(e)&&(r=JSON.parse(r)),n.onSuccess&&n.onSuccess(r),n.onEnd&&n.onEnd(!1,r)}else n.onError&&n.onError(r),n.onEnd&&n.onEnd(!0,r)}},n}function t(n){return Object.keys(n).map(function(o){return o+"="+n[o]}).join("&")}o.exports={handleConfig:e,handleObjToParams:t}},{}],2:[function(n,o,r){n("./_tools")},{"./_tools":1}],3:[function(n,o,r){!function(){var o=function(){};o.http=n("./http/http"),window.$?window.$.ic=o:window.$ic=o}()},{"./http/http":2}]},{},[3]);