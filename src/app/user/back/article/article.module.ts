/**
 * @file 文章管理模块
 * @module app/user/back/article/module
 */

import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ModalModule } from "ngx-bootstrap/modal";

import { ArticleRoutingModule } from './article-routing.module';
import { ArticlesComponent } from './articles/articles.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { PostComponent } from './post/post.component';
import { ShareModule } from '@app/share/share.module';

@NgModule({
    declarations: [
        ArticlesComponent,
        CategoriesComponent,
        TagsComponent,
        PostComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        ArticleRoutingModule,
        ShareModule
    ]
})
export class ArticleModule {}