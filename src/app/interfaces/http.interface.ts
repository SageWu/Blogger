/**
 * @file http相关接口
 * @module app/interfaces/http/interface
 */

//响应基础接口
export interface HttpResponseBase {
    statusCode: number,
    message: string
}

//正常响应
export type HttpSuccessResponse<T> = HttpResponseBase & { result?: T };

//错误响应
export type HttpErrorResponse = HttpResponseBase & { reason?: string };

//响应
export type HttpResponse<T> = HttpSuccessResponse<T> | HttpErrorResponse;

//分页数据
export interface PaginationData<T> {
    data?: T;
    total?: number;
}

//请求选项
export interface HttpRequestOption {
    [key: string]: any;
}

//token
export interface Token {
    accessToken: string;
    expiresIn: number
}