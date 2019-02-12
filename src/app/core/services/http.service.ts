/**
 * @file 提供公共http服务
 * @module app/core/http/service
 */

import { Injectable } from "@angular/core";
import { HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';

import { HttpResponse, HttpSuccessResponse, HttpErrorResponse, Token } from "@app/interfaces/http.interface";
import * as HTTP from "@app/constants/http.constant";

@Injectable()
export class HttpService {
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
}