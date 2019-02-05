/**
 * @file 用户主页模块
 * @module app/user/home/module
 */

import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { HotComponent } from './hot/hot.component';
import { RecommendComponent } from './recommend/recommend.component';

@NgModule({
    declarations: [
        HomeComponent,
        HotComponent,
        RecommendComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule
    ]
})
export class HomeModule {}