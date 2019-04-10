import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import * as md from 'markdown-it';
import * as mdSub from 'markdown-it-sub';
import * as mdSup from 'markdown-it-sup';
import * as mdHl from 'markdown-it-highlightjs';

import { ArticleService } from '@app/core/services/article.service';
import { Article, SortType } from '@app/core/models/article.model';
import { Log, PreferenceDegree } from '@app/core/models/log.model';
import { LogService } from '@app/core/services/log.service';
import { Comment, CommentState } from '@app/core/models/comment.model';
import { CommentService } from '@app/core/services/comment.service';
import { HttpRequestOption } from '@app/interfaces/http.interface';
import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    templateUrl: "./article.component.html",
    styleUrls: ["./article.component.scss"]
})
export class ArticleComponent implements OnInit, OnDestroy {
    public id: string;                          //文章id
    public article: Article;                    //文章
    public option: HttpRequestOption;           //评论查询参数
    public total: number = 0;                   //评论总数
    public comments: Comment[] = [];            //文章评论
    public render = md();                       //markdown渲染器

    public destory: Subject<void> = new Subject<void>();
    public timer = undefined;                   //记录定时器
    public liked: boolean = false;              //是否点击喜欢
    public parent_comment: Comment = null;      //父级评论

    @ViewChild("textarea") textarea: ElementRef;

    constructor(
        private route: ActivatedRoute,

        private articleService: ArticleService,
        private logService: LogService,
        private commentService: CommentService
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

        this.option = {
            page: 1,
            page_size: 10,
            state: CommentState.Published,
            article_id: this.id,
            sort: SortType.Desc,
            no_back: true
        };
        this.getComments();

        //监听容器滚动事件
        let element: HTMLDivElement = document.querySelector("#container");
        fromEvent(element, "scroll").pipe(
            takeUntil(this.destory)
        )
        .subscribe(this.onScroll.bind(this));
    }

    ngOnDestroy() {
        if(this.timer)
            clearInterval(this.timer);

        this.destory.next();
        this.destory.complete();
    }

    //当滚动到底部时获取下一页数据
    public onScroll(event: Event): void {
        let target: any = event.target;
        if(target.scrollTop + target.clientHeight >= target.scrollHeight) {
            if(this.comments.length >= this.total) {
                this.destory.next();
                this.destory.complete();
            }
            else {
                this.option.page += 1;
                this.getComments();
            }
        }
    }

    //获取浏览记录
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

    //获取评论
    public getComments(): void {
        this.commentService.get(this.option).subscribe(
            (comments: Comment[]) => {
                this.comments = this.comments.concat(comments);
                this.total = this.commentService.total;
            }
        );
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

    //回复
    public reply(comment: Comment): void {
        this.parent_comment = comment;
        this.textarea.nativeElement.value = "@" + comment.user_id["name"] + ":";
        this.textarea.nativeElement.focus();
    }

    //评论
    public comment(value: string): void {
        if(value === "") return;
        if(this.parent_comment) {
            let result: string = value.match(/^@.*:(.*)/)[1];
            if(result === "") return;
        }

        let comment: Comment = {
            content: value,
            parent_id: this.parent_comment? this.parent_comment._id: null,
            article_id: this.id,
            author_id: this.article.user_id["_id"],
            agent: navigator.userAgent,
            
        };

        this.commentService.create(comment).subscribe((value: Comment) => {
            if(value) {
                this.textarea.nativeElement.value = "";
                this.comments.unshift(value);
            }
            else {
                this.logService.notify("评论失败");
            }
        });
    }
}