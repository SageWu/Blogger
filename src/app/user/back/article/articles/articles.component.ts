/**
 * @file 管理文章组件
 * @module app/user/back/article/articles/component
 */

import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { PublishState, SortType, Origin, Article } from "@app/core/models/article.model";
import { TagService } from '@app/core/services/tag.service';
import { Tag } from '@app/core/models/tag.model';
import { CategoryService } from '@app/core/services/category.service';
import { Category } from '@app/core/models/category.model';
import { buildLevelCategories } from '@app/share/component.utils';
import { ArticleService } from '@app/core/services/article.service';
import { LogService } from '@app/core/services/log.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: "./articles.component.html",
    styleUrls: ["./articles.component.scss"]
})
export class ArticlesComponent implements OnInit {
    public buildLevelCategories = buildLevelCategories;

    public PublishState = PublishState;     //文章发布状态
    public Origin = Origin;                 //文章来源
    public SortType = SortType;             //文章排序规则

    public fetching = {                     //获取状态
        article: false
    }
    public total: number = 0;               //文章总计
    public search_form: FormGroup;          //搜索表单
    public option;                          //初始参数
    public tags: Tag[] = [];                //标签
    public categories: Category[] = [];     //目录
    public articles: Article[] = [];        //文章

    public select_all: boolean = false;     //是否全选
    public selected_articles: string[];     //选择文章id集合
    public article_id: string;
    @ViewChild("deleteModal") delete_modal: TemplateRef<any>;
    public modal_ref: BsModalRef;

    constructor(
        private fb: FormBuilder,
        private tagService: TagService,
        private categoryService: CategoryService,
        private articleService: ArticleService,
        private logService: LogService,
        private modalService: BsModalService,
        private router: Router,
        private route: ActivatedRoute
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
            tag: "all",
            keyword: ""
        };

        this.getCategories();
        this.getTags();
        this.getArticles();
    }

    public batchSelectChange(is_select: boolean): void {
        this.articles.forEach((article: Article) => article["selected"] = is_select);
        this.selected_articles = is_select? this.articles.map((article: Article) => article._id): [];
        this.select_all = this.selected_articles.length === this.articles.length;
    }

    public itemSelectChange(): void {
        this.selected_articles = this.articles.filter(
            (article: Article) => article["selected"]
        ).map(
            (article: Article) => article._id
        );
        this.select_all = this.selected_articles.length === this.articles.length;
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
                this.articles = articles;
                this.total = this.articleService.total;
                this.selected_articles = [];
                this.select_all = false;
            }
        );
    }

    //检查文章状态
    public isState(state: PublishState): boolean {
        return state === this.option.state;
    }

    //切换要获取文章的状态
    public switchState(state: PublishState): void {
        this.option.state = state;
        this.getArticles();
    }

    //刷新
    public refreshArticles(): void {
        this.getArticles();
    }

    //重置参数
    public resetParams(): void {
        this.option = {
            page: 1,
            page_size: 10,
            state: PublishState.All,
            origin: Origin.All,
            sort: SortType.Desc,
            category: "all",
            tag: "all",
            keyword: ""
        };
        this.search_form.reset();

        this.getArticles();
    }

    //查找文章
    public searchArticles(): void {
        this.option.keyword = this.search_form.value["keyword"];
        this.getArticles();
    }

    //批量更新文章状态
    public updateArticles(state: PublishState): void {
        let articles: Article[] = this.selected_articles.map(
            (id: string) => {
                return {
                    _id: id,
                    state: state
                } as Article;
            }
        );

        this.articleService.updateMany(articles).subscribe(
            (value: boolean) => {
                if(value) {
                    this.logService.notify("更新成功");
                    this.getArticles();
                }
                else {
                    this.logService.notify("更新失败");
                }
            }
        );
    }

    //更新单个文章状态
    public updateArticle(id: string, state: PublishState): void {
        let article: Article = {
            _id: id,
            state: state
        } as Article;

        this.articleService.update(article).subscribe(
            (value: Article) => {
                if(value) {
                    this.logService.notify("更新成功");
                    this.getArticles();
                }
                else {
                    this.logService.notify("更新失败");
                }
            }
        )
    }

    //将文章改为发布状态
    public moveToPublished(id: string): void {
        if(id) {
            this.updateArticle(id, PublishState.Published);
        }
        else {
            this.updateArticles(PublishState.Published);
        }
    }

    //将文章改为草稿状态
    public moveToDraft(id: string): void {
        if(id) {
            this.updateArticle(id, PublishState.Draft);
        }
        else {
            this.updateArticles(PublishState.Draft);
        }
    }

    //将文章移至回收站
    public moveToRecycle(id: string): void {
        if(id) {
            this.updateArticle(id, PublishState.Recycle);
        }
        else {
            this.updateArticles(PublishState.Recycle);
        }
    }

    //页数发生变化
    public pageChanged(event): void {
        this.option.page = event.page;
        this.refreshArticles();
    }

    //删除文章
    public deleteArticle(): void {
        this.articleService.delete(this.article_id).subscribe(
            (result: boolean) => {
                if(result) {
                    this.cancelModal();
                    this.article_id = null;
                    this.refreshArticles();
                }
                else {  //删除失败
                    this.cancelModal();
                    this.logService.notify("删除文章失败");
                }
            }
        );
    }

    //批量删除文章
    public deleteArticles(): void {
        this.articleService.deleteMany(this.selected_articles).subscribe(
            (results: boolean) => {
                if(results) {
                    this.cancelModal();
                    this.refreshArticles();
                }
                else {  //删除失败
                    this.cancelModal();
                    this.logService.notify("删除文章失败");
                }
            }
        );
    }

    //打开确认删除modal
    public deleteArticleModal(id: string): void {
        this.article_id = id;
        this.modal_ref = this.modalService.show(this.delete_modal);
    }

    //打开确认批量删除modal
    public deleteArticlesModal(): void {
        this.article_id = null;
        this.modal_ref = this.modalService.show(this.delete_modal);
    }

    //关闭modal
    public cancelModal(): void {
        this.modal_ref.hide();
        this.modal_ref = null;
        this.article_id = null;
    }

    //编辑文章
    public editArticle(article_id: string): void {
        this.router.navigate(["../", "post"], { relativeTo: this.route, queryParams: { id: article_id } });
    }
}