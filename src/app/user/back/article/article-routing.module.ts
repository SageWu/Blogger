/**
 * @file 文章管理模块路由
 * @module app/user/back/article/routing-module
 */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from './articles/articles.component';
import { CategoriesComponent } from './categories/categories.component';
import { TagsComponent } from './tags/tags.component';
import { PostComponent } from './post/post.component';

const user_back_article_routes: Routes = [
    { path: "", component: ArticlesComponent },
    { path: "categories", component: CategoriesComponent },
    { path: "tags", component: TagsComponent },
    { path: "post", component: PostComponent }
];

@NgModule({
    imports: [
        RouterModule.forChild(user_back_article_routes)
    ],
    exports: [
        RouterModule
    ]
})
export class ArticleRoutingModule {}