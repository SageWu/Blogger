/**
 * @file 文章模型接口
 * @module app/core/models/article/model
 */

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