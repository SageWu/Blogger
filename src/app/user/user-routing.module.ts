/**
 * @file 用户路由模块
 * @module app/user/routing-module
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

const user_routes: Routes = [
    { path: "", redirectTo: "login", pathMatch: "full" },
    { path: "login", component: LoginComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(user_routes)
    ],
    exports: [
        RouterModule
    ]
})
export class UserRoutingModule {}