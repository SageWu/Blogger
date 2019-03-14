/**
 * @file 热门博文组建
 * @module app/user/home/hot/component
 */

import { Component, OnInit } from "@angular/core";
import { ArticleService } from '@app/core/services/article.service';
import { HttpRequestOption } from '@app/interfaces/http.interface';
import { PublishState, Origin, SortType, Article } from '@app/core/models/article.model';

@Component({
    templateUrl: "./hot.component.html",
    styleUrls: ["./hot.component.scss"]
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
            page_size: 10,
            state: PublishState.Published,
            origin: Origin.All,
            sort: SortType.Hot,
            category: "all",
            tag: "all",
            keyword: ""
        };

        this.getArticles();
    }

    public getArticles(): void {
        this.articleService.get(this.option).subscribe(
            (articles: Article[]) => {
                this.articles = this.articles.concat(articles);
                this.total = this.articleService.total;
            }
        );
    }
}