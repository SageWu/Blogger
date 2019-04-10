/**
 * @file 文章评论接口模型
 */

//文章评论状态
export enum CommentState {
    All = 0,        //所有
    Published = 1,  //显示
    Spam = 2,       //垃圾
    Deleted = 3     //删除
}

//评论模型
export interface Comment {
    _id?: string;
    content: string;
    agent?: string;
    state?: CommentState;
    ip?: string;
    location?: string;
    create_at?: Date;
    update_at?: Date;
    
    parent_id: string;
    article_id: string;
    author_id: string;
    user_id?: string;
}