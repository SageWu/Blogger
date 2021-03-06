/**
 * @file 
 * @module app/core/article/service
 */

import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as API from "@app/constants/api.constant";
import { HttpRequestOption, PaginationData } from '@app/interfaces/http.interface';
import { Article } from '../models/article.model';
import { HttpService } from './http.service';

@Injectable()
export class ArticleService {
    public total: number = 0;
    public current_page: number;

    constructor(
        private httpService: HttpService
    ) {}

    //获取分页文章
    public get(option: HttpRequestOption): Observable<Article[]> {
        return this.httpService.get<Article>(API.ARTICLE, option).pipe(
            map(
                (value: PaginationData<Article[]>) => {
                    this.total = value.total;
                    this.current_page = <number>option.page;

                    return value.data;
                }
            )
        );
    }

    //获取分页热门文章
    public getHots(option: HttpRequestOption): Observable<Article[]> {
        return this.httpService.get<Article>(API.HOT, option).pipe(
            map(
                (value: PaginationData<Article[]>) => {
                    this.total = value.total;
                    this.current_page = <number>option.page;

                    return value.data;
                }
            )
        );
    }

    //获取分页个性推荐文章
    public getRecommendations(option: HttpRequestOption): Observable<Article[]> {
        return this.httpService.get<Article>(API.RECOMMEND, option).pipe(
            map(
                (value: PaginationData<Article[]>) => {
                    this.total = value.total;
                    this.current_page = <number>option.page;

                    return value.data;
                }
            )
        );
    }

    //获取单个文章
    public getOne(id: string): Observable<Article> {
        return this.httpService.getOne<Article>(API.ARTICLE, id);
    }

    //创建文章
    public create(article: Article): Observable<Article> {
        return this.httpService.create<Article>(API.ARTICLE, article);
    }

    //修改文章
    public update(article: Article): Observable<Article> {
        return this.httpService.update<Article>(API.ARTICLE, article);
    }

    //更新文章状态
    public updateMany(articles: Article[]): Observable<boolean> {
        return this.httpService.updateMany<Article>(API.ARTICLE_MANY, articles);
    }

    //删除文章
    public delete(article_id: string): Observable<boolean> {
        return this.httpService.delete(API.ARTICLE, article_id);
    }

    //批量删除文章
    public deleteMany(article_ids: string[]): Observable<boolean> {
        return this.httpService.deleteMany(API.ARTICLE, article_ids);
    }
}