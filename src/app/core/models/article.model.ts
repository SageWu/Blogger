/**
 * @file 文章模型接口
 * @module app/core/article/model
 */

import { Category } from './category.model';
import { Tag } from './tag.model';

//文章发布状态
export enum PublishState {
    All = 0,
    Draft = 1,
    Published = 2,
    Recycle = 3
}

//按时间排序
export enum SortType {
    Asc,
    Desc,
    Hot
}

//文章来源
export enum Origin {
    All = 0,
    Original = 1,
    Reprint = 2,
    Hybrid = 3
}

//文章模型
export interface Article {
    title: string;
    content: string;
    thumb?: string;
    state: PublishState;
    origin: Origin;
    views: number;
    likes: number;
    comments_num: number;
    create_at: Date;
    update_at: Date;

    user_id: string;
    categories: Category[];
    tags: Tag[];
}