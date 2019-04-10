/**
 * @file 消息中心模块
 * @module app/user/back/message/module
 */

import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { MessageRoutingModule } from './message-routing.module';
import { CommentsComponent } from './comments/comments.component';
import { ShareModule } from '@app/share/share.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),

        MessageRoutingModule,
        ShareModule
    ],
    declarations: [
        CommentsComponent
    ]
})
export class MessageModule {}