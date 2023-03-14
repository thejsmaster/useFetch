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
    request: XMLHttpRequest | null;
};
export type UseFetchResponse = {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    data: any;
    error: APIError;
    isCancelled: boolean;
    load: () => void;
    cancel: () => void;
    request: XMLHttpRequest | null;
};
type StartFunction = (url: string, type?: string, payload?: any, headers?: Record<string, string>) => void;
export declare const createApiCallFunction: () => {
    onChange: (newListener: any) => void;
    start: StartFunction;
    cancel: () => void;
    removeListener: () => void;
};
export type APIError = {
    status: number;
    statusText: string;
    message: any;
    responseData: any;
};
export declare const useFetch: ({ url, payload, headers, type, autoLoad, callOnMount, }: ApiParams) => UseFetchResponse;
export {};
