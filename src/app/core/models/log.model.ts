/**
 * @file 浏览记录模型
 * @module app/core/models/log/model
 */

//喜欢程度
export enum PreferenceDegree {
    VIEW,
    COMMENT,
    LIKE
}

export interface Log {
    _id?: string;
    user_id?: string;
    article_id: string;
    count?: number;
    duration?: number;
    preference_degree?: number;
    create_at?: Date;
    update_at?: Date;
}