/**
 * @file 用户后台管理路由模块
 * @module app/user/back/routing-module
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { BackComponent } from './back.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AnnouncementComponent } from './announcement/announcement.component';
import { SettingComponent } from './setting/setting.component';

const user_back_routes: Routes = [
    { path: "", component: BackComponent, children: [
        { path: "", redirectTo: "dashboard", pathMatch: "full" },
        { path: "dashboard", component: DashboardComponent },
        { path: "announcement", component: AnnouncementComponent },
        { path: "setting", component: SettingComponent },
        { path: "article", loadChildren: "./article/article.module#ArticleModule" },
        { path: "message", loadChildren: "./message/message.module#MessageModule" }
    ] },
];

@NgModule({
    imports: [
        RouterModule.forChild(user_back_routes)
    ],
    exports: [
        RouterModule
    ]
})
export class BackRoutingModule {}