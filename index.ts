import { useState, useEffect } from "react";

export type ApiParams = {
  url: string;
  payload?: any;
  type?: "GET" | "POST" | "PUT" | "DELETE";
  headers?: Record<string, string>;
  autoLoad?: boolean;
  callOnMount?: boolean;
};

export type ApiCallResult = {
  status: "idle" | "loading" | "success" | "error" | "cancelled";
  data?: any;
  error?: any;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isCancelled: boolean;
};

type ApiCallOptions = {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
};

type StartFunction = (
  url: string,
  type?: string,
  payload?: any,
  headers?: Record<string, string>
) => void;
type RequestParams = {
  url: string;
  type?: string;
  payload?: any;
  headers?: Record<string, string>;
};

const MIN_REQUEST_DELAY = 50;

export const createApiCallFunction = () => {
  let listener: any = null;
  let request: XMLHttpRequest | any;
  let isCancelled = false;
  let lastRequestParams: RequestParams | undefined;
  let lastRequestTime = 0;
  let requestStatus = {
    status: "idle",
    isLoading: false,
    isSuccess: false,
    isError: false,
    isCancelled: false,
  };

  const notifyListener = (result: ApiCallResult) => {
    if (result) {
      requestStatus = result;
    }
    if (listener) {
      listener(requestStatus);
    }
  };

  const start: StartFunction = (url, type = "GET", payload, headers = {}) => {
    const now = Date.now();
    const requestParams: RequestParams = { url, type, payload, headers };

    if (
      request &&
      now - lastRequestTime < MIN_REQUEST_DELAY &&
      isEqual(requestParams, lastRequestParams)
    ) {
      // Ignore this request
      return;
    }

    lastRequestParams = requestParams;
    lastRequestTime = now;
    isCancelled = false;
    request = new XMLHttpRequest();
    request.open(type, url, true);

    if (headers) {
      for (const header in headers) {
        request.setRequestHeader(header, headers[header]);
      }
    }

    request.onreadystatechange = () => {
      if (isCancelled) {
        return;
      }

      if (request.readyState === 4) {
        if (request.status >= 200 && request.status < 300) {
          const response = JSON.parse(request.responseText);
          notifyListener({
            status: "success",
            data: response,
            isLoading: false,
            isSuccess: true,
            isError: false,
            isCancelled: false,
          });
        } else {
          const error = {
            status: request.status,
            message: request.statusText,
          };
          notifyListener({
            status: "error",
            error,
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

  const cancel = () => {
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

  const removeListener = () => {
    listener = null;
  };

  const onChange = (newListener: any) => {
    listener = newListener;
  };

  return {
    onChange,
    start,
    cancel,
    removeListener,
  };
};

function isEqual(a: any, b: any) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export const useFetch = ({
  url,
  payload,
  headers,
  type,
  autoLoad = false,
  callOnMount = false,
}: ApiParams): {
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  data: any;
  error: string;
  isCancelled: boolean;
  load: () => void;
  cancel: () => void;
} => {
  const [result, setResult] = useState<ApiCallResult>({
    status: "idle",
    data: null,
    error: null,
    isLoading: false,
    isSuccess: false,
    isError: false,
    isCancelled: false,
  });
  const [apiCall, setAPICall] = useState<any>(null);
  const [makeInitialCall, setMakeInitialCall] = useState(callOnMount);
  useEffect(() => {
    setAPICall(createApiCallFunction());
  }, []);
  useEffect(() => {
    if (apiCall) {
      const onChange = (apiResult: ApiCallResult) => setResult(apiResult);
      apiCall.onChange(onChange);
      if (makeInitialCall) {
        load();
      }
      return () => {
        apiCall?.removeListener(onChange);
        cancel();
      };
    }
  }, [apiCall]);
  useEffect(() => {
    if (apiCall && autoLoad) {
      cancel();
      load();

      return () => {
        result.isLoading && apiCall.cancel();
      };
    }
  }, [url, payload, headers, type]);

  const load = () => {
    if (apiCall) {
      cancel();
      apiCall.start(url, type, payload, headers);
    } else {
      setMakeInitialCall(true);
    }
  };

  const cancel = () => {
    result.isLoading && apiCall?.cancel();
  };

  return {
    isLoading: result.isLoading || false,
    isSuccess: result.isSuccess || false,
    isError: result.isError || false,
    data: result.data || null,
    error: result.error || "",
    isCancelled: result.isCancelled || false,
    load,
    cancel,
  };
};
