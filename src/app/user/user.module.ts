/**
 * @file 用户模块
 * @module app/user/module
 */

import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
    imports: [
        CommonModule,
        UserRoutingModule
    ],
    declarations: [
        LoginComponent
    ]
})
export class UserModule {}