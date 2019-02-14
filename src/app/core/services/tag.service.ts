/**
 * @file 文章标签服务
 * @module app/core/tag/service
 */

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

import * as API from "@app/constants/api.constant";
import { HttpResponse, HttpRequestOption, PaginationData } from '@app/interfaces/http.interface';
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
        this.httpService.checkRequestCondition();
        let params: HttpParams = this.httpService.handleOption(option);

        return this.http.get<HttpResponse<PaginationData<Tag[]>>>(API.TAG, { headers: this.httpService.headers, params: params }).pipe(
            switchMap(this.httpService.handleResponse),
            map((result: PaginationData<Tag[]>) => {
                this.total = result.total;
                this.current_page = <number>option.page;

                return result.data;
            }),
            catchError(this.httpService.handleError<Tag[]>([]))
        );
    }

    //创建标签
    public create(tag: Tag): Observable<Tag> {
        this.httpService.checkRequestCondition();

        return this.http.post<HttpResponse<Tag>>(API.TAG, tag, { headers: this.httpService.headers }).pipe(
            switchMap(this.httpService.handleResponse),
            catchError(this.httpService.handleError<Tag>(null))
        );
    }

    //修改标签
    public update(tag: Tag): Observable<Tag> {
        this.httpService.checkRequestCondition();

        return this.http.put<HttpResponse<Tag>>(API.TAG, tag, { headers: this.httpService.headers }).pipe(
            switchMap(this.httpService.handleResponse),
            catchError(this.httpService.handleError<Tag>(null))
        );
    }

    //删除标签
    
}