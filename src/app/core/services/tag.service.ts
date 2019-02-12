/**
 * @file 文章标签服务
 * @module app/core/tag/service
 */

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

import * as API from "@app/constants/api.constant";
import { HttpResponse } from '@app/interfaces/http.interface';
import { Tag } from '../models/tag.model';
import { HttpService } from './http.service';

@Injectable()
export class TagService {
    constructor(
        private httpService: HttpService,
        private http: HttpClient
    ) {}

    //创建标签
    public create(tag: Tag): Observable<Tag> {
        this.httpService.checkRequestCondition();

        return this.http.post<HttpResponse<Tag>>(API.TAG, tag, { headers: this.httpService.headers }).pipe(
            switchMap(this.httpService.handleResponse),
            catchError(this.httpService.handleError<Tag>(null))
        );
    }

    //修改标签
    public modify(tag: Tag): Observable<Tag> {
        this.httpService.checkRequestCondition();

        return this.http.post<HttpResponse<Tag>>(API.TAG, tag, { headers: this.httpService.headers }).pipe(
            switchMap(this.httpService.handleResponse),
            catchError(this.httpService.handleError<Tag>(null))
        );
    }
}