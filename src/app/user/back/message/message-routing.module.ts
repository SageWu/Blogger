/**
 * @file 消息中心路由模块
 * @module app/user/back/message-routing/module
 */

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { CommentsComponent } from './comments/comments.component';

const user_back_message_routes: Routes = [
    { path: "", redirectTo: "comments", pathMatch: "full" },
    { path: "comments/:article_id", component: CommentsComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(user_back_message_routes)
    ],
    exports: [
        RouterModule
    ]
})
export class MessageRoutingModule {}