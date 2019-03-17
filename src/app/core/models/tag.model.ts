/**
 * @file 文章标签模型接口
 */

export interface Tag {
    _id?: string;
    name: string;
    description?: string;
    create_at?: Date;
    update_at?: Date;

    user_id: string;
    count?: number;
}