/**
 * @file 评论管理组建
 * @module app/user/back/message/comments/component
 */

import { Component, OnInit } from "@angular/core";
import { HttpRequestOption } from '@app/interfaces/http.interface';
import { CommentState, Comment } from '@app/core/models/comment.model';
import { CommentService } from '@app/core/services/comment.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SortType } from '@app/core/models/article.model';
import { LogService } from '@app/core/services/log.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: "./comments.component.html",
    styleUrls: ["./comments.component.scss"]
})
export class CommentsComponent implements OnInit {
    public CommentState = CommentState;
    public SortType = SortType;

    public article_id: string = "";         //文章编号

    public fetching = {                     //获取状态
        comment: false
    }
    public option: HttpRequestOption;       //查询参数
    public comments: Comment[] = [];        //文章评论列表
    public total: number = 0;               //总数
    public search_form: FormGroup;          //搜索表单

    public select_all: boolean = false;     //是否全选
    public selected_comments: string[] = [];//选中的评论的id集合

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,

        private commentService: CommentService,
        private logService: LogService
    ) {
        this.search_form = this.fb.group({ keyword: ["", Validators.compose([Validators.required])] });
    }

    ngOnInit() {
        this.option = {
            page: 1,
            page_size: 10,
            state: CommentState.All,
            sort: SortType.Desc,
            keyword: ""
        };

        let article_id: string = this.route.snapshot.params.article_id;
        if(article_id && article_id !== "undefined") {
            this.option.article_id = article_id;
        }

        this.getComments();
    }

    //获取评论列表
    public getComments(): void {
        this.commentService.get(this.option).subscribe(
            (comments: Comment[]) => {
                this.comments = comments;
                this.total = this.commentService.total;
                this.selected_comments = [];
                this.select_all = false;
            }
        );
    }

    //刷新
    public refreshComments(): void {
        this.getComments();
    }

    //查找评论
    public searchComments(): void {
        this.option.keyword = this.search_form.value["keyword"];
        this.getComments();
    }

    //重置参数
    public resetParams(): void {
        this.option = {
            page: 1,
            page_size: 10,
            state: CommentState.All,
            sort: SortType.Desc,
            keyword: ""
        };
        this.search_form.reset();

        this.getComments();
    }

    //检查评论状态
    public isState(state: CommentState): boolean {
        return state === this.option.state;
    }

    //切换查看的评论状态
    public switchState(state: CommentState): void {
        if(state === this.option.state) return;

        this.option.state = state;
        this.getComments();
    }

    //批量更新评论状态
    public updateComments(state: CommentState): void {
        let comments: Comment[] = this.selected_comments.map(
            (id: string) => {
                return {
                    _id: id,
                    state: state
                } as Comment;
            }
        );

        this.commentService.updateMany(comments).subscribe(
            (value: boolean) => {
                if(value) {
                    this.logService.notify("更新成功");
                    this.getComments();
                }
                else {
                    this.logService.notify("更新失败");
                }
            }
        );
    }

    //更新单个评论状态
    public updateComment(id: string, state: CommentState): void {
        let comment: Comment = {
            _id: id,
            state: state
        } as Comment;

        this.commentService.update(comment).subscribe(
            (value: Comment) => {
                if(value) {
                    this.logService.notify("更新成功");
                    this.getComments();
                }
                else {
                    this.logService.notify("更新失败");
                }
            }
        );
    }
    
    //将评论改为显示状态
    public moveToPublished(id: string): void {
        if(id) {
            this.updateComment(id, CommentState.Published);
        }
        else {
            this.updateComments(CommentState.Published);
        }
    }

    //将评论改为回收站状态
    public moveToSpam(id: string): void {
        if(id) {
            this.updateComment(id, CommentState.Spam);
        }
        else {
            this.updateComments(CommentState.Spam);
        }
    }

    //将评论改为删除状态
    public moveToDeleted(id: string): void {
        if(id) {
            this.updateComment(id, CommentState.Deleted);
        }
        else {
            this.updateComments(CommentState.Deleted);
        }
    }

    //页数发生变化
    public pageChanged(event): void {
        this.option.page = event.page;
        this.refreshComments();
    }
}