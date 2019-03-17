/**
 * @file 最新博文组件
 * @module app/user/home/latest/component
 */

import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ArticleService } from '@app/core/services/article.service';
import { HttpRequestOption } from '@app/interfaces/http.interface';
import { PublishState, Origin, SortType, Article } from '@app/core/models/article.model';

@Component({
    templateUrl: "./latest.component.html",
    styleUrls: ["./latest.component.scss"]
})
export class LatestComponent implements OnInit, OnDestroy {
    private option: HttpRequestOption;  //查询参数
    public articles: Article[] = [];    //文章列表
    public total: number;               //文章总数

    public destory: Subject<void> = new Subject<void>();

    constructor(
        private articleService: ArticleService,
        private route: ActivatedRoute,
        private router: Router
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

        //监听容器滚动事件
        let element: HTMLDivElement = document.querySelector("#container");
        fromEvent(element, "scroll").pipe(
            takeUntil(this.destory)
        )
        .subscribe(this.onScroll.bind(this));
    }

    ngOnDestroy() {
        this.destory.next();
        this.destory.complete();
    }

    //当滚动到底部时获取下一页数据
    public onScroll(event: Event): void {
        let target: any = event.target;
        if(target.scrollTop + target.clientHeight >= target.scrollHeight) {
            (<number>this.option.page) += 1;
            this.getArticles();
        }
    }

    //获取文章
    public getArticles(): void {
        this.articleService.get(this.option).subscribe(
            (articles: Article[]) => {
                this.articles = this.articles.concat(articles);
                this.total = this.articleService.total;

                //无更多数据则取消监听滚动
                if(this.articles.length >= this.total) {
                    this.destory.next();
                    this.destory.complete();
                }
            }
        );
    }

    //查看文章详情
    public viewArticle(id: string): void {
        this.router.navigate(["../", "article", id], { relativeTo: this.route });
    }
}