/**
 * @file http相关常量
 * @module app/constants/http/constant
 */

export const SUCCESS: number = 200;             //成功
export const CREATE_SUCCESS: number = 201;      //创建成功
export const ERROR: number = 400;               //错误
export const UNAUTHORIZED: number = 401;        //未授权
export const NO_PERMISSION: number = 403;       //无权限
export const SERVER_ERROR: number = 500;        //服务器错误
export const GATEWAY_TIMEOUT: number = 504;     //请求超时
export const UNKNOWN_ERROR: number = 0;         //未知错误

export const TOKEN_STORAGE: string = "token";
export const TOKEN_HEADER: string = "Authorization";