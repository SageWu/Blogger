/**
 * @file 用户发布文章组件
 * @module app/user/back/article/post/component
 */

import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as SimpleMDE from 'simplemde';
import * as md from 'markdown-it';
import * as mdSub from 'markdown-it-sub';
import * as mdSup from 'markdown-it-sup';
import * as mdHl from 'markdown-it-highlightjs';

import { formControlStateClass, buildLevelCategories } from '@app/share/component.utils';
import { Tag } from '@app/core/models/tag.model';
import { TagService } from '@app/core/services/tag.service';
import { Category } from '@app/core/models/category.model';
import { CategoryService } from '@app/core/services/category.service';
import { Origin, PublishState, Article } from '@app/core/models/article.model';
import { ActivatedRoute } from '@angular/router';
import { ArticleService } from '@app/core/services/article.service';
import { LogService } from '@app/core/services/log.service';

@Component({
    templateUrl: "./post.component.html",
    styleUrls: ["./post.component.scss"]
})
export class PostComponent implements OnInit {
    public controlStateClass = formControlStateClass;
    public buildLevelCategories = buildLevelCategories;
    public Origin = Origin;
    public PublishState = PublishState;

    public is_edit: boolean = false;                //添加或编辑
    public edit_form: FormGroup;                    //编辑表单(标题，内容)
    public origin: Origin = Origin.Original;        //来源
    public state: PublishState = PublishState.Published;    //状态
    public fetching = {                             //获取状态
        tag: false,
        category: false,
        article: false
    };
    public tags: Tag[] = [];                        //标签列表
    public categories: Category[] = [];             //目录列表
    public article: Article = {} as Article;        //

    @ViewChild('simplemde') textarea: ElementRef;   //markdown所使用的textarea
    private sme;                                    //markdown编辑器
    private render = md();                        //渲染markdown

    constructor(
        private fb: FormBuilder,
        private route: ActivatedRoute,
        private tagService: TagService,
        private categoryService: CategoryService,
        private articleService: ArticleService,
        private logService: LogService
    ) {
        this.edit_form = this.fb.group({
            title: ["", Validators.compose([Validators.required])]
        });
    }

    ngOnInit() {
        this.getTags();
        this.getCategories();
        this.initMarkdownEditor();

        let article_id: string = this.route.snapshot.queryParams["id"];
        if(article_id) {    //修改文章
            this.is_edit = true;
            this.getArticle(article_id);
        }
    }

    //初始化Markdown编辑器
    private initMarkdownEditor(): void {
        this.render
        .use(mdSub)
        .use(mdSup)
        .use(mdHl);

        let config = {
            element: this.textarea.nativeElement,
            showIcons: ["code", "table", "horizontal-rule", "strikethrough", "heading-smaller"
                , "heading-bigger", "heading-1", "heading-2", "heading-3"],
            spellChecker: false,
            previewRender: () => {
                return this.render.render(this.sme.value());
            },
            autoDownloadFontAwesome: false  //不自动下载font-awesome样式，在index中已经加入了
        };
        config = Object.assign({}, config);
        this.sme = new SimpleMDE(config);
    }

    //获取标签
    public getTags(): void {
        this.fetching.tag = true;

        this.tagService.getAll().subscribe(
            (tags: Tag[]) => {
                this.tags = tags;
                this.fetching.tag = false;
            }
        );
    }

    //获取目录
    public getCategories(): void {
        this.fetching.category = true;

        this.categoryService.getAll().subscribe(
            (categories: Category[]) => {
                this.categories = this.buildLevelCategories(categories);
                this.fetching.category = false;
            }
        );
    }

    //获取文章详情
    public getArticle(id: string): void {
        this.fetching.article = true;

        this.articleService.getOne(id).subscribe(
            (article: Article) => {
                this.article = article;
                this.edit_form.controls["title"].setValue(article.title);
                this.sme.value(article.content);
                this.tags.forEach(
                    (tag: Tag) => {
                        tag["selected"] = article.tags.find((value) => tag._id === value._id)? true: false;
                    }
                );
                this.categories.forEach(
                    (category: Category) => {
                        category["checked"] = article.categories.find((value) => category._id === value._id)? true: false;
                    }
                );
                this.origin = article.origin;
                this.state = article.state;

                this.fetching.article = false;
            }
        );
    }

    //提交文章
    public submitArticle(): void {
        if(!this.edit_form.valid) return;        

        this.article.title = this.edit_form.controls["title"].value;
        this.article.content = this.sme.value();
        this.article.tags = this.tags.filter(tag => tag["selected"]);
        this.article.categories = this.categories.filter(category => category["checked"]);
        this.article.origin = this.origin;
        this.article.state = this.state;

        this.fetching.article = true;

        if(this.is_edit) {
            this.articleService.update(this.article).subscribe(
                (article: Article) => {
                    this.fetching.article = false;

                    if(article) {
                        this.logService.notify("修改文章成功");
                    }
                    else {
                        this.logService.notify("修改文章失败");
                    }
                }
            )
        }
        else {
            this.articleService.create(this.article).subscribe(
                (article: Article) => {
                    this.fetching.article = false;
                    
                    if(article) {
                        this.is_edit = true;
                        this.logService.notify("创建文章成功");
                    }
                    else {
                        this.logService.notify("创建文章失败");
                    }
                }
            );
        }
    }
}