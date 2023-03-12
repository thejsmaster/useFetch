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
type StartFunction = (url: string, type?: string, payload?: any, headers?: Record<string, string>) => void;
export declare const createApiCallFunction: () => {
    onChange: (newListener: any) => void;
    start: StartFunction;
    cancel: () => void;
    removeListener: () => void;
};
export declare const useFetch: ({ url, payload, headers, type, autoLoad, callOnMount, }: ApiParams) => {
    isLoading: boolean;
    isSuccess: boolean;
    isError: boolean;
    data: any;
    error: string;
    isCancelled: boolean;
    load: () => void;
    cancel: () => void;
};
export {};
