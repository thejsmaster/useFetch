import { useState, useEffect } from "react";
var MIN_REQUEST_DELAY = 50;
export var createApiCallFunction = function () {
    var listener = null;
    var request;
    var isCancelled = false;
    var lastRequestParams;
    var lastRequestTime = 0;
    var requestStatus = {
        status: "idle",
        isLoading: false,
        isSuccess: false,
        isError: false,
        isCancelled: false,
    };
    var notifyListener = function (result) {
        if (result) {
            requestStatus = result;
        }
        if (listener) {
            listener(requestStatus);
        }
    };
    var start = function (url, type, payload, headers) {
        if (type === void 0) { type = "GET"; }
        if (headers === void 0) { headers = {}; }
        var now = Date.now();
        var requestParams = { url: url, type: type, payload: payload, headers: headers };
        if (request &&
            now - lastRequestTime < MIN_REQUEST_DELAY &&
            isEqual(requestParams, lastRequestParams)) {
            // Ignore this request
            return;
        }
        lastRequestParams = requestParams;
        lastRequestTime = now;
        isCancelled = false;
        request = new XMLHttpRequest();
        request.open(type, url, true);
        if (headers) {
            for (var header in headers) {
                request.setRequestHeader(header, headers[header]);
            }
        }
        request.onreadystatechange = function () {
            if (isCancelled) {
                return;
            }
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300) {
                    var response = JSON.parse(request.responseText);
                    notifyListener({
                        status: "success",
                        data: response,
                        isLoading: false,
                        isSuccess: true,
                        isError: false,
                        isCancelled: false,
                    });
                }
                else {
                    var error = {
                        status: request.status,
                        message: request.statusText,
                    };
                    notifyListener({
                        status: "error",
                        error: error,
                        isLoading: false,
                        isSuccess: false,
                        isError: true,
                        isCancelled: false,
                    });
                }
            }
        };
        // setTimeout(() => {
        request.send(payload);
        notifyListener({
            status: "loading",
            isLoading: true,
            isSuccess: false,
            isError: false,
            isCancelled: false,
        });
        // }, MIN_REQUEST_DELAY);
    };
    var cancel = function () {
        if (request && requestStatus.isLoading) {
            request.abort();
            isCancelled = true;
            notifyListener({
                status: "cancelled",
                isLoading: false,
                isSuccess: false,
                isError: false,
                isCancelled: true,
            });
        }
    };
    var removeListener = function () {
        listener = null;
    };
    var onChange = function (newListener) {
        listener = newListener;
    };
    return {
        onChange: onChange,
        start: start,
        cancel: cancel,
        removeListener: removeListener,
    };
};
function isEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}
export var useFetch = function (_a) {
    var url = _a.url, payload = _a.payload, headers = _a.headers, type = _a.type, _b = _a.autoLoad, autoLoad = _b === void 0 ? false : _b, _c = _a.callOnMount, callOnMount = _c === void 0 ? false : _c;
    var _d = useState({
        status: "idle",
        data: null,
        error: null,
        isLoading: false,
        isSuccess: false,
        isError: false,
        isCancelled: false,
    }), result = _d[0], setResult = _d[1];
    var _e = useState(null), apiCall = _e[0], setAPICall = _e[1];
    var _f = useState(callOnMount), makeInitialCall = _f[0], setMakeInitialCall = _f[1];
    useEffect(function () {
        setAPICall(createApiCallFunction());
    }, []);
    useEffect(function () {
        if (apiCall) {
            var onChange_1 = function (apiResult) { return setResult(apiResult); };
            apiCall.onChange(onChange_1);
            if (makeInitialCall) {
                load();
            }
            return function () {
                apiCall === null || apiCall === void 0 ? void 0 : apiCall.removeListener(onChange_1);
                cancel();
            };
        }
    }, [apiCall]);
    useEffect(function () {
        if (apiCall && autoLoad) {
            cancel();
            load();
            return function () {
                result.isLoading && apiCall.cancel();
            };
        }
    }, [url, payload, headers, type]);
    var load = function () {
        if (apiCall) {
            cancel();
            apiCall.start(url, type, payload, headers);
        }
        else {
            setMakeInitialCall(true);
        }
    };
    var cancel = function () {
        result.isLoading && (apiCall === null || apiCall === void 0 ? void 0 : apiCall.cancel());
    };
    return {
        isLoading: result.isLoading || false,
        isSuccess: result.isSuccess || false,
        isError: result.isError || false,
        data: result.data || null,
        error: result.error || "",
        isCancelled: result.isCancelled || false,
        load: load,
        cancel: cancel,
    };
};
