/**
 * @file 用户模型接口
 * @module app/core/user/model
 */

export interface User {
    id: string;
    account: string;
    name: string;
    email?: string;
}