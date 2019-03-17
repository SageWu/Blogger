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
import { ArticleComponent } from './article/article.component';
import { LatestComponent } from './latest/latest.component';
import { ArticlesComponent } from './articles/articles.component';

@NgModule({
    declarations: [
        HomeComponent,
        HotComponent,
        LatestComponent,
        RecommendComponent,
        ArticlesComponent,
        ArticleComponent
    ],
    imports: [
        CommonModule,
        HomeRoutingModule
    ]
})
export class HomeModule {}