/**
 * @file 核心模块
 * @module app/core/module
 */

import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";

import { UserService } from './services/user.service';
import { PreloaderService } from './services/preloader.service';
import { HttpService } from './services/http.service';
import { TagService } from './services/tag.service';
import { LogService } from './services/log.service';
import { CategoryService } from './services/category.service';

@NgModule({
    imports: [
        HttpClientModule,
    ],
    providers: [
        PreloaderService,
        HttpService,
        LogService,
        UserService,
        TagService,
        CategoryService
    ]
})
export class CoreModule {}