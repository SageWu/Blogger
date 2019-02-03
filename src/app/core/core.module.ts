/**
 * @file 核心模块
 * @module app/core/module
 */

import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { UserService } from './services/user.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        UserService
    ]
})
export class CoreModule {}