/**
 * @file 文章模型接口
 * @module app/core/article/model
 */

import { Category } from './category.model';
import { Tag } from './tag.model';

//文章发布状态
export enum PublishState {
    All = 0,        //所有
    Draft = 1,      //草稿
    Published = 2,  //发布
    Recycle = 3     //回收站
}

//按时间排序
export enum SortType {
    Asc = 0,    //升序
    Desc = 1,   //降序
    Hot = 2     //热度
}

//文章来源
export enum Origin {
    All = 0,        //所有
    Original = 1,   //原创
    Reprint = 2,    //转载
    Hybrid = 3      //混合
}

//文章模型
export interface Article {
    _id: string;
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