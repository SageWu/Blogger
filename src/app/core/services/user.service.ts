/**
 * @file 用户服务
 * @module app/core/user/service
 */

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { Base64 } from "js-base64";

import * as API from "@app/constants/api.constant";
import * as HTTP from "@app/constants/http.constant";
import { HttpResponse, Token } from "@app/interfaces/http.interface";
import { User } from '../models/user.model';
import { HttpService } from './http.service';

@Injectable()
export class UserService {
    public user: User;

    constructor(
        private httpService: HttpService,
        private http: HttpClient
    ) {}

    //登录
    public login(account: string, password: string): Observable<boolean> {
        this.httpService.checkRequestCondition();
        let data: Object = {
            account: account,
            password: Base64.encode(password)
        };

        return this.http.post<HttpResponse<Token>>(API.AUTH_USER, data, { headers: this.httpService.headers }).pipe(
            switchMap(this.httpService.handleResponse),
            map((value: Token) => { //登录成功
                this.httpService.token = value;
                localStorage.setItem(HTTP.TOKEN_STORAGE, JSON.stringify(this.httpService.token));   //保存token
                return true;
            }),
            catchError(this.httpService.handleError<boolean>(false))
        );
    }

    //检查帐号是否已经存在
    public isExist(account: string): Observable<boolean> {
        this.httpService.checkRequestCondition();
        let params: HttpParams = new HttpParams();
        params = params.set("account", account);

        return this.http.get<HttpResponse<boolean>>(API.USER_EXIST, { headers: this.httpService.headers, params: params }).pipe(
            switchMap(this.httpService.handleResponse),
            catchError(this.httpService.handleError<boolean>(false))
        );
    }

    //获取用户信息
    public get(): Observable<User> {
        return this.httpService.getOne<User>(API.USER).pipe(
            tap((user: User) => {
                this.user = user
            })
        );
    }

    //创建用户
    public create(account: string, password: string): Observable<User> {
        let data: User = {
            account: account,
            password: Base64.encode(password),
            name: account
        };

        return this.httpService.create<User>(API.USER, data);
    }
}