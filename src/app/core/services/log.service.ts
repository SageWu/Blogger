/**
 * @file 日志和提醒服务
 * @module app/core/log/service
 */

import { Injectable } from "@angular/core";
import { ElNotificationService } from "element-angular";
import { Observable } from 'rxjs';

import * as API from "@app/constants/api.constant";
import { Log } from '../models/log.model';
import { HttpService } from './http.service';
import { map } from 'rxjs/operators';

@Injectable()
export class LogService {
    constructor(
        private notificationService: ElNotificationService,
        private httpService: HttpService
    ) {}

    public notify(message: string): void {
        this.notificationService.setOptions({ zIndex: 1040, offset: 70 });
        this.notificationService.show(message);
    }

    //记录浏览痕迹
    public log(log: Log): Observable<boolean> {
        return this.httpService.update<Log>(API.LOG, log).pipe(
            map((log: Log) => {
                if(log)
                    return true;
                else
                    return false;
            })
        );
    }

    //获取浏览痕迹
    public getLog(article_id: string): Observable<Log> {
        return this.httpService.getOne<Log>(API.LOG, article_id);
    }
}