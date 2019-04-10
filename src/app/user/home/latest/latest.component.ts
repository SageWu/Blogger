/**
 * @file 最新博文组件
 * @module app/user/home/latest/component
 */

import { Component, OnInit } from "@angular/core";

import { ArticleService } from '@app/core/services/article.service';
import { HttpRequestOption } from '@app/interfaces/http.interface';
import { PublishState, Origin, SortType, Article } from '@app/core/models/article.model';

@Component({
    templateUrl: "./latest.component.html"
 })
export class LatestComponent implements OnInit {
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
            sort: SortType.Desc,
            category: "all",
            tag: "all",
            keyword: "",
            no_back: true
        };

        this.getArticles();
    }

    //当滚动到底部时获取下一页数据
    public onNextPage(event: Event): void {
        (<number>this.option.page) += 1;
        this.getArticles();
    }

    //获取文章
    public getArticles(): void {
        this.articleService.get(this.option).subscribe(
            (articles: Article[]) => {
                this.articles = this.articles.concat(articles);
                this.total = this.articleService.total;
            }
        );
    }
}