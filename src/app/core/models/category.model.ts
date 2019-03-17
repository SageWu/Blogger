/**
 * @file 文章分类目录模型
 * @module app/core/category/model
 */

export interface Category {
    _id?: string;
    name: string;
    description?: string;
    create_at?: Date;
    update_at?: Date;
    parent_id?: string;
    user_id: string;

    count?: number;
    children?: Category[];
    level?: number;
}