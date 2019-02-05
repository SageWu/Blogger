/**
 * @file 用户主页路由模块
 * @module app/user/home/routing-module
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { HotComponent } from './hot/hot.component';
import { RecommendComponent } from './recommend/recommend.component';

const user_home_routes: Routes = [
    { path: "", component: HomeComponent, children: [
        { path: "", redirectTo: "hot", pathMatch: "full" },
        { path: "hot", component: HotComponent },
        { path: "recommend", component: RecommendComponent }
    ] }
];

@NgModule({
    imports: [
        RouterModule.forChild(user_home_routes)
    ],
    exports: [
        RouterModule
    ]
})
export class HomeRoutingModule {}