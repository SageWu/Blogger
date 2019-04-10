/**
 * @file 文章评论服务
 * @module app/core/comment/service
 */

import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as API from "@app/constants/api.constant";
import { HttpRequestOption, PaginationData } from '@app/interfaces/http.interface';
import { Comment } from '../models/comment.model';
import { HttpService } from './http.service';

@Injectable()
export class CommentService {
    public total: number;
    public current_page: number;

    constructor(
        private httpService: HttpService
    ) {}

    //获取分页文章评论
    public get(option: HttpRequestOption): Observable<Comment[]> {
        return this.httpService.get<Comment>(API.COMMENT, option).pipe(
            map(
                (value: PaginationData<Comment[]>) => {
                    this.total = value.total;
                    this.current_page = <number>option.page;

                    return value.data;
                }
            )
        );
    }

    //创建文章评论
    public create(comment: Comment): Observable<Comment> {
        return this.httpService.create<Comment>(API.COMMENT, comment);
    }

    //修改文章评论
    public update(comment: Comment): Observable<Comment> {
        return this.httpService.update<Comment>(API.COMMENT, comment);
    }

    //更新文章评论状态
    public updateMany(comments: Comment[]): Observable<boolean> {
        return this.httpService.updateMany<Comment>(API.COMMENT_MANY, comments);
    }
}