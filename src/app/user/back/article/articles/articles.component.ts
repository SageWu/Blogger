/**
 * @file 管理文章组件
 * @module app/user/back/article/articles/component
 */

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { PublishState, SortType, Origin } from "@app/core/models/article.model";

@Component({
    templateUrl: "./articles.component.html",
    styleUrls: ["./articles.component.scss"]
})
export class ArticlesComponent implements OnInit {
    public PublishState = PublishState; //文章发布状态
    public SortType = SortType; //文章排序规则
    public Origin = Origin; //文章来源

    public total: number = 0;   //文章总计
    public search_form: FormGroup;  //搜索表单
    public params = {   //初始参数
        state: PublishState.All,
        origin: Origin.All,
        category: "all",
        tag: "all",
        sort: SortType.Desc,
    };

    constructor(
        private fb: FormBuilder
    ) {
        this.search_form = this.fb.group({ keyword: ["", Validators.compose([Validators.required])] });
    }
    
    ngOnInit(): void {
        this.getCategories();
        this.getTags();
        this.getArticles();
    }

    public getCategories(): void {

    }

    public getTags(): void {

    }

    //获取文章
    public getArticles(): void {

    }

    //检查文章状态
    public isState(state: PublishState): boolean {
        return state === this.params.state;
    }

    //切换显示文章状态
    public switchState(state: PublishState): void {
        this.params.state = state;
    }

    //刷新
    public refreshArticles(): void {

    }

    //重置参数
    public resetParams(): void {

    }

    //查找文章
    public searchArticles(): void {

    }
}