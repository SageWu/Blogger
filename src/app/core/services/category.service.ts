/**
 * @file 文章分类目录服务
 * @module app/core/category/service
 */

import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Category } from '../models/category.model';
import { HttpService } from './http.service';
import { HttpRequestOption, PaginationData } from '@app/interfaces/http.interface';
import * as API from "@app/constants/api.constant";

@Injectable()
export class CategoryService {
    public total: number;
    public current_page: number;

    constructor(
        private httpService: HttpService,
        private http: HttpClient
    ) {}

    //获取文章目录
    public get(option: HttpRequestOption): Observable<Category[]> {
        return this.httpService.get<Category>(API.CATEGORY, option).pipe(
            map(
                (value: PaginationData<Category[]>) => {
                    this.total = value.total;
                    this.current_page = <number>option.page;

                    return value.data;
                }
            )
        );
    }

    //创建文章目录
    public create(category: Category): Observable<Category> {
        return this.httpService.create<Category>(API.CATEGORY, category);
    }

    //修改文章目录
    public update(category: Category): Observable<Category> {
        return this.httpService.update<Category>(API.CATEGORY, category);
    }

    //删除文章目录
    public delete(category_id: string): Observable<boolean> {
        return this.httpService.delete(API.CATEGORY, category_id);
    }

    //批量文章目录
    public deleteMany(category_ids: string[]): Observable<boolean> {
        return this.httpService.deleteMany(API.CATEGORY, category_ids);
    }
}