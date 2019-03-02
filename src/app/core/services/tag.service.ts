/**
 * @file 文章标签服务
 * @module app/core/tag/service
 */

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import * as API from "@app/constants/api.constant";
import { HttpRequestOption, PaginationData } from '@app/interfaces/http.interface';
import { Tag } from '../models/tag.model';
import { HttpService } from './http.service';

@Injectable()
export class TagService {
    public total: number = 0;
    public current_page: number = 1;

    constructor(
        private httpService: HttpService,
        private http: HttpClient
    ) {}

    //获取标签
    public get(option: HttpRequestOption): Observable<Tag[]> {
        return this.httpService.get<Tag>(API.TAG, option).pipe(
            map(
                (value: PaginationData<Tag[]>) => {
                    this.total = value.total;
                    this.current_page = <number>option.page;

                    return value.data;
                }
            )
        );
    }

    //获取所有标签
    public getAll(): Observable<Tag[]> {
        return this.httpService.getAll<Tag>(API.TAG_ALL);
    }

    //创建标签
    public create(tag: Tag): Observable<Tag> {
        return this.httpService.create<Tag>(API.TAG, tag);
    }

    //修改标签
    public update(tag: Tag): Observable<Tag> {
        return this.httpService.update<Tag>(API.TAG, tag);
    }

    //删除标签
    public delete(tag_id: string): Observable<boolean> {
        return this.httpService.delete(API.TAG, tag_id);
    }

    //批量删除
    public deleteMany(tag_ids: string[]): Observable<boolean> {
        return this.httpService.deleteMany(API.TAG, tag_ids);
    }
}