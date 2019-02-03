/**
 * @file api配置文件
 * @module app/constants/api
 */

//主机地址
export const HOST: string = "http://localhost:2222";

//路由
export const AUTH: string = HOST + "/auth";
export const AUTH_USER: string = HOST + "/auth/user";
export const AUTH_ADMIN: string = HOST + "/auth/admin";
export const AUTH_CHECK: string = HOST + "/auth/check";

//响应状态
export enum HttpStatus {
    SUCCESS = 200,
    ERROR = 400,
    UNAUTHORIZED = 401
}

//响应
export interface HttpResponse<T> {
    status: HttpStatus,
    message: string,
    result: T
}
//错误响应
export interface HttpError {
    status: number,
    message: string
}