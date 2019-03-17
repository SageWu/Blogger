/**
 * @file api配置文件
 * @module app/constants/api/constant
 */

//主机地址
export const HOST: string = "http://localhost:2222";

//授权路由
export const AUTH: string = HOST + "/auth";
export const AUTH_USER: string = HOST + "/auth/user";
export const AUTH_ADMIN: string = HOST + "/auth/admin";
export const AUTH_CHECK: string = HOST + "/auth/check";

//用户路由
export const USER: string = HOST + "/user";
export const USER_EXIST: string = HOST + "/user/exist";

//文章标签路由
export const TAG: string = HOST + "/tag";
export const TAG_ALL: string = HOST + "/tag/all";

//文章目录路由
export const CATEGORY: string = HOST + "/category";
export const CATEGORY_ALL: string = HOST + "/category/all";

//文章路由
export const ARTICLE: string = HOST + "/article";
export const ARTICLE_MANY: string = HOST + "/article/many";

//浏览记录路由
export const LOG: string = HOST + "/log";

//热门文章路由
export const HOT: string = HOST + "/hot";