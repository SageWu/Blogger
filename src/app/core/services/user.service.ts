/**
 * @file 用户服务
 * @module app/core/user/service
 */

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from "rxjs/operators";

import * as API from "@app/constants/api";
import * as HTTP_CODE from "@app/constants/http";
import { User } from '../models/user.model';

@Injectable()
export class UserService {
    //初始token和headers
    private token: string = "";
    private headers: HttpHeaders = new HttpHeaders({ "Content-Type": "application/json; charset=utf-8" });

    public user: User;

    constructor(
        private http: HttpClient
    ) {}

    //处理响应
    private handleResponse<T>(response: API.HttpResponse<T>): Observable<API.HttpResponse<T>> {
        if(response.status === API.HttpStatus.SUCCESS) {
            console.log("数据请求成功");
            return of(response);
        }
        else {
            console.log("数据请求失败");
            return throwError(response);
        }
    }

    //处理异常
    private handleError<T>(result: T) {
        return (error: API.HttpError): Observable<T> => {
            console.error(error);

            //401, 登录失败
            if(error.status === HTTP_CODE.UNAUTHORIZED) {

            }
            
            return of(result);
        }
    }

    public login(account: string, password: string): Observable<boolean> {
        let data: Object = {
            account: account,
            password: password
        };

        return this.http.post<API.HttpResponse<User>>(API.AUTH_USER, data, { headers: this.headers }).pipe(
            switchMap(this.handleResponse),
            map((value: API.HttpResponse<User>) => {
                if(value.result) {
                    return true;
                }
                else {
                    return false;
                }
            }),
            catchError(this.handleError<boolean>(false))
        );
    }
}