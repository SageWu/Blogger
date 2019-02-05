/**
 * @file api配置文件
 * @module app/constants/api/constant
 */

//主机地址
export const HOST: string = "http://localhost:2222";

//路由
export const AUTH: string = HOST + "/auth";
export const AUTH_USER: string = HOST + "/auth/user";
export const AUTH_ADMIN: string = HOST + "/auth/admin";
export const AUTH_CHECK: string = HOST + "/auth/check";

export const USER: string = HOST + "/user";
export const USER_EXIST: string = HOST + "/user/exist";