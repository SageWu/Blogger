/**
 * @file 日志和提醒服务
 * @module app/core/log/service
 */

import { Injectable } from "@angular/core";
import { ElNotificationService } from "element-angular";

@Injectable()
export class LogService {
    constructor(
        private notificationService: ElNotificationService
    ) {}

    public notify(message: string): void {
        this.notificationService.setOptions({ zIndex: 1040, offset: 70 });
        this.notificationService.show(message);
    }
}