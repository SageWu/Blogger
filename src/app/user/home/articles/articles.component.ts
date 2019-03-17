/**
 * @file 博文列表组件
 * @module app/user/home/articles/component
 */

import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Article } from '@app/core/models/article.model';

@Component({
    selector: "app-articles",
    templateUrl: "./articles.component.html",
    styleUrls: ["./articles.component.scss"]
})
export class ArticlesComponent implements OnInit, OnDestroy {
    @Input("articles") articles: Article[] = [];
    @Input("total") total: number = 0;
    @Output("nextPage") $next_page: EventEmitter<boolean> = new EventEmitter<boolean>();
    public destory: Subject<void> = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private router: Router
    ) {}

    ngOnInit() {
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
            if(this.articles.length >= this.total) {
                this.destory.next();
                this.destory.complete();
            }
            else {
                this.$next_page.next(true);
            }
        }
    }

    //查看文章详情
    public viewArticle(id: string): void {
        this.router.navigate(["../", "article", id], { relativeTo: this.route });
    }
}