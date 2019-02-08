/**
 * @file 用户模型接口
 * @module app/core/models/user/model
 */

export interface User {
    id: string;
    account: string;
    name: string;
    email?: string;
}