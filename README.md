# icQuery

### $ic.http

* $ic.http.get(config, onSuccess, onError);
* $ic.http.post(config, onSuccess, onError);
* $ic.http.put(config, onSuccess, onError);
* $ic.http.delete(config, onSuccess, onError);

###### config:
- url String: request url  `[must]`
- headers {}
- params {}: get params 
- data {}: post put delete params
- onSuccess (data): success callback, `equal as second http request param`
- onError (data):  error callback, `equal as third http request param`
- onEnd (isErr, data): after onSuccess or onError callback
- async Bool:  aync?  `[default true]`
- timeout Integer: `ms`
- onTimeout (): timeout callback
- onProgress (percentComplete, event): progress callback `event can get more info include percentComplete from calc`
- _onprogress (): xhr origin method `[suggest not modify]`
- _onreadystatechange (): xhr origin method `[suggest not modify]`
- method String: get post put delete, `[auto set]` 
 

