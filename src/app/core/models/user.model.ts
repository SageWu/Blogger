/**
 * @file 用户模型接口
 * @module app/core/models/user/model
 */

export interface User {
    _id?: string;
    account: string;
    password?: string;
    name: string;
    email?: string;
    slogan?: string;
    avatar?: string;
    preferences?: string[];
    last_login?: Date;
    create_at?: Date;
    update_at?: Date;
}