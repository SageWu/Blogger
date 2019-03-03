/**
 * @file 管理文章组件
 * @module app/user/back/article/articles/component
 */

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { PublishState, SortType, Origin, Article } from "@app/core/models/article.model";
import { TagService } from '@app/core/services/tag.service';
import { Tag } from '@app/core/models/tag.model';
import { CategoryService } from '@app/core/services/category.service';
import { Category } from '@app/core/models/category.model';
import { buildLevelCategories } from '@app/share/component.utils';
import { ArticleService } from '@app/core/services/article.service';

@Component({
    templateUrl: "./articles.component.html",
    styleUrls: ["./articles.component.scss"]
})
export class ArticlesComponent implements OnInit {
    public buildLevelCategories = buildLevelCategories;

    public PublishState = PublishState;     //文章发布状态
    public Origin = Origin;                 //文章来源
    public SortType = SortType;             //文章排序规则

    public fetching = {
        article: false
    }
    public total: number = 0;               //文章总计
    public search_form: FormGroup;          //搜索表单
    public option;                  //初始参数
    public tags: Tag[] = [];
    public categories: Category[] = [];
    public articles: Article[] = [];

    public select_all: boolean = false;

    constructor(
        private fb: FormBuilder,
        private tagService: TagService,
        private categoryService: CategoryService,
        private articleService: ArticleService
    ) {
        this.search_form = this.fb.group({ keyword: ["", Validators.compose([Validators.required])] });
    }
    
    ngOnInit(): void {
        this.option = {
            page: 1,
            page_size: 10,
            state: PublishState.All,
            origin: Origin.All,
            sort: SortType.Desc,
            category: "all",
            tag: "all"
        };

        this.getCategories();
        this.getTags();
        this.getArticles();
    }

    public batchSelectChange(event): void {

    }

    public itemSelectChange(): void {

    }

    //获取文章目录
    public getCategories(): void {
        this.categoryService.getAll().subscribe(
            (categories: Category[]) => {
                this.categories = this.buildLevelCategories(categories);
            }
        );
    }

    //获取标签
    public getTags(): void {
        this.tagService.getAll().subscribe(
            (tags: Tag[]) => {
                this.tags = tags;
            }
        );
    }

    //获取文章
    public getArticles(): void {
        this.articleService.get(this.option).subscribe(
            (articles: Article[]) => {
                console.log(articles)
                this.articles = articles;
                this.total = this.articleService.total;
            }
        )
    }

    //检查文章状态
    public isState(state: PublishState): boolean {
        return state === this.option.state;
    }

    //切换要获取文章的状态
    public switchState(state: PublishState): void {
        this.option.state = state;
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