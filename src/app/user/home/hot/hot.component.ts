/**
 * @file 热门博文组件
 * @module app/user/home/hot/component
 */

import { Component, OnInit } from "@angular/core";

import { ArticleService } from '@app/core/services/article.service';
import { HttpRequestOption } from '@app/interfaces/http.interface';
import { Article } from '@app/core/models/article.model';

@Component({
    templateUrl: "./hot.component.html"
})
export class HotComponent implements OnInit {
    private option: HttpRequestOption;  //查询参数
    public articles: Article[] = [];    //文章列表
    public total: number;               //文章总数

    constructor(
        private articleService: ArticleService
    ) {}

    ngOnInit() {
        this.option = {
            page: 1,
            page_size: 10
        };

        this.getArticles();
    }

    //当滚动到底部时获取下一页数据
    public onNextPage(event: Event): void {
        (<number>this.option.page) += 1;
        this.getArticles();
    }

    //获取热门文章
    public getArticles(): void {
        this.articleService.getHots(this.option).subscribe(
            (articles: Article[]) => {
                this.articles = this.articles.concat(articles);
                this.total = this.articleService.total;
            }
        );
    }
}