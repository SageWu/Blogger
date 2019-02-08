/**
 * @file 用户后台管理模块
 * @module app/user/back/module
 */

import { NgModule } from "@angular/core";

import { BackRoutingModule } from './back-routing.module';
import { BackComponent } from "./back.component";
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { SettingComponent } from './setting/setting.component';

@NgModule({
    declarations: [
        BackComponent,
        DashboardComponent,
        AnnouncementComponent,
        SettingComponent
    ],
    imports: [
        BackRoutingModule
    ]
})
export class BackModule {}