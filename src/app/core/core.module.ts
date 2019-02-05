/**
 * @file 核心模块
 * @module app/core/module
 */

import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { UserService } from './services/user.service';
import { PreloaderService } from './services/preloader.service';

@NgModule({
    imports: [
        HttpClientModule
    ],
    providers: [
        PreloaderService,
        UserService
    ]
})
export class CoreModule {}