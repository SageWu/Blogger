/**
 * @file 提供公共http服务
 * @module app/core/http/service
 */

import { Injectable } from "@angular/core";
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { HttpResponse, HttpSuccessResponse, HttpErrorResponse, Token, HttpRequestOption, PaginationData } from "@app/interfaces/http.interface";
import * as HTTP from "@app/constants/http.constant";
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class HttpService {
    constructor(
        private http: HttpClient,
    ) {}

    //初始token和headers
    public token: Token;
    public headers: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json; charset=utf-8" });

    //处理响应
    public handleResponse<T>(response: HttpResponse<T>): Observable<T> {
        if(response.statusCode === HTTP.SUCCESS) {
            console.log("数据请求成功");
            return of((<HttpSuccessResponse<T>>response).result);
        }
        else {
            console.log("数据请求失败");
            return throwError(response);
        }
    }

    //处理异常
    public handleError<T>(result: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.info(error);

            if(error.statusCode === HTTP.UNAUTHORIZED) {
                //todo
            }
            
            return of(result);
        }
    }

    //请求前检查
    public checkRequestCondition(): void {
        //检查token
        this.token = this.token? this.token: JSON.parse(localStorage.getItem(HTTP.TOKEN_STORAGE));
        if(this.token && this.token.accessToken.split('.').length === 3) {
            this.headers = this.headers.set(HTTP.TOKEN_HEADER, `Bearer ${this.token.accessToken}`);            
        }

        return;
    }

    //转为HttpParams
    public handleOption(option: HttpRequestOption): HttpParams {
        let name: string;
        let params: HttpParams = new HttpParams();

        for(name in option) {
            params = params.set(name, option[name].toString());
        }

        return params;
    }

    //获取分页数据
    public get<T>(api: string, option: HttpRequestOption): Observable<PaginationData<T[]>> {
        this.checkRequestCondition();
        let params: HttpParams = this.handleOption(option);

        return this.http.get<HttpResponse<PaginationData<T[]>>>(api, { headers: this.headers, params: params }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<PaginationData<T[]>>(null))
        );
    }

    //获取单个数据
    public getOne<T>(api: string, id: string): Observable<T> {
        this.checkRequestCondition();

        return this.http.get<HttpResponse<T>>(api + "/" + id, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<T>(null))
        );
    }

    //获取所有数据
    public getAll<T>(api: string): Observable<T[]> {
        this.checkRequestCondition();

        return this.http.get<HttpResponse<T[]>>(api, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<T[]>([]))
        );
    }

    //创建
    public create<T>(api: string, data: T): Observable<T> {
        this.checkRequestCondition();

        return this.http.post<HttpResponse<T>>(api, data, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<T>(null))
        );
    }

    //更新
    public update<T>(api: string, data: T): Observable<T> {
        this.checkRequestCondition();

        return this.http.put<HttpResponse<T>>(api, data, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<T>(null))
        );
    }

    //删除
    public delete(api: string, id: string): Observable<boolean> {
        this.checkRequestCondition();
        let url: string = api + "/" + id;
        
        return this.http.delete<HttpResponse<boolean>>(url, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<boolean>(false))
        );
    }

    //批量删除
    public deleteMany(api: string, ids: string[]): Observable<boolean> {
        this.checkRequestCondition();

        return this.http.request<HttpResponse<boolean>>("delete", api, { headers: this.headers, body: ids }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<boolean>(false))
        );
    }
}