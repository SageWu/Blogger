import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import * as md from 'markdown-it';
import * as mdSub from 'markdown-it-sub';
import * as mdSup from 'markdown-it-sup';
import * as mdHl from 'markdown-it-highlightjs';

import { ArticleService } from '@app/core/services/article.service';
import { Article } from '@app/core/models/article.model';
import { Log, PreferenceDegree } from '@app/core/models/log.model';
import { LogService } from '@app/core/services/log.service';

@Component({
    templateUrl: "./article.component.html",
    styleUrls: ["./article.component.scss"]
})
export class ArticleComponent implements OnInit, OnDestroy {
    private id: string;         //文章id
    public article: Article;    //文章
    private render = md();      //markdown渲染器
    private timer = undefined;  //定时器
    public liked: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private articleService: ArticleService,
        private logService: LogService
    ) {}

    ngOnInit() {
        this.render
        .use(mdSub)
        .use(mdSup)
        .use(mdHl);

        this.id = this.route.snapshot.params["id"];
        this.articleService.getOne(this.id).subscribe(
            (article: Article) => {
                this.article = article;
                this.article.content = this.render.render(this.article.content);
                
                //提交记录
                let log: Log = {
                    article_id: this.id,
                    count: 1
                };
                this.logService.log(log).subscribe((value: boolean) => {
                    this.getLog();
                });

                //定时提交记录
                this.timer = setInterval(() => {
                    let log: Log = {
                        article_id: this.id,
                        duration: 1
                    };
                    this.logService.log(log).subscribe((value: boolean) => {});
                }, 1000 * 60);
            }
        );
    }

    public getLog(): void {
        //获取记录
        this.logService.getLog(this.id).subscribe(
            (log: Log) => {
                if(log && log.preference_degree === PreferenceDegree.LIKE) {
                    let element: HTMLDivElement = document.querySelector("#like");
                    element.classList.toggle("active");
                    this.liked = true;
                }
            }
        );
    }

    ngOnDestroy() {
        if(this.timer)
            clearInterval(this.timer);
    }

    //喜欢文章
    public like(): void {
        if(this.liked) return;

        let element: HTMLDivElement = document.querySelector("#like");
        element.classList.toggle("active");

        let log: Log = {
            article_id: this.id,
            preference_degree: PreferenceDegree.LIKE
        };
        this.logService.log(log).subscribe((value: boolean) => { this.liked = true; });
    }
}