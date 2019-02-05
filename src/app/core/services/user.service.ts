/**
 * @file 用户服务
 * @module app/core/user/service
 */

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";
import { Base64 } from "js-base64";

import * as API from "@app/constants/api.constant";
import * as HTTP from "@app/constants/http.constant";
import { HttpResponse, HttpSuccessResponse, HttpErrorResponse, Token } from "@app/interfaces/http.interface";
import { User } from '../models/user.model';

@Injectable()
export class UserService {
    //初始token和headers
    private token: Token;
    private headers: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json; charset=utf-8" });

    public user: User;

    constructor(
        private http: HttpClient
    ) {}

    //处理响应
    private handleResponse<T>(response: HttpResponse<T>): Observable<T> {
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
    private handleError<T>(result: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            console.info(error);

            if(error.statusCode === HTTP.UNAUTHORIZED) {
                //todo
            }
            
            return of(result);
        }
    }

    //请求前检查
    private checkRequestCondition(): void {
        //检查token
        this.token = this.token? this.token: JSON.parse(localStorage.getItem(HTTP.TOKEN_STORAGE));
        if(this.token && this.token.accessToken.split('.').length === 3) {
            this.headers = this.headers.set(HTTP.TOKEN_HEADER, `Bearer ${this.token.accessToken}`);            
        }

        return;
    }

    //登录
    public login(account: string, password: string): Observable<boolean> {
        this.checkRequestCondition();
        let data: Object = {
            account: account,
            password: Base64.encode(password)
        };

        return this.http.post<HttpResponse<Token>>(API.AUTH_USER, data, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            map((value: Token) => { //登录成功
                this.token = value;
                localStorage.setItem(HTTP.TOKEN_STORAGE, JSON.stringify(this.token));   //保存token
                return true;
            }),
            catchError(this.handleError<boolean>(false))
        );
    }

    //检查帐号是否已经存在
    public isExist(account: string): Observable<boolean> {
        this.checkRequestCondition();
        let params: HttpParams = new HttpParams();
        params = params.set("account", account);

        return this.http.get<HttpResponse<boolean>>(API.USER_EXIST, { headers: this.headers, params: params }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<boolean>(false))
        );
    }

    //获取用户信息
    public get(): Observable<User> {
        this.checkRequestCondition();

        return this.http.get<HttpResponse<User>>(API.USER, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            map((value: User) => {
                this.user = value;
                return value;
            }),
            catchError(this.handleError<User>(null))
        );
    }

    //创建用户
    public create(account: string, password: string): Observable<User> {
        this.checkRequestCondition();
        let data: Object = {
            account: account,
            password: Base64.encode(password),
            name: account
        };

        return this.http.post<HttpResponse<User>>(API.USER, data, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            catchError(this.handleError<User>(null))
        );
    }
}